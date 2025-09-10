// app.js — main UI bindings
import { settings, setDemo, setApiBase, toast, copy, loading, makeFilename } from './utils.js';
import { isInstagramUrl, mockResolve, liveResolve } from './api.js';

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const urlInput = document.getElementById('url');
const pasteBtn = document.getElementById('pasteBtn');
const form = document.getElementById('grabForm');
const results = document.getElementById('results');
const demoToggle = document.getElementById('demoToggle');
const apiBaseBtn = document.getElementById('apiBaseBtn');
const themeToggle = document.getElementById('themeToggle');
const demoIndicator = document.getElementById('demoIndicator');

// Init demo label
setDemo(settings.demo);

// Theme switcher: indigo/fuchsia <-> teal/orange
themeToggle?.addEventListener('click', () => {
  const usingTeal = document.documentElement.classList.toggle('teal');
  themeToggle.setAttribute('aria-pressed', usingTeal ? 'true' : 'false');
  document.body.style.setProperty('--brand-1', usingTeal ? '13 148 136' : '60 22 192'); // teal-500 vs indigo-700
  document.body.style.setProperty('--brand-2', usingTeal ? '249 115 22' : '147 51 234'); // orange-500 vs fuchsia-600
});

demoToggle?.addEventListener('click', () => setDemo(!settings.demo));

apiBaseBtn?.addEventListener('click', () => {
  const val = prompt('Enter API Base URL (e.g., http://localhost:3030 or https://api.aaditools.com)', settings.apiBase);
  if(val){ setApiBase(val); toast('API base saved'); }
});

// Paste button (Clipboard API)
pasteBtn?.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if(text) urlInput.value = text.trim();
    urlInput.focus();
  } catch (e) {
    alert('Paste failed. Please use Ctrl/Cmd + V.');
  }
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  results.innerHTML = '';

  const raw = urlInput.value.trim();
  if(!raw){ urlInput.focus(); return; }
  if(!isInstagramUrl(raw)){
    toast('Please paste a valid Instagram link.');
    return;
  }

  loading(true);
  try {
    const data = settings.demo ? await mockResolve(raw) : await liveResolve(raw);
    renderResults(data);
  } catch (err){
    toast(err.message || 'Unable to resolve this link.');
  } finally { loading(false); }
});

function renderResults(data){
  const t = document.getElementById('resultTemplate');
  const rowT = document.getElementById('rowTemplate');
  const node = t.content.firstElementChild.cloneNode(true);
  node.querySelector('[data-thumb]').src = data.thumb;
  node.querySelector('[data-title]').textContent = data.title || 'Instagram Media';
  node.querySelector('[data-subtitle]').textContent = `${data.source ?? 'Instagram'} • ${new Date().toLocaleTimeString()}`;
  node.querySelector('[data-copybtn]').addEventListener('click', () => copy(data.input));

  const tbody = node.querySelector('[data-rows]');
  (data.variants || []).forEach(v => {
    const r = rowT.content.firstElementChild.cloneNode(true);
    const cells = r.querySelectorAll('td');
    cells[0].textContent = v.type;
    cells[1].textContent = v.quality;
    cells[2].textContent = (v.format || '').toUpperCase();
    cells[3].textContent = v.size || '—';
    const a = r.querySelector('a');
    a.href = v.url;
    a.download = makeFilename(data.title, v);
    tbody.appendChild(r);
  });
  results.appendChild(node);
  results.classList.remove('hidden');
}

// On load, update indicator
if(demoIndicator) demoIndicator.textContent = `Demo: ${settings.demo ? 'on' : 'off'}`;
