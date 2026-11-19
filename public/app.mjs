import { gloveCase, reviewOrder } from './case.mjs';

const byId = id => document.getElementById(id);
const dateButtons = [...document.querySelectorAll('[data-date]')];
const formatDate = date => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
}).format(new Date(date));
let reviewDate = dateButtons[0].dataset.date;
let selected = gloveCase.orders[0].id;

const orderButtons = gloveCase.orders.map(order => {
  const button = document.createElement('button');
  button.className = 'order';
  const description = document.createElement('span');
  const id = document.createElement('small');
  id.textContent = order.id + ' · ' + order.vendor;
  const product = document.createElement('strong');
  product.textContent = order.product;
  description.append(id, product);
  const pill = document.createElement('span');
  button.append(description, pill);
  button.addEventListener('click', () => {
    selected = order.id;
    render();
  });
  byId('orders').append(button);
  return { order, button, pill };
});

function renderOrder(order, result) {
  byId('order-id').textContent = order.id;
  byId('order-status').className = 'pill ' + result.tone;
  byId('order-status').textContent = result.status;
  byId('reason').textContent = result.reason;

  const facts = new Map([
    ['Tariff code', order.code],
    ['Planned import', formatDate(order.importDate)],
    ['Manufacturer', order.manufacturer || 'Unknown'],
    ['Production country', order.country || 'Unknown']
  ]);
  byId('facts').replaceChildren();
  for (const [name, value] of facts) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = name;
    description.textContent = value;
    byId('facts').append(term, description);
  }

  const notice = result.notice;
  byId('source').hidden = !notice;
  if (notice) {
    byId('source-date').textContent = 'CBP · ' + formatDate(notice.effective);
    byId('source-link').href = notice.url;
    byId('source-link').textContent = notice.title + ' ↗';
    byId('source-summary').textContent = notice.summary;
  }
}

function render() {
  byId('review-date').textContent = formatDate(reviewDate);
  for (const button of dateButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.date === reviewDate));
  }
  for (const { order, button, pill } of orderButtons) {
    const result = reviewOrder(order, reviewDate, gloveCase);
    const current = order.id === selected;
    button.setAttribute('aria-pressed', String(current));
    pill.className = 'pill ' + result.tone;
    pill.textContent = result.status;
    if (current) renderOrder(order, result);
  }
}

for (const button of dateButtons) {
  button.addEventListener('click', () => {
    reviewDate = button.dataset.date;
    render();
  });
}

byId('check').addEventListener('click', async () => {
  const button = byId('check');
  const status = byId('verification');
  button.disabled = true;
  status.textContent = 'Checking Search and Extract for both notices…';
  try {
    const response = await fetch('/api/evidence', { method: 'POST' });
    if (!response.ok) throw new Error('Request returned HTTP ' + response.status);
    const { mode, checks } = await response.json();
    const passed = checks.filter(check => check.ok).length;
    const errors = checks.filter(check => !check.ok).map(check => check.id + ' — ' + check.message);
    status.textContent = 'Tavily ' + mode + ' · ' + passed + ' of ' + checks.length +
      ' notices verified with Search and Extract.' + (errors.length ? ' ' + errors.join(' ') + ' The reviewed case is still available.' : '');
  } catch {
    status.textContent = 'Could not reach the evidence check. The reviewed case is still available.';
  } finally {
    button.disabled = false;
  }
});

render();
