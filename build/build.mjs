// build/build.mjs — Génère les pages wiki statiques (FR + EN) depuis data/consoles/*.json
// Usage : node build/build.mjs
// Zéro dépendance externe.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { consolePage, t } from "./templates.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_DIR = join(ROOT, "data", "consoles");
const OUT_DIR = join(ROOT, "wiki");
const OUT_DIR_EN = join(OUT_DIR, "en");
const SITE = "https://openpixel-lab.com";

// Pages statiques (hors data) : [chemin relatif, priorité]
const STATIC_PAGES = [
  ["", "1.0"],
  ["wiki.html", "0.9"],
  ["tools.html", "0.8"],
  ["comparator.html", "0.7"],
  ["configurator.html", "0.7"],
  ["partenaires.html", "0.6"],
  ["about.html", "0.5"],
  ["contribution.html", "0.5"],
];

/** Génère sitemap.xml : pages statiques + fiches console FR/EN avec alternates hreflang. */
function buildSitemap(slugs, today) {
  const entries = [];
  for (const [path, priority] of STATIC_PAGES) {
    entries.push(
      `  <url>\n    <loc>${SITE}/${path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
    );
  }
  for (const slug of slugs) {
    const fr = `${SITE}/wiki/${slug}.html`;
    const en = `${SITE}/wiki/en/${slug}.html`;
    const alts =
      `    <xhtml:link rel="alternate" hreflang="fr" href="${fr}"/>\n` +
      `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n` +
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${fr}"/>`;
    entries.push(`  <url>\n    <loc>${fr}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n${alts}\n  </url>`);
    entries.push(`  <url>\n    <loc>${en}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.7</priority>\n${alts}\n  </url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

async function build() {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.warn("⚠ Aucune donnée console trouvée dans data/consoles/");
    return;
  }

  await mkdir(OUT_DIR_EN, { recursive: true });

  let count = 0;
  const index = [];
  for (const file of files) {
    const raw = await readFile(join(DATA_DIR, file), "utf8");
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error(`✗ JSON invalide dans ${file} : ${err.message}`);
      process.exitCode = 1;
      continue;
    }

    // FR → wiki/<slug>.html
    await writeFile(join(OUT_DIR, `${data.slug}.html`), consolePage(data, "fr"), "utf8");
    // EN → wiki/en/<slug>.html
    await writeFile(join(OUT_DIR_EN, `${data.slug}.html`), consolePage(data, "en"), "utf8");

    const totalMods = data.sections.reduce((n, s) => n + s.mods.length, 0);
    const flagged = data.sections
      .flatMap((s) => s.mods)
      .filter((m) => Array.isArray(m.needsReview) && m.needsReview.length).length;
    console.log(`✓ wiki/${data.slug}.html + en/ (${totalMods} mods, ${flagged} à valider)`);

    // Entrée d'index de recherche bilingue (consommée par js/wiki-search.js)
    index.push({
      slug: data.slug,
      icon: data.icon || "",
      category: data.category,
      year: data.year,
      name: t(data.name, "fr"),
      name_en: t(data.name, "en"),
      fullName: t(data.fullName, "fr"),
      fullName_en: t(data.fullName, "en"),
      url: `wiki/${data.slug}.html`,
      url_en: `wiki/en/${data.slug}.html`,
      mods: data.sections.flatMap((s) =>
        s.mods.map((m) => ({
          id: m.id,
          brand: m.brand || "",
          name: t(m.name, "fr"),
          name_en: t(m.name, "en"),
          section: t(s.name, "fr"),
          section_en: t(s.name, "en"),
        }))
      ),
    });
    count++;
  }

  // Index de recherche global (pas de fetch → fonctionne aussi en file://)
  index.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const indexJs =
    "// Généré automatiquement par build/build.mjs — NE PAS ÉDITER À LA MAIN.\n" +
    `window.OPL_WIKI_INDEX = ${JSON.stringify(index, null, 2)};\n`;
  await writeFile(join(ROOT, "js", "wiki-index.js"), indexJs, "utf8");
  console.log(`✓ js/wiki-index.js  (${index.length} consoles, ${index.reduce((n, c) => n + c.mods.length, 0)} mods indexés, FR+EN)`);

  // sitemap.xml (statiques + fiches FR/EN avec hreflang)
  const today = new Date().toISOString().slice(0, 10);
  const slugs = index.map((c) => c.slug).sort();
  await writeFile(join(ROOT, "sitemap.xml"), buildSitemap(slugs, today), "utf8");
  console.log(`✓ sitemap.xml  (${STATIC_PAGES.length} pages statiques + ${slugs.length} consoles × 2 langues)`);

  console.log(`\n${count} console(s) × 2 langues générées.`);
}

build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
