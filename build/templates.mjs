// build/templates.mjs — Partials de layout partagés + rendu des pages wiki.
// Source de vérité unique pour header/footer/head : éditer ICI, pas dans chaque HTML.
// Bilingue (FR/EN) : voir helper t() + dictionnaire UI ci-dessous.

const DISCORD = "https://discord.gg/jgE5CAmXw2";
const REPO = "https://github.com/DoctorL08/openpixellab";
const SITE = "https://openpixel-lab.com";

export function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Résout une valeur potentiellement traduite.
 * Un "wrapper de traduction" est un objet simple dont les clés sont uniquement
 * "fr" et/ou "en" (ex: { fr: "...", en: "..." } ou { fr: [...], en: [...] }).
 * Sinon la valeur est renvoyée telle quelle (string, array, objet specs…).
 */
export function t(value, lang = "fr") {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("fr" in value || "en" in value) &&
    Object.keys(value).every((k) => k === "fr" || k === "en")
  ) {
    return value[lang] ?? value.fr ?? value.en;
  }
  return value;
}

// Chaînes d'interface (hors contenu data) par langue.
const UI = {
  fr: {
    pointsForts: "Points forts",
    compromis: "Compromis",
    prereq: "Prérequis",
    sources: "Sources",
    sourcesGen: "Sources générales",
    aValider: "à valider",
    reviewTitle: "À valider par un modérateur",
    proposer: "Proposer une correction",
    signaler: "Signaler une erreur ou proposer une amélioration",
    correction: "Correction",
    accueil: "Accueil",
    wiki: "Wiki",
    modsRef: "mods référencés",
    customize3d: "🎨 Personnaliser en 3D",
    compare: "⚖️ Comparer des setups",
    filAriane: "Fil d'Ariane",
    sommaire: "Sommaire des sections",
    console: "Console",
    langLabel: "FR",
  },
  en: {
    pointsForts: "Strengths",
    compromis: "Trade-offs",
    prereq: "Prerequisites",
    sources: "Sources",
    sourcesGen: "General sources",
    aValider: "under review",
    reviewTitle: "Pending moderator review",
    proposer: "Suggest a correction",
    signaler: "Report an error or suggest an improvement",
    correction: "Correction",
    accueil: "Home",
    wiki: "Wiki",
    modsRef: "mods listed",
    customize3d: "🎨 Customize in 3D",
    compare: "⚖️ Compare setups",
    filAriane: "Breadcrumb",
    sommaire: "Sections overview",
    console: "Console",
    langLabel: "EN",
  },
};

const DIFFICULTY_LABELS = {
  fr: { 1: "Très facile", 2: "Facile", 3: "Intermédiaire", 4: "Avancé", 5: "Expert" },
  en: { 1: "Very easy", 2: "Easy", 3: "Intermediate", 4: "Advanced", 5: "Expert" },
};

