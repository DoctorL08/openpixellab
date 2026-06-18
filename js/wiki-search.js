// js/wiki-search.js — Recherche live sur le wiki (consoles + mods), bilingue FR/EN.
// Dépend de js/wiki-index.js (window.OPL_WIKI_INDEX), généré par le build.

(function () {
  const input = document.getElementById("wiki-search-input");
  const index = window.OPL_WIKI_INDEX;
  if (!input || !Array.isArray(index)) return;

  // Conteneur de résultats inséré juste après la barre de recherche
  const searchBar = input.closest(".search-bar") || input.parentElement;
  const panel = document.createElement("div");
  panel.id = "wiki-search-results";
  panel.className = "wiki-search-results";
  panel.setAttribute("role", "listbox");
  panel.hidden = true;
  searchBar.insertAdjacentElement("afterend", panel);

  const MAX = 12;
  const norm = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();

  const lang = () =>
    ((localStorage.getItem("lang") || document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr");

  const STR = {
    fr: { console: "Console", mod: "Mod", empty: "Aucun résultat — essaie « IPS », « USB-C », « HDMI », « DMG »…" },
    en: { console: "Console", mod: "Mod", empty: "No results — try “IPS”, “USB-C”, “HDMI”, “DMG”…" },
  };

  // Aplatissement : consoles + mods, avec champs des deux langues (résolus au rendu)
  const targets = [];
  index.forEach((c) => {
    targets.push({
      type: "console",
      icon: c.icon || "🎮",
      label_fr: c.fullName || c.name,
      label_en: c.fullName_en || c.name_en || c.fullName || c.name,
      sub_fr: `${c.year || ""} · ${c.mods.length} mods`,
      sub_en: `${c.year || ""} · ${c.mods.length} mods`,
      url_fr: c.url,
      url_en: c.url_en || c.url,
      hay: norm(`${c.name} ${c.fullName} ${c.name_en} ${c.fullName_en}`),
    });
    c.mods.forEach((m) => {
      targets.push({
        type: "mod",
        icon: "🔧",
        label_fr: m.name,
        label_en: m.name_en || m.name,
        sub_fr: `${m.brand ? m.brand + " · " : ""}${c.name} · ${m.section}`,
        sub_en: `${m.brand ? m.brand + " · " : ""}${c.name_en || c.name} · ${m.section_en || m.section}`,
        url_fr: `${c.url}#${m.id}`,
        url_en: `${c.url_en || c.url}#${m.id}`,
        hay: norm(`${m.name} ${m.name_en} ${m.brand} ${c.name} ${c.name_en}`),
      });
    });
  });

  let currentResults = [];

  function resolve(t, lg) {
    return {
      type: t.type,
      icon: t.icon,
      label: lg === "en" ? t.label_en : t.label_fr,
      sub: lg === "en" ? t.sub_en : t.sub_fr,
      url: lg === "en" ? t.url_en : t.url_fr,
    };
  }

  function render(results) {
    const lg = lang();
    currentResults = results.map((t) => resolve(t, lg));
    if (currentResults.length === 0) {
      panel.innerHTML = `<div class="wiki-search-empty">${escapeHtml(STR[lg].empty)}</div>`;
      panel.hidden = false;
      return;
    }
    panel.innerHTML = currentResults
      .map(
        (r) => `<a class="wiki-search-item" href="${r.url}" role="option">
        <span class="wsi-icon">${r.icon}</span>
        <span class="wsi-body"><span class="wsi-label">${escapeHtml(r.label)}</span><span class="wsi-sub">${escapeHtml(r.sub)}</span></span>
        <span class="wsi-type wsi-type--${r.type}">${r.type === "console" ? STR[lg].console : STR[lg].mod}</span>
      </a>`
      )
      .join("");
    panel.hidden = false;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function search(q) {
    const nq = norm(q);
    if (nq.length < 2) {
      panel.hidden = true;
      currentResults = [];
      return;
    }
    const tokens = nq.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const t of targets) {
      if (tokens.every((tok) => t.hay.includes(tok))) {
        let score = t.type === "console" ? 0 : 10;
        if (t.hay.startsWith(tokens[0])) score -= 3;
        scored.push({ t, score });
      }
    }
    scored.sort((a, b) => a.score - b.score);
    render(scored.slice(0, MAX).map((s) => s.t));
  }

  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => search(input.value), 110);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentResults[0]) window.location.href = currentResults[0].url;
    } else if (e.key === "Escape") {
      input.value = "";
      panel.hidden = true;
    }
  });

  // Le bouton "Rechercher" déclenche la navigation vers le 1er résultat
  const btn = searchBar.querySelector("button");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentResults[0]) window.location.href = currentResults[0].url;
      else search(input.value);
    });
  }

  // Fermer le panneau au clic extérieur
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== input && !searchBar.contains(e.target)) {
      panel.hidden = true;
    }
  });
  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 2) search(input.value);
  });
})();
