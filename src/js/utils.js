// utils.js — common helpers and settings
export const settings = {
  demo: JSON.parse(localStorage.getItem('aadi.demo') ?? 'true'),
  apiBase: localStorage.getItem('aadi.apiBase') || 'http://localhost:3030'
};

export function setDemo(val){
  settings.demo = Boolean(val);
  localStorage.setItem('aadi.demo', JSON.stringify(settings.demo));
  const indicator = document.getElementById('demoIndicator');
  if(indicator) indicator.textContent = `Demo: ${settings.demo ? 'on' : 'off'}`;
}

export function setApiBase(base){
  if(!base) return;
  settings.apiBase = base.replace(/\/$/, '');
  localStorage.setItem('aadi.apiBase', settings.apiBase);
}

export function toast(msg){
  const t = document.createElement('div');
  t.role = 'status';
  t.className = 'fixed inset-x-0 top-4 z-50 mx-auto w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-soft';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

export async function copy(text){
  try { await navigator.clipboard.writeText(text); toast('Link copied'); }
  catch { toast('Copy failed'); }
}

export function loading(on){
  const btn = document.querySelector('#grabForm button[type="submit"]');
  if(!btn) return;
  if(on){
    btn.dataset.prev = btn.innerHTML;
    btn.innerHTML = '<svg class="mr-2 inline h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="4" fill="none" opacity="0.25"/><path d="M22 12a10 10 0 0 1-10 10" stroke="white" stroke-width="4" fill="none"/></svg>Working...';
    btn.disabled = true; btn.classList.add('opacity-80');
  } else {
    if(btn.dataset.prev){ btn.innerHTML = btn.dataset.prev; btn.disabled = false; btn.classList.remove('opacity-80'); }
  }
}

export function makeFilename(title, v){
  const base = (title || 'aaditools').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const ext = (v.format || 'mp4').toLowerCase();
  return `${base}-${v.quality || v.type}.${ext}`;
}

export function makeCoverSVGDataUrl(){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='%23a78bfa'/><stop offset='100%' stop-color='%23f472b6'/></linearGradient></defs>
    <rect width='800' height='450' fill='url(%23g)'/>
    <g fill='white' fill-opacity='.95'><circle cx='400' cy='210' r='96'/><circle cx='400' cy='210' r='40' fill='%23f472b6'/><rect x='500' y='120' rx='10' width='56' height='56' /></g>
    <text x='400' y='375' text-anchor='middle' font-family='ui-sans-serif,system-ui' font-size='28' fill='white'>Aadi Tools • Preview</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}
