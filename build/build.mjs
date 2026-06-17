// build/build.mjs — Génère les pages wiki statiques depuis data/consoles/*.json
// Usage : node build/build.mjs
// Zéro dépendance externe.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { consolePage } from "./templates.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_DIR = join(ROOT, "data", "consoles");
const OUT_DIR = join(ROOT, "wiki");

async function build() {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.warn("⚠ Aucune donnée console trouvée dans data/consoles/");
    return;
  }

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
    const html = consolePage(data);
    const outPath = join(OUT_DIR, `${data.slug}.html`);
    await writeFile(outPath, html, "utf8");
    const flagged = data.sections
      .flatMap((s) => s.mods)
      .filter((m) => Array.isArray(m.needsReview) && m.needsReview.length).length;
    console.log(`✓ wiki/${data.slug}.html  (${data.sections.reduce((n, s) => n + s.mods.length, 0)} mods, ${flagged} à valider)`);

    // Entrée d'index de recherche (consommée par js/wiki-search.js)
    index.push({
      slug: data.slug,
      name: data.name,
      fullName: data.fullName,
      icon: data.icon || "",
      category: data.category,
      year: data.year,
      url: `wiki/${data.slug}.html`,
      mods: data.sections.flatMap((s) =>
        s.mods.map((m) => ({ id: m.id, name: m.name, brand: m.brand || "", section: s.name }))
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
  console.log(`✓ js/wiki-index.js  (${index.length} consoles, ${index.reduce((n, c) => n + c.mods.length, 0)} mods indexés)`);

  console.log(`\n${count} page(s) générée(s).`);
}

build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
