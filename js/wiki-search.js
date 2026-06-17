// js/wiki-search.js — Recherche live sur le wiki (consoles + mods).
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

  // Aplatissement : consoles + mods en une liste de cibles recherchables
  const targets = [];
  index.forEach((c) => {
    targets.push({
      type: "console",
      label: c.fullName || c.name,
      sub: `${c.year || ""} · ${c.mods.length} mods`,
      icon: c.icon || "🎮",
      url: c.url,
      hay: norm(`${c.name} ${c.fullName}`),
    });
    c.mods.forEach((m) => {
      targets.push({
        type: "mod",
        label: m.name,
        sub: `${m.brand ? m.brand + " · " : ""}${c.name} · ${m.section}`,
        icon: "🔧",
        url: `${c.url}#${m.id}`,
        hay: norm(`${m.name} ${m.brand} ${c.name}`),
      });
    });
  });

  let currentResults = [];

  function render(results) {
    currentResults = results;
    if (results.length === 0) {
      panel.innerHTML = `<div class="wiki-search-empty">Aucun résultat — essaie « IPS », « USB-C », « HDMI », « DMG »…</div>`;
      panel.hidden = false;
      return;
    }
    panel.innerHTML = results
      .map(
        (r) => `<a class="wiki-search-item" href="${r.url}" role="option">
        <span class="wsi-icon">${r.icon}</span>
        <span class="wsi-body"><span class="wsi-label">${escapeHtml(r.label)}</span><span class="wsi-sub">${escapeHtml(r.sub)}</span></span>
        <span class="wsi-type wsi-type--${r.type}">${r.type === "console" ? "Console" : "Mod"}</span>
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
        // Score : consoles d'abord, puis match en début de label
        let score = t.type === "console" ? 0 : 10;
        if (norm(t.label).startsWith(tokens[0])) score -= 3;
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
