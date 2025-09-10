// api.js — demo and live resolvers
import { settings, makeCoverSVGDataUrl } from './utils.js';

export function isInstagramUrl(v){
  return /https?:\/\/(www\.)?instagram\.com\//i.test(v);
}

export async function mockResolve(link){
  const blob = new Blob([`Aadi Tools demo file for: ${link}\nThis file proves the download button works.`], {type: 'text/plain'});
  const fileUrl = URL.createObjectURL(blob);
  const cover = makeCoverSVGDataUrl();
  return {
    source: 'instagram',
    input: link,
    title: 'Snowy Mountains Timelapse',
    thumb: cover,
    variants: [
      { type: 'video', quality: '720p', format: 'mp4', size: '8.4 MB', url: fileUrl },
      { type: 'video', quality: '480p', format: 'mp4', size: '5.2 MB', url: fileUrl },
      { type: 'image', quality: '1080×1350', format: 'jpg', size: '1.1 MB', url: fileUrl }
    ]
  }
}

export async function liveResolve(link){
  const base = settings.apiBase;
  const res = await fetch(`${base}/resolve?url=${encodeURIComponent(link)}`);
  if(!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}
