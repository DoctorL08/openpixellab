// build/templates.mjs — Partials de layout partagés + rendu des pages wiki.
// Source de vérité unique pour header/footer/head : éditer ICI, pas dans chaque HTML.

const DISCORD = "https://discord.gg/jgE5CAmXw2";

export function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** <head> commun. `base` = '' à la racine, '../' pour les sous-pages wiki. */
export function head({ title, description, base = "", extraCss = [], canonical = "", ogImage = "" }) {
  const cssLinks = ["css/style.css", ...extraCss]
    .map((href) => `    <link rel="stylesheet" href="${base}${href}">`)
    .join("\n");
  const og = ogImage || `${base}Images/Logo OpenPixel Lab.png`;
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
    <meta charset="UTF-8">
    <script>(function(){var t=localStorage.getItem('opl-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();</script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(description)}">
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
    <title>${escapeHtml(title)}</title>

    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${og}">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="icon" type="image/png" href="${base}Images/Logo OpenPixel Lab.png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=VT323&display=swap" rel="stylesheet">

    <!-- Styles -->
${cssLinks}
</head>`;
}

/** Header commun. `active` ∈ {home,wiki,tools,partners}. */
export function header({ base = "", active = "" }) {
  const link = (page, href, key, label) =>
    `<a href="${base}${href}" class="nav-link${active === page ? " active" : ""}" data-i18n="${key}">${label}</a>`;
  return `    <header class="header">
        <div class="container nav-container">
            <div class="logo-container" onclick="window.location.href='${base}index.html'" style="cursor:pointer;">
                <img src="${base}Images/Logo OpenPixel Lab clear.png" alt="OpenPixel Lab Logo" class="logo-img theme-logo">
                <span class="logo-text">OpenPixel Lab</span>
            </div>
            <div class="nav-right">
                <nav class="nav-links" id="nav-links">
                    ${link("home", "index.html", "nav_home", "Accueil")}
                    ${link("wiki", "wiki.html", "nav_wiki", "Wiki")}
                    ${link("tools", "tools.html", "nav_tools", "Tools")}
                    ${link("partners", "partenaires.html", "nav_partners", "Partenaires")}
                    <a href="${base}index.html#communaute" class="nav-link btn-primary" data-i18n="nav_join">Rejoindre la commu</a>
                    <button id="lang-toggle" class="lang-toggle" aria-label="Toggle Language">
                        <span class="lang-icon">FR</span>
                    </button>
                </nav>
                <button id="theme-toggle" class="theme-toggle theme-moon" aria-label="Toggle Theme">
                    <span class="theme-icon">🌙</span>
                </button>
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>`;
}

/** Footer commun. */
export function footer({ base = "" }) {
  return `    <footer class="footer">
        <div class="container footer-container">
            <div class="footer-brand">
                <div class="logo-container">
                    <img src="${base}Images/Logo OpenPixel Lab clear.png" alt="OpenPixel Lab Logo" class="logo-img-small theme-logo">
                    <span class="logo-text">OpenPixel Lab</span>
                </div>
                <p data-i18n="footer_brand_desc">Le wiki de référence pour le modding retrogaming.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);" data-i18n="footer_brand_credit">Créé avec passion par Doctor L.</p>
            </div>
            <div class="footer-links">
                <div class="link-group">
                    <h4 data-i18n="footer_res_title">Ressources</h4>
                    <a href="${base}wiki.html" data-i18n="nav_wiki">Wiki</a>
                    <a href="${base}tools.html" data-i18n="nav_tools">Tools</a>
                    <a href="${base}partenaires.html" data-i18n="nav_partners">Partenaires</a>
                </div>
                <div class="link-group">
                    <h4 data-i18n="footer_proj_title">Projet</h4>
                    <a href="${base}about.html" data-i18n="footer_about">À propos</a>
                    <a href="${DISCORD}" target="_blank" rel="noopener" data-i18n="banner_btn">Discord</a>
                    <a href="${base}contribution.html" data-i18n="footer_donate">Faire un don</a>
                </div>
            </div>
        </div>
        <div class="container footer-bottom">
            <p data-i18n="footer_copyright">&copy; 2026 OpenPixel Lab. Wiki open-source.</p>
        </div>
    </footer>`;
}

// ---- Composants de fiche mod ---------------------------------------------

const DIFFICULTY_LABELS = {
  1: "Très facile",
  2: "Facile",
  3: "Intermédiaire",
  4: "Avancé",
  5: "Expert",
};

function difficultyDots(level = 0) {
  const dots = Array.from({ length: 5 }, (_, i) =>
    `<span class="diff-dot${i < level ? " filled" : ""}"></span>`
  ).join("");
  return `<span class="mod-diff" title="${DIFFICULTY_LABELS[level] || "—"}">${dots}<span class="mod-diff-label">${DIFFICULTY_LABELS[level] || "—"}</span></span>`;
}

function reviewFlag(mod) {
  if (!Array.isArray(mod.needsReview) || mod.needsReview.length === 0) return "";
  return `<span class="mod-review" title="À valider par un modérateur : ${mod.needsReview.map(escapeHtml).join(", ")}">⚑ à valider</span>`;
}

function modImage(mod) {
  const alt = escapeHtml(mod.image?.alt || mod.name);
  if (mod.image?.src) {
    const credit = mod.image.credit
      ? `<figcaption class="mod-img-credit">© ${escapeHtml(mod.image.credit)}</figcaption>`
      : "";
    return `<figure class="mod-img"><img src="${escapeHtml(mod.image.src)}" alt="${alt}" loading="lazy">${credit}</figure>`;
  }
  return `<div class="mod-img mod-img--placeholder" role="img" aria-label="${alt}"><span>📷</span></div>`;
}

function list(items, cls) {
  if (!Array.isArray(items) || items.length === 0) return "";
  return `<ul class="${cls}">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
}

function specsTable(specs) {
  const entries = Object.entries(specs || {});
  if (entries.length === 0) return "";
  return `<dl class="mod-specs">${entries
    .map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`)
    .join("")}</dl>`;
}

function buyLinks(links) {
  if (!Array.isArray(links) || links.length === 0) return "";
  return `<div class="mod-buy">${links
    .map((l) => `<a class="mod-buy-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener nofollow">${escapeHtml(l.label)} ↗</a>`)
    .join("")}</div>`;
}

function sources(srcs) {
  if (!Array.isArray(srcs) || srcs.length === 0) return "";
  return `<p class="mod-sources">Sources : ${srcs
    .map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`)
    .join(" · ")}</p>`;
}

export function modCard(mod) {
  const badge = mod.badge ? `<span class="mod-badge">${escapeHtml(mod.badge)}</span>` : "";
  const metaBits = [];
  if (mod.difficulty) metaBits.push(`<div class="mod-meta-item">${difficultyDots(mod.difficulty)}</div>`);
  if (mod.price) metaBits.push(`<div class="mod-meta-item mod-price">${escapeHtml(mod.price)}</div>`);
  if (mod.installTime) metaBits.push(`<div class="mod-meta-item">⏱ ${escapeHtml(mod.installTime)}</div>`);
  if (mod.soldering) metaBits.push(`<div class="mod-meta-item">🔧 ${escapeHtml(mod.soldering)}</div>`);

  const pros = mod.pros?.length ? `<div class="mod-pros"><span class="mod-pc-title">Points forts</span>${list(mod.pros, "mod-pc-list pros")}</div>` : "";
  const cons = mod.cons?.length ? `<div class="mod-cons"><span class="mod-pc-title">Compromis</span>${list(mod.cons, "mod-pc-list cons")}</div>` : "";
  const prereq = mod.prerequisites?.length
    ? `<p class="mod-prereq">⚠ Prérequis : ${mod.prerequisites.map(escapeHtml).join(", ")}</p>`
    : "";

  return `                    <article class="mod-card" id="${escapeHtml(mod.id)}">
                        <div class="mod-card-top">${badge}${reviewFlag(mod)}</div>
                        ${modImage(mod)}
                        <div class="mod-brand">${escapeHtml(mod.brand || "")}</div>
                        <h3 class="mod-name">${escapeHtml(mod.name)}</h3>
                        <p class="mod-desc">${escapeHtml(mod.summary || "")}</p>
                        <div class="mod-meta">${metaBits.join("")}</div>
                        ${list(mod.features, "mod-features")}
                        ${specsTable(mod.specs)}
                        ${prereq}
                        <div class="mod-proscons">${pros}${cons}</div>
                        ${buyLinks(mod.buyLinks)}
                        ${sources(mod.sources)}
                    </article>`;
}

function section(sec) {
  const intro = sec.intro ? `<p class="section-intro">${escapeHtml(sec.intro)}</p>` : "";
  return `            <section class="mod-section" id="section-${escapeHtml(sec.id)}">
                <div class="section-header">
                    <span class="section-icon">${sec.icon || ""}</span>
                    <h2 class="section-name">${escapeHtml(sec.name)}</h2>
                </div>
                ${intro}
                <div class="mods-grid">
${sec.mods.map(modCard).join("\n")}
                </div>
            </section>`;
}

/** Données structurées JSON-LD (BreadcrumbList + ItemList des mods). */
function jsonLd(c, base) {
  const allMods = c.sections.flatMap((s) => s.mods);
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${base}index.html` },
        { "@type": "ListItem", position: 2, name: "Wiki", item: `${base}wiki.html` },
        { "@type": "ListItem", position: 3, name: c.name },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Mods pour ${c.fullName || c.name}`,
      numberOfItems: allMods.length,
      itemListElement: allMods.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${m.brand ? m.brand + " " : ""}${m.name}`,
      })),
    },
  ];
  return `    <script type="application/ld+json">\n${JSON.stringify(data)}\n    </script>`;
}

/** Page console complète (data-driven). base fixé à '../' (sous-dossier wiki/). */
export function consolePage(c) {
  const base = "../";
  const totalMods = c.sections.reduce((n, s) => n + s.mods.length, 0);
  const toc = c.sections
    .map((s) => `<a href="#section-${escapeHtml(s.id)}" class="console-toc-link">${s.icon || ""} ${escapeHtml(s.name)}</a>`)
    .join("");
  const tools = `
            <div class="console-cross-links">
                <a class="cross-link" href="${base}configurator.html">🎨 Personnaliser en 3D</a>
                <a class="cross-link" href="${base}comparator.html">⚖️ Comparer des setups</a>
            </div>`;
  const intro = c.intro ? `<p class="console-intro">${escapeHtml(c.intro)}</p>` : "";
  const srcLine = c.sources?.length
    ? `<p class="console-sources">Sources générales : ${c.sources.map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`).join(" · ")}</p>`
    : "";

  return `${head({
    title: c.seo?.title || `${c.fullName} — Mods | OpenPixel Lab`,
    description: c.seo?.description || c.tagline,
    base,
    extraCss: ["css/console-page.css"],
  })}
<body>
    <div class="scanlines"></div>
${jsonLd(c, base)}

${header({ base, active: "wiki" })}

    <main class="console-page">
        <div class="container">
            <nav class="breadcrumb" aria-label="Fil d'Ariane">
                <a href="${base}index.html">Accueil</a> ›
                <a href="${base}wiki.html">Wiki</a> ›
                <span>${escapeHtml(c.name)}</span>
            </nav>

            <header class="console-hero">
                <div class="badge">${escapeHtml(c.heroBadge || "Console")}</div>
                <h1 class="console-title">${escapeHtml(c.title.replace(c.titleHighlight, "")).trim()} <span class="highlight">${escapeHtml(c.titleHighlight)}</span></h1>
                <p class="console-subtitle">${escapeHtml(c.tagline)}</p>
                <div class="console-stats">
                    <span>${c.year}</span> · <span>${totalMods} mods référencés</span>
                </div>
${tools}
            </header>

            ${intro}

            <nav class="console-toc" aria-label="Sommaire des sections">${toc}</nav>

${c.sections.map(section).join("\n\n")}

            ${srcLine}
        </div>
    </main>

${footer({ base })}

    <script src="${base}js/script.js"></script>
</body>
</html>
`;
}