/** <head> commun. `base` = '' à la racine, '../' (wiki/) ou '../../' (wiki/en/). */
export function head({
  title,
  description,
  base = "",
  extraCss = [],
  canonical = "",
  ogImage = "",
  lang = "fr",
  alternates = [],
}) {
  const cssLinks = ["css/style.css", ...extraCss]
    .map((href) => `    <link rel="stylesheet" href="${base}${href}">`)
    .join("\n");
  const og = ogImage || `${base}Images/Logo OpenPixel Lab.png`;
  const alt = alternates
    .map((a) => `    <link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="${lang}" data-theme="light">
<head>
    <meta charset="UTF-8">
    <script>(function(){var t=localStorage.getItem('opl-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();</script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(description)}">
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
${alt ? alt + "\n" : ""}    <title>${escapeHtml(title)}</title>

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

function difficultyDots(level = 0, lang = "fr") {
  const labels = DIFFICULTY_LABELS[lang] || DIFFICULTY_LABELS.fr;
  const dots = Array.from({ length: 5 }, (_, i) =>
    `<span class="diff-dot${i < level ? " filled" : ""}"></span>`
  ).join("");
  return `<span class="mod-diff" title="${labels[level] || "—"}">${dots}<span class="mod-diff-label">${labels[level] || "—"}</span></span>`;
}

function reviewFlag(mod, lang = "fr") {
  if (!Array.isArray(mod.needsReview) || mod.needsReview.length === 0) return "";
  const ui = UI[lang];
  return `<span class="mod-review" title="${ui.reviewTitle} : ${mod.needsReview.map(escapeHtml).join(", ")}">⚑ ${ui.aValider}</span>`;
}

function modImage(mod, lang = "fr", base = "") {
  const alt = escapeHtml(t(mod.image?.alt, lang) || t(mod.name, lang));
  if (mod.image?.src) {
    // chemins locaux → relatifs au dossier de la page (base) ; URLs externes inchangées
    const src = /^https?:\/\//.test(mod.image.src) ? mod.image.src : `${base}${mod.image.src}`;
    const credit = mod.image.credit
      ? `<figcaption class="mod-img-credit">© ${escapeHtml(mod.image.credit)}</figcaption>`
      : "";
    return `<figure class="mod-img"><img src="${escapeHtml(src)}" alt="${alt}" loading="lazy">${credit}</figure>`;
  }
  return `<div class="mod-img mod-img--placeholder" role="img" aria-label="${alt}"><span>📷</span></div>`;
}

function list(items, cls, lang = "fr") {
  const arr = t(items, lang);
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return `<ul class="${cls}">${arr.map((i) => `<li>${escapeHtml(t(i, lang))}</li>`).join("")}</ul>`;
}

function specsTable(specs, lang = "fr") {
  const resolved = t(specs, lang);
  const entries = Object.entries(resolved || {});
  if (entries.length === 0) return "";
  return `<dl class="mod-specs">${entries
    .map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(t(v, lang))}</dd></div>`)
    .join("")}</dl>`;
}

function buyLinks(links) {
  if (!Array.isArray(links) || links.length === 0) return "";
  return `<div class="mod-buy">${links
    .map((l) => `<a class="mod-buy-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener nofollow">${escapeHtml(l.label)} ↗</a>`)
    .join("")}</div>`;
}

function sources(srcs, lang = "fr") {
  if (!Array.isArray(srcs) || srcs.length === 0) return "";
  return `<p class="mod-sources">${UI[lang].sources} : ${srcs
    .map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`)
    .join(" · ")}</p>`;
}

export function modCard(mod, ctx = {}) {
  const lang = ctx.lang || "fr";
  const ui = UI[lang];
  const name = t(mod.name, lang);
  const badge = mod.badge ? `<span class="mod-badge">${escapeHtml(t(mod.badge, lang))}</span>` : "";

  // Lien "Proposer une correction" → issue GitHub pré-remplie (contribution communautaire)
  const issueTitle = `[${ui.correction}] ${ctx.consoleName || ""} — ${name}`;
  const issueUrl =
    `${REPO}/issues/new?template=mod-correction.yml` +
    `&title=${encodeURIComponent(issueTitle)}` +
    `&console=${encodeURIComponent(ctx.consoleName || "")}` +
    `&mod=${encodeURIComponent(`${name} (id: ${mod.id})`)}`;
  const suggest = `<a class="mod-suggest" href="${issueUrl}" target="_blank" rel="noopener nofollow" title="${ui.signaler}">✏️ ${ui.proposer}</a>`;
  const metaBits = [];
  if (mod.difficulty) metaBits.push(`<div class="mod-meta-item">${difficultyDots(mod.difficulty, lang)}</div>`);
  if (mod.price) metaBits.push(`<div class="mod-meta-item mod-price">${escapeHtml(mod.price)}</div>`);
  if (mod.installTime) metaBits.push(`<div class="mod-meta-item">⏱ ${escapeHtml(t(mod.installTime, lang))}</div>`);
  if (mod.soldering) metaBits.push(`<div class="mod-meta-item">🔧 ${escapeHtml(t(mod.soldering, lang))}</div>`);

  const prosArr = t(mod.pros, lang);
  const consArr = t(mod.cons, lang);
  const pros = prosArr?.length ? `<div class="mod-pros"><span class="mod-pc-title">${ui.pointsForts}</span>${list(mod.pros, "mod-pc-list pros", lang)}</div>` : "";
  const cons = consArr?.length ? `<div class="mod-cons"><span class="mod-pc-title">${ui.compromis}</span>${list(mod.cons, "mod-pc-list cons", lang)}</div>` : "";
  const prereqArr = t(mod.prerequisites, lang);
  const prereq = prereqArr?.length
    ? `<p class="mod-prereq">⚠ ${ui.prereq} : ${prereqArr.map((p) => escapeHtml(t(p, lang))).join(", ")}</p>`
    : "";

  return `                    <article class="mod-card" id="${escapeHtml(mod.id)}">
                        <div class="mod-card-top">${badge}${reviewFlag(mod, lang)}</div>
                        ${modImage(mod, lang, ctx.base)}
                        <div class="mod-brand">${escapeHtml(mod.brand || "")}</div>
                        <h3 class="mod-name">${escapeHtml(name)}</h3>
                        <p class="mod-desc">${escapeHtml(t(mod.summary, lang) || "")}</p>
                        <div class="mod-meta">${metaBits.join("")}</div>
                        ${list(mod.features, "mod-features", lang)}
                        ${specsTable(mod.specs, lang)}
                        ${prereq}
                        <div class="mod-proscons">${pros}${cons}</div>
                        ${buyLinks(mod.buyLinks)}
                        ${sources(mod.sources, lang)}
                        <div class="mod-footer-actions">${suggest}</div>
                    </article>`;
}

function section(sec, ctx) {
  const lang = ctx.lang || "fr";
  const introTxt = t(sec.intro, lang);
  const intro = introTxt ? `<p class="section-intro">${escapeHtml(introTxt)}</p>` : "";
  return `            <section class="mod-section" id="section-${escapeHtml(sec.id)}">
                <div class="section-header">
                    <span class="section-icon">${sec.icon || ""}</span>
                    <h2 class="section-name">${escapeHtml(t(sec.name, lang))}</h2>
                </div>
                ${intro}
                <div class="mods-grid">
