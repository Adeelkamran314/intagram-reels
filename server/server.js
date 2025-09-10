// server/server.js — Aadi Tools API (RapidAPI: instagram120)

require('dotenv').config();
const fetch = require('node-fetch'); // v2 CJS-friendly

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Static demo files (just in case)
app.use('/files', express.static(path.join(__dirname, 'public')));

// Basic rate limit
const limiter = rateLimit({ windowMs: 60 * 1000, limit: 120 });
app.use(limiter);

// ====== RapidAPI config ======
const BASE = (process.env.UPSTREAM_BASE || '').replace(/\/$/, '');
const HOST = process.env.UPSTREAM_HOST || '';
const KEY = process.env.UPSTREAM_KEY || '';

// Helper: common RapidAPI GET
async function rapidGet(pathWithQuery) {
    if (!BASE || !HOST || !KEY) {
        throw new Error('UPSTREAM env missing (BASE/HOST/KEY)');
    }
    const url = `${BASE}${pathWithQuery}`;
    const r = await fetch(url, {
        headers: {
            'X-RapidAPI-Key': KEY,
            'X-RapidAPI-Host': HOST
        }
    });
    const text = await r.text();
    if (!r.ok) {
        // throw with body for better logs
        throw new Error(`Upstream ${r.status}: ${text}`);
    }
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`Upstream bad JSON: ${text.slice(0, 250)}`);
    }
}

// Helper: URL validate + canonicalize + shortcode extract
function parseInstagramUrl(rawUrl) {
    let u;
    try {
        u = new URL(decodeURIComponent(rawUrl));
    } catch {
        return { error: 'Invalid URL' };
    }
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (!host.endsWith('instagram.com')) {
        return { error: 'URL must be from instagram.com' };
    }
    const m = u.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!m) {
        return { error: 'Invalid Instagram post URL. Copy the FULL link (no … ellipsis).' };
    }
    const type = m[1];
    const shortcode = m[2];
    const canonical = `https://www.instagram.com/${type}/${shortcode}/`;
    return { canonical, shortcode };
}

// ========== /resolve ==========
app.get('/resolve', async(req, res) => {
    try {
        const link = req.query.url;
        if (!link) return res.status(400).json({ error: 'Missing Instagram URL' });

        const parsed = parseInstagramUrl(link);
        if (parsed.error) return res.status(400).json({ error: parsed.error });

        const { canonical, shortcode } = parsed;

        // Try provider with ?url= first; fallback to ?shortcode=
        let upstream;
        try {
            upstream = await rapidGet(`/api/instagram/get?url=${encodeURIComponent(canonical)}`);
        } catch (e1) {
            // Optional: try shortcode param if provider supports it
            try {
                upstream = await rapidGet(`/api/instagram/get?shortcode=${encodeURIComponent(shortcode)}`);
            } catch (e2) {
                console.error('Upstream failed:', e1.message || e1, '| fallback:', e2.message || e2);
                return res.status(502).json({ error: 'Upstream failed or not configured correctly' });
            }
        }

        // ---- Map upstream → UI schema defensively ----
        const variants = [];
        const pushVid = (url, q = '') =>
            url && variants.push({ type: 'video', quality: q, format: 'mp4', size: '—', url });
        const pushImg = (url, q = '') =>
            url && variants.push({ type: 'image', quality: q, format: 'jpg', size: '—', url });

        // Try common shapes (providers differ a lot)
        // 1) Direct fields
        if (upstream) {
            pushVid(upstream.video_url || upstream.videoUrl, upstream.quality);
            pushImg(upstream.image_url || upstream.imageUrl, upstream.dimensions || upstream.quality);
        }

        // 2) resources array
        if (Array.isArray(upstream ? !!resources)) {
            for (const r of upstream.resources) {
                pushVid(r.video_url || r.videoUrl, r.quality);
                pushImg(r.image_url || r.imageUrl, r.dimensions || r.quality);
            }
        }

        // 3) items array (carousel/multi)
        if (Array.isArray(upstream ? .items)) {
            for (const it of upstream.items) {
                pushVid(it.video_url || it.videoUrl, it.quality);
                pushImg(it.image_url || it.imageUrl, it.dimensions || it.quality);
                if (Array.isArray(it.resources)) {
                    for (const r of it.resources) {
                        pushVid(r.video_url || r.videoUrl, r.quality);
                        pushImg(r.image_url || r.imageUrl, r.dimensions || r.quality);
                    }
                }
            }
        }

        // Fallback to mock if nothing was mapped
        if (variants.length === 0) {
            // As a last resort, return your old demo so UI still works
            const base = `${req.protocol}://${req.get('host')}`;
            const fileUrl = `${base}/files/demo.txt`;
            const cover = `${base}/files/cover.svg`;
            return res.json({
                source: 'instagram',
                input: canonical,
                title: upstream ? .title || upstream ? .caption || 'Aadi Tools Live Demo'
                thumb: upstream ? .thumb || upstream ? .thumbnail_url || upstream ? .thumbnail || cover
                variants: [
                    { type: 'video', quality: '1080p', format: 'mp4', size: '15 MB', url: fileUrl },
                    { type: 'video', quality: '720p', format: 'mp4', size: '8.4 MB', url: fileUrl },
                    { type: 'video', quality: '480p', format: 'mp4', size: '5.2 MB', url: fileUrl },
                    { type: 'image', quality: '1080×1350', format: 'jpg', size: '1.1 MB', url: fileUrl }
                ]
            });
        }

        // Build final payload
        return res.json({
            source: 'instagram',
            input: canonical,
            title: upstream ? .title ||
                upstream ? .caption ||
                upstream ? .description ||
                'Instagram',
            thumb: upstream ? .thumb ||
                upstream ? .thumbnail_url ||
                upstream ? .thumbnail ||
                null,
            variants
        });
    } catch (err) {
        console.error('Resolve error:', err.message || err);
        return res.status(500).json({ error: 'Failed to resolve media' });
    }
});

// sanity routes
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/', (_req, res) => res.send('API OK. Try /resolve?url=<instagram_url>'));

// listen on all interfaces (LAN)
const port = process.env.PORT || 3030;
const host = '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Aadi Tools API running on http://${host}:${port}`);
});