# Aadi Tools — Instagram Downloader (Landing Page)

A clean, modern front-end (Tailwind + vanilla JS) with **demo mode** and an optional **Node/Express mock API** so you can test the full flow locally.

## Quick Start (Front‑end only)
```bash
# Serve /src with any static server (pick one)
npx http-server ./src -p 5173 -c-1
# or use your IDE's Live Server / simple Python server:
python3 -m http.server --directory src 5173
```

Open http://localhost:5173 and try Demo mode (it's ON by default).

## Optional: Run Local API (Live Mode)
```bash
npm install
npm run api
```
This starts a mock resolver at http://localhost:3030/resolve. Switch Demo OFF on the page and it will call your API.
You can change API Base from the prompt; it's stored in `localStorage` as `aadi.apiBase`.

## Structure
```
aadi-tools/
  ├─ src/            # Static front-end
  │  ├─ index.html
  │  ├─ styles.css
  │  ├─ js/
  │  │  ├─ app.js
  │  │  ├─ api.js
  │  │  └─ utils.js
  │  └─ assets/
  │     └─ favicon.svg
  ├─ server/         # Optional Express mock API
  │  ├─ server.js
  │  └─ public/
  │     ├─ demo.txt
  │     └─ cover.svg
  └─ package.json
```

## Wire your real backend
When you have your own resolver, implement:
```
GET /resolve?url=<instagram-url>
```
Return JSON like:
```json
{
  "source": "instagram",
  "input": "https://www.instagram.com/reel/XXXX/",
  "title": "Your media title",
  "thumb": "https://…/cover.jpg",
  "variants": [
    { "type": "video", "quality": "720p", "format": "mp4", "size": "8.4 MB", "url": "https://…/video-720.mp4" },
    { "type": "image", "quality": "1080×1350", "format": "jpg", "size": "1.1 MB", "url": "https://…/image.jpg" }
  ]
}

The front‑end will render rows and set a friendly filename on the download link.

## Legal
Use this only for content you own or have permission to save. Connect to official/authorized APIs or licensed providers for production.