${sec.mods.map((m) => modCard(m, ctx)).join("\n")}
                </div>
            </section>`;
}

/** Données structurées JSON-LD (BreadcrumbList + ItemList des mods). */
function jsonLd(c, base, lang) {
  const ui = UI[lang];
  const allMods = c.sections.flatMap((s) => s.mods);
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.accueil, item: `${base}index.html` },
        { "@type": "ListItem", position: 2, name: ui.wiki, item: `${base}wiki.html` },
        { "@type": "ListItem", position: 3, name: t(c.name, lang) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Mods — ${t(c.fullName, lang) || t(c.name, lang)}`,
      numberOfItems: allMods.length,
      itemListElement: allMods.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${m.brand ? m.brand + " " : ""}${t(m.name, lang)}`,
      })),
    },
  ];
  return `    <script type="application/ld+json">\n${JSON.stringify(data)}\n    </script>`;
}

/**
 * Page console complète (data-driven), bilingue.
 * lang = 'fr' → wiki/<slug>.html (base '../')
 * lang = 'en' → wiki/en/<slug>.html (base '../../')
 */
export function consolePage(c, lang = "fr") {
  const base = lang === "en" ? "../../" : "../";
  const ui = UI[lang];
  const frUrl = `${SITE}/wiki/${c.slug}.html`;
  const enUrl = `${SITE}/wiki/en/${c.slug}.html`;
  const canonical = lang === "en" ? enUrl : frUrl;
  const alternates = [
    { hreflang: "fr", href: frUrl },
    { hreflang: "en", href: enUrl },
    { hreflang: "x-default", href: frUrl },
  ];

  const name = t(c.name, lang);
  const fullName = t(c.fullName, lang);
  const tagline = t(c.tagline, lang);
  const totalMods = c.sections.reduce((n, s) => n + s.mods.length, 0);
  const toc = c.sections
    .map((s) => `<a href="#section-${escapeHtml(s.id)}" class="console-toc-link">${s.icon || ""} ${escapeHtml(t(s.name, lang))}</a>`)
    .join("");
  const tools = `
            <div class="console-cross-links">
                <a class="cross-link" href="${base}configurator.html">${ui.customize3d}</a>
                <a class="cross-link" href="${base}comparator.html">${ui.compare}</a>
            </div>`;
  const introTxt = t(c.intro, lang);
  const intro = introTxt ? `<p class="console-intro">${escapeHtml(introTxt)}</p>` : "";
  const srcLine = c.sources?.length
    ? `<p class="console-sources">${ui.sourcesGen} : ${c.sources.map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`).join(" · ")}</p>`
    : "";

  const seoTitle = t(c.seo?.title, lang) || `${fullName} — Mods | OpenPixel Lab`;
  const seoDesc = t(c.seo?.description, lang) || tagline;
  const title = t(c.title, lang);
  const titleHighlight = t(c.titleHighlight, lang);

  return `${head({
    title: seoTitle,
    description: seoDesc,
    base,
    extraCss: ["css/console-page.css"],
    canonical,
    lang,
    alternates,
  })}
<body>
    <script>window.OPL_PAGE_LANG = ${JSON.stringify(lang)};</script>
    <div class="scanlines"></div>
${jsonLd(c, base, lang)}

${header({ base, active: "wiki" })}

    <main class="console-page">
        <div class="container">
            <nav class="breadcrumb" aria-label="${ui.filAriane}">
                <a href="${base}index.html">${ui.accueil}</a> ›
                <a href="${base}wiki.html">${ui.wiki}</a> ›
                <span>${escapeHtml(name)}</span>
            </nav>

            <header class="console-hero">
                <div class="badge">${escapeHtml(t(c.heroBadge, lang) || ui.console)}</div>
                <h1 class="console-title">${escapeHtml(title.replace(titleHighlight, "")).trim()} <span class="highlight">${escapeHtml(titleHighlight)}</span></h1>
                <p class="console-subtitle">${escapeHtml(tagline)}</p>
                <div class="console-stats">
                    <span>${c.year}</span> · <span>${totalMods} ${ui.modsRef}</span>
                </div>
${tools}
            </header>

            ${intro}

            <nav class="console-toc" aria-label="${ui.sommaire}">${toc}</nav>

${c.sections.map((s) => section(s, { consoleName: name, slug: c.slug, lang, base })).join("\n\n")}

            ${srcLine}
        </div>
    </main>

${footer({ base })}

    <script src="${base}js/script.js"></script>
</body>
</html>
`;
}
