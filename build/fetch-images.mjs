// Récupère les photos produit (og:image) des pages buyLinks/sources de chaque mod,
// les convertit en webp (max 900px) dans Images/mods/<id>.webp, remplit image.src + credit
// et retire "image" de needsReview. Édition texte ciblée par id → diff minimal.
//
// Usage : node build/fetch-images.mjs [--only=id1,id2] [--limit=N] [--force]
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data", "consoles");
const IMG_DIR = join(ROOT, "Images", "mods");
const UA = "Mozilla/5.0 (compatible; OpenPixelLabBot/1.0; +https://github.com/DoctorL08)";

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, "").split("=");
  return [k, v ?? true];
}));
const only = args.only ? new Set(String(args.only).split(",")) : null;
const limit = args.limit ? Number(args.limit) : Infinity;
const force = !!args.force;

async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

function extractImage(html, pageUrl) {
  const grab = (re) => { const m = html.match(re); return m ? m[1] : null; };
  let u =
    grab(/<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i) ||
    grab(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    grab(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (!u) return null;
  u = u.replace(/&amp;/g, "&").trim();
  if (u.startsWith("//")) u = "https:" + u;
  else if (u.startsWith("http://")) u = "https://" + u.slice(7);
  else if (u.startsWith("/")) { const o = new URL(pageUrl); u = `${o.protocol}//${o.host}${u}`; }
  return u;
}

async function toWebp(imgUrl, id) {
  const r = await fetch(imgUrl, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`img HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const out = join(IMG_DIR, `${id}.webp`);
  const info = await sharp(buf).rotate().resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  return { out, kb: Math.round(info.size / 1024) };
}

// remplace, dans le bloc du mod `id`, la ligne image (src/credit) + retire "image" de needsReview
function patch(text, id, src, credit) {
  const idIdx = text.indexOf(`"id": "${id}"`);
  if (idIdx === -1) return { text, ok: false, why: "id introuvable" };
  // borne : début du mod suivant (ou fin)
  const next = text.indexOf(`"id": "`, idIdx + 1);
  const end = next === -1 ? text.length : next;
  let block = text.slice(idIdx, end);

  const imgLineRe = /("image":\s*\{\s*"src":\s*)""(\s*,[\s\S]*?"credit":\s*)""(\s*\})/;
  if (!imgLineRe.test(block)) return { text, ok: false, why: "champ image vide introuvable" };
  block = block.replace(imgLineRe, (_m, a, mid, z) => `${a}${JSON.stringify(src)}${mid}${JSON.stringify(credit)}${z}`);

  block = block.replace(/("needsReview":\s*\[)([^\]]*)\]/, (_m, head, body) => {
    const items = body.split(",").map((x) => x.trim()).filter((x) => x && x !== '"image"');
    return head + items.join(", ") + "]";
  });

  return { text: text.slice(0, idIdx) + block + text.slice(end), ok: true };
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  const files = (await readdir(DATA)).filter((f) => f.endsWith(".json"));
  let done = 0, skipped = 0, failed = 0, processed = 0;

  for (const f of files) {
    const path = join(DATA, f);
    let text = await readFile(path, "utf8");
    const data = JSON.parse(text);
    const mods = (data.sections || []).flatMap((s) => s.mods || []);
    let changed = false;

    for (const mod of mods) {
      if (processed >= limit) break;
      if (only && !only.has(mod.id)) continue;
      const needs = (mod.needsReview || []).includes("image");
      if (mod.image?.src && !force) { continue; }
      if (!needs && !force && !(only && only.has(mod.id))) continue;

      const url = mod.buyLinks?.[0]?.url || mod.sources?.[0]?.url;
      const credit = mod.buyLinks?.[0]?.label || mod.sources?.[0]?.label || (url ? new URL(url).hostname : "");
      if (!url) { console.log(`⚠ ${mod.id} (${f}) — aucune URL source`); failed++; continue; }
      processed++;

      try {
        const html = await fetchText(url);
        const imgUrl = extractImage(html, url);
        if (!imgUrl) throw new Error("pas d'og:image");
        const { kb } = await toWebp(imgUrl, mod.id);
        const res = patch(text, mod.id, `Images/mods/${mod.id}.webp`, credit);
        if (!res.ok) throw new Error(res.why);
        text = res.text; changed = true; done++;
        console.log(`✓ ${mod.id} ← ${credit} (${kb} Ko)`);
      } catch (e) {
        console.log(`✗ ${mod.id} (${f}) — ${e.message} [${url}]`);
        failed++;
      }
    }

    if (changed) {
      JSON.parse(text); // garde-fou : on n'écrit jamais un JSON cassé
      await writeFile(path, text, "utf8");
    }
  }
  console.log(`\n— terminé : ${done} récupérées, ${failed} échecs, ${skipped} ignorées —`);
}

main().catch((e) => { console.error(e); process.exit(1); });
