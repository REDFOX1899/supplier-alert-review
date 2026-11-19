import { reviews, sites } from './minerals.mjs';

const byId = id => document.getElementById(id);
let topic = 'water';
let selected = sites[0];

const lenses = Object.entries(reviews).map(([key, label]) => {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', () => {
    topic = key;
    render();
  });
  byId('lenses').append(button);
  return { key, button };
});

const cards = sites.map(site => {
  const button = document.createElement('button');
  const region = document.createElement('span');
  const project = document.createElement('strong');
  const operator = document.createElement('span');
  const evidence = document.createElement('span');
  region.className = 'region';
  evidence.className = 'card-evidence';
  region.textContent = site.region;
  project.textContent = site.name;
  operator.textContent = site.operator;
  button.append(region, project, operator, evidence);
  button.addEventListener('click', () => {
    selected = site;
    render();
  });
  byId('site-list').append(button);
  return { site, button, evidence };
});

function render() {
  for (const { key, button } of lenses) button.setAttribute('aria-pressed', String(key === topic));
  for (const { site, button, evidence } of cards) {
    button.setAttribute('aria-pressed', String(site === selected));
    evidence.textContent = site.review[topic][0];
  }

  const [finding, claim, request] = selected.review[topic];
  byId('source-type').textContent = selected.name + ' · ' + selected.type;
  byId('finding').textContent = finding;
  byId('claim').textContent = claim;
  byId('request').textContent = request;
  byId('source').href = selected.url;
  byId('source').textContent = selected.evidence + ' ↗';

  const labels = ['Input', 'Process', 'Output'];
  byId('flow').replaceChildren(...selected.route.map((step, index) => {
    const cell = document.createElement('div');
    const label = document.createElement('small');
    const name = document.createElement('strong');
    label.textContent = labels[index];
    name.textContent = step;
    cell.append(label, name);
    return cell;
  }));
}

function drawContours(canvas) {
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return;
  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext('2d');
  context.scale(scale, scale);
  context.translate(width * .68, height * .39);
  for (let ring = 1; ring <= 22; ring++) {
    context.beginPath();
    for (let step = 0; step <= 100; step++) {
      const theta = step / 100 * Math.PI * 2;
      const radius = ring * 12 * (1 + .16 * Math.sin(3 * theta + ring * .06) + .11 * Math.cos(5 * theta));
      const x = Math.cos(theta) * radius * 1.7;
      const y = Math.sin(theta) * radius;
      if (step === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = ring % 5 === 0 ? '#a5a86d65' : '#ae86d33b';
    context.stroke();
  }
}

function appendLead(lead) {
  let url;
  try {
    url = new URL(lead.url);
  } catch {
    return;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  const item = document.createElement('li');
  const link = document.createElement('a');
  const excerpt = document.createElement('p');
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = lead.title || url.hostname;
  excerpt.textContent = lead.content;
  item.append(link, excerpt);
  byId('results').append(item);
}

byId('discover').addEventListener('submit', async event => {
  event.preventDefault();
  const stage = byId('stage').value;
  const button = event.currentTarget.querySelector('button');
  const status = byId('search-status');
  byId('results').replaceChildren();
  status.textContent = 'Searching for ' + stage + ' facilities…';
  button.disabled = true;
  try {
    const response = await fetch('/api/minerals?stage=' + encodeURIComponent(stage), { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    for (const lead of data.leads) appendLead(lead);
    const count = byId('results').childElementCount;
    status.textContent = count + ' web leads for ' + stage + '. Supplier and facility details need verification.';
  } catch (error) {
    status.textContent = error.message || 'The live search failed. Try again.';
  } finally {
    button.disabled = false;
  }
});

const canvas = byId('terrain');
new ResizeObserver(() => drawContours(canvas)).observe(canvas);
render();
