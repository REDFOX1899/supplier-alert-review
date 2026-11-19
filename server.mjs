import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gloveCase } from './public/case.mjs';
import { discovery } from './public/minerals.mjs';

const assets = new Map([
  ['/', ['minerals.html', 'text/html; charset=utf-8']],
  ['/gloves', ['index.html', 'text/html; charset=utf-8']],
  ['/minerals.css', ['minerals.css', 'text/css; charset=utf-8']],
  ['/minerals.mjs', ['minerals.mjs', 'text/javascript; charset=utf-8']],
  ['/minerals-ui.mjs', ['minerals-ui.mjs', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/case.mjs', ['case.mjs', 'text/javascript; charset=utf-8']]
]);
const key = process.env.TAVILY_API_KEY?.trim();
const mode = key ? 'API key' : 'Keyless';
let activeCheck;

async function tavily(endpoint, body) {
  const response = await fetch('https://api.tavily.com/' + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { Authorization: 'Bearer ' + key } : { 'X-Tavily-Access-Mode': 'keyless' })
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Tavily ' + endpoint + ' returned HTTP ' + response.status + '.');
  return response.json();
}

async function findNotice(notice) {
  const search = await tavily('search', {
    query: notice.search,
    include_domains: ['govinfo.gov', 'federalregister.gov'],
    search_depth: 'basic',
    max_results: 5
  });
  const hit = (search.results ?? []).find(result => result.url?.includes(notice.id));
  if (!hit) throw new Error('Search did not return the expected Federal Register document.');
  return hit.url;
}

async function extractNotice(notice) {
  const extraction = await tavily('extract', { urls: [notice.url] });
  const content = extraction.results?.find(result => result.url === notice.url)?.raw_content;
  const normalized = content?.replace(/\s+/g, ' ').toLowerCase();
  if (!normalized?.includes('top glove') || !normalized.includes('disposable gloves')) {
    throw new Error('Extraction did not contain the expected notice text.');
  }
  return content.length;
}

async function checkNotice(notice) {
  const [search, extract] = await Promise.allSettled([findNotice(notice), extractNotice(notice)]);
  const failures = [search, extract].filter(stage => stage.status === 'rejected');
  if (failures.length) {
    return {
      id: notice.id,
      ok: false,
      message: failures.map(stage => stage.reason.name === 'TimeoutError'
        ? 'Tavily timed out.'
        : stage.reason.message).join(' ')
    };
  }
  return { id: notice.id, ok: true, searchUrl: search.value, extractUrl: notice.url, characters: extract.value };
}

async function checkEvidence() {
  return { mode, checks: await Promise.all(gloveCase.notices.map(checkNotice)) };
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

async function searchMinerals(res, stage) {
  if (!Object.hasOwn(discovery, stage)) {
    sendJson(res, 400, { error: 'Choose extraction, refining, or recycling.' });
    return;
  }
  try {
    const response = await tavily('search', {
      query: discovery[stage],
      search_depth: 'basic',
      max_results: 5,
      include_answer: false
    });
    const leads = (response.results ?? []).map(({ title, url, content }) => ({
      title, url, content: content?.slice(0, 270)
    }));
    sendJson(res, 200, { leads });
  } catch (error) {
    sendJson(res, 502, { error: error.name === 'TimeoutError' ? 'Tavily timed out.' : error.message });
  }
}

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const [path, query] = req.url.split('?');

  if ((path === '/api/evidence' || path === '/api/minerals') && req.method === 'POST') {
    if (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host) {
      res.writeHead(403).end();
      return;
    }
    if (path === '/api/minerals') {
      await searchMinerals(res, new URLSearchParams(query).get('stage'));
      return;
    }
    activeCheck ??= checkEvidence().finally(() => { activeCheck = undefined; });
    sendJson(res, 200, await activeCheck);
    return;
  }

  const asset = req.method === 'GET' && assets.get(path);
  if (!asset) {
    res.writeHead(404).end('Not found');
    return;
  }
  try {
    const [file, type] = asset;
    const content = await readFile(new URL('./public/' + file, import.meta.url));
    res.writeHead(200, { 'Content-Type': type }).end(content);
  } catch {
    res.writeHead(500).end('Could not load the app.');
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '127.0.0.1', () => {
  console.log('Trace Lithium · http://127.0.0.1:' + port + ' · Tavily ' + mode);
});
