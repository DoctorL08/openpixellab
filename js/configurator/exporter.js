// js/configurator/exporter.js — Export d'image de configuration

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload  = () => resolve(img);
        img.onerror = () => reject(new Error('Erreur chargement image'));
        img.src = src;
    });
}

function loadImageSafe(src) {
    return loadImage(src).catch(() => null);
}

function getConfigSummary() {
    const items = [];
    document.querySelectorAll('.customization-slide').forEach(slide => {
        // Ignorer la slide Exporter (pas de swatches coloris)
        if (slide.querySelector('.export-slide-content')) return;
        const title = slide.querySelector('h2')?.textContent?.trim();
        if (!title) return;
        const selected = slide.querySelector('.color-option.is-selected:not(.reset-swatch)');
        let colorName, colorStyle;
        if (selected) {
            colorName  = selected.title;
            colorStyle = selected.style.backgroundColor;
        } else {
            const firstSwatch = slide.querySelector('.color-option:not(.reset-swatch)');
            colorName  = firstSwatch?.title || 'Blanc';
            colorStyle = firstSwatch?.style.backgroundColor || null;
        }
        items.push({ title, colorName, colorStyle });
    });
    return items;
}

function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function drawDiagonalStripes(ctx, totalW, totalH, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 110;
    for (let offset = -totalH; offset < totalW + totalH; offset += 300) {
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset + totalH, totalH);
        ctx.stroke();
    }
    ctx.restore();
}

function drawScanlines(ctx, w, h, alpha) {
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1.5);
    }
    ctx.restore();
}

function drawCornerBrackets(ctx, x, y, w, h, size, color, lw) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'square';
    // Top-left
    ctx.beginPath(); ctx.moveTo(x, y + size); ctx.lineTo(x, y); ctx.lineTo(x + size, y); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(x + w - size, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + size); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(x, y + h - size); ctx.lineTo(x, y + h); ctx.lineTo(x + size, y + h); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(x + w - size, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - size); ctx.stroke();
    ctx.restore();
}

function hGradLine(ctx, x0, x1, y, colorEdge, colorMid) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0,    colorEdge);
    g.addColorStop(0.45, colorMid);
    g.addColorStop(0.55, colorMid);
    g.addColorStop(1,    colorEdge);
    ctx.fillStyle = g;
    ctx.fillRect(x0, y, x1 - x0, 1);
}

export async function exportConfigImage(scene, camera, renderer, currentConsole, consoleName) {
    if (!currentConsole) return;

    // ── 1. Capturer les 2 vues 3D ──────────────────────────────────────
    const SHOT_W = 560;
    const SHOT_H = 520;

    const savedRot    = { x: currentConsole.rotation.x, y: currentConsole.rotation.y, z: currentConsole.rotation.z };
    const savedSize   = new THREE.Vector2();
    renderer.getSize(savedSize);
    const savedAspect = camera.aspect;
    const savedDPR    = renderer.getPixelRatio();

    renderer.setPixelRatio(1);
    renderer.setSize(SHOT_W, SHOT_H, false);
    camera.aspect = SHOT_W / SHOT_H;
    camera.updateProjectionMatrix();

    // Face avant : droite en profondeur, gauche au premier plan
    currentConsole.rotation.set(0.08, +0.52, 0);
    renderer.render(scene, camera);
    const frontURL = renderer.domElement.toDataURL('image/png');

    // Face arrière : même traitement vue spectateur (gauche recul, droite avant)
    currentConsole.rotation.set(0.08, Math.PI + 0.52, 0);
    renderer.render(scene, camera);
    const backURL = renderer.domElement.toDataURL('image/png');

    currentConsole.rotation.set(savedRot.x, savedRot.y, savedRot.z);
    camera.aspect = savedAspect;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(savedDPR);
    renderer.setSize(savedSize.x, savedSize.y, true);
    renderer.render(scene, camera);

    // ── 2. Préparer la composition ──────────────────────────────────────
    await document.fonts.ready;
    const logo = await loadImageSafe('Images/Logo OpenPixel Lab.png');

    const configItems = getConfigSummary();

    const PAD           = 40;
    const GAP           = 20;
    const COLS          = 3;
    const ITEM_H        = 64;
    const SWATCH        = 32;
    const configRows    = Math.max(1, Math.ceil(configItems.length / COLS));

    const TOP_BAR_H     = 100;
    const BRAND_H       = 96;
    const SHOT_LABEL_H  = 38;
    const SEP_H         = 56;
    const CFG_HEAD_H    = 48;
    const CFG_BODY_H    = configRows * ITEM_H;
    const CFG_BOT_PAD   = 32;
    const FOOTER_H      = 64;

    const totalW = PAD + SHOT_W + GAP + SHOT_W + PAD;
    const totalH = TOP_BAR_H + BRAND_H + SHOT_H + SHOT_LABEL_H + SEP_H + CFG_HEAD_H + CFG_BODY_H + CFG_BOT_PAD + FOOTER_H;

    const canvas = document.createElement('canvas');
    canvas.width  = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    // Palette — toujours dark pour un rendu premium cohérent
    const C = {
        bg          : '#0d0d12',
        bgBar       : '#12121a',
        bgShot      : 'rgba(240,236,225,0.032)',
        text        : '#f0ece1',
        textDim     : 'rgba(240,236,225,0.70)',
        muted       : 'rgba(240,236,225,0.38)',
        faint       : 'rgba(240,236,225,0.16)',
        div         : 'rgba(240,236,225,0.09)',
        divBold     : 'rgba(240,236,225,0.22)',
        stripe      : 'rgba(240,236,225,0.016)',
        dot         : 'rgba(240,236,225,0.015)',
        bracket     : 'rgba(240,236,225,0.45)',
        bracketFaint: 'rgba(240,236,225,0.18)',
        swatchBdr   : 'rgba(240,236,225,0.22)',
        swatchEmpty : '#24242e',
    };

    // ── 3. Background ──────────────────────────────────────────────────
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, totalW, totalH);

    // Bandes diagonales (effet carte rétro / game manual)
    drawDiagonalStripes(ctx, totalW, totalH, C.stripe);

    // Dot matrix
    ctx.fillStyle = C.dot;
    for (let gx = 14; gx < totalW; gx += 26) {
        for (let gy = 14; gy < totalH; gy += 26) {
            ctx.beginPath();
            ctx.arc(gx, gy, 1.0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Scanlines CRT (très subtil)
    drawScanlines(ctx, totalW, totalH, 0.032);

    // ── 4. Top bar ─────────────────────────────────────────────────────
    ctx.fillStyle = C.bgBar;
    ctx.fillRect(0, 0, totalW, TOP_BAR_H);

    // Scanlines CRT plus denses dans la barre titre
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.09)';
    for (let y = 0; y < TOP_BAR_H; y += 3) {
        ctx.fillRect(0, y, totalW, 1);
    }
    ctx.restore();

    // Ligne accent dégradée en bas du top bar
    const accentGrad = ctx.createLinearGradient(0, 0, totalW, 0);
    accentGrad.addColorStop(0,    'rgba(240,236,225,0)');
    accentGrad.addColorStop(0.12, 'rgba(240,236,225,0.58)');
    accentGrad.addColorStop(0.88, 'rgba(240,236,225,0.58)');
    accentGrad.addColorStop(1,    'rgba(240,236,225,0)');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, TOP_BAR_H - 2, totalW, 2);

    const barMid = TOP_BAR_H / 2 + 4;
    let textStartX = PAD;

    // Logo en haut à gauche
    if (logo) {
        const lh = 36;
        const lw = (logo.width / logo.height) * lh;
        ctx.globalAlpha = 0.92;
        ctx.drawImage(logo, PAD, barMid - lh / 2, lw, lh);
        ctx.globalAlpha = 1;
        textStartX = PAD + lw + 14;
    }

    // "OpenPixel Lab" en Outfit Bold
    ctx.font         = `bold 36px "Outfit", "Helvetica Neue", sans-serif`;
    ctx.fillStyle    = C.text;
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('OpenPixel Lab', textStartX, barMid);

    // Tag "[ CONFIG ]" à droite en VT323
    ctx.font         = `24px "VT323", "Courier New", monospace`;
    ctx.fillStyle    = C.muted;
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '3px';
    ctx.fillText('[ CONFIG ]', totalW - PAD, barMid);
    ctx.letterSpacing = '0px';

    // Brackets sur le top bar
    drawCornerBrackets(ctx, 10, 8, totalW - 20, TOP_BAR_H - 16, 20, C.bracket, 1.5);

    // ── 5. Brand / Nom de la console ───────────────────────────────────
    const brandY   = TOP_BAR_H;
    const brandMid = brandY + BRAND_H / 2;

    // Nom de la console (Outfit Bold, grand)
    ctx.font         = `bold 42px "Outfit", "Helvetica Neue", sans-serif`;
    ctx.fillStyle    = C.text;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(consoleName.toUpperCase(), totalW / 2, brandMid - 14);

    // Sous-titre "— OpenPixel Lab — Config —"
    ctx.font         = `22px "VT323", "Courier New", monospace`;
    ctx.fillStyle    = C.muted;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '4px';
    ctx.fillText('— OpenPixel Lab — Config —', totalW / 2, brandMid + 20);
    ctx.letterSpacing = '0px';

    // Ligne séparatrice déco
    hGradLine(ctx, 0, totalW, brandY + BRAND_H - 1, 'rgba(240,236,225,0)', C.divBold);

    // ── 6. Shots 3D ────────────────────────────────────────────────────
    const [frontImg, backImg] = await Promise.all([loadImage(frontURL), loadImage(backURL)]);

    const shotY  = brandY + BRAND_H;
    const shot1X = PAD;
    const shot2X = PAD + SHOT_W + GAP;

    // Fonds avec dégradé radial (lumière centrale douce)
    [shot1X, shot2X].forEach(sx => {
        const rg = ctx.createRadialGradient(
            sx + SHOT_W / 2, shotY + SHOT_H * 0.42, 0,
            sx + SHOT_W / 2, shotY + SHOT_H * 0.42, SHOT_W * 0.62
        );
        rg.addColorStop(0, 'rgba(255,255,255,0.06)');
        rg.addColorStop(1, 'rgba(255,255,255,0.01)');
        ctx.fillStyle = rg;
        drawRoundRect(ctx, sx, shotY, SHOT_W, SHOT_H, 14);
        ctx.fill();
    });

    // Images clippées dans les cartes arrondies
    [[shot1X, frontImg], [shot2X, backImg]].forEach(([sx, img]) => {
        ctx.save();
        drawRoundRect(ctx, sx, shotY, SHOT_W, SHOT_H, 14);
        ctx.clip();
        ctx.drawImage(img, sx, shotY, SHOT_W, SHOT_H);
        ctx.restore();
    });

    // Bordure fine autour de chaque shot
    ctx.strokeStyle = C.div;
    ctx.lineWidth   = 1;
    [shot1X, shot2X].forEach(sx => {
        drawRoundRect(ctx, sx, shotY, SHOT_W, SHOT_H, 14);
        ctx.stroke();
    });

    // Brackets angle sur chaque shot
    [shot1X, shot2X].forEach(sx => {
        drawCornerBrackets(ctx, sx + 3, shotY + 3, SHOT_W - 6, SHOT_H - 6, 22, 'rgba(240,236,225,0.52)', 1.5);
    });

    // Labels sous les shots (VT323, retro)
    const labelY = shotY + SHOT_H + 10;
    ctx.font         = `26px "VT323", "Courier New", monospace`;
    ctx.fillStyle    = C.textDim;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = '2px';
    ctx.fillText('▶ FACE AVANT', shot1X + SHOT_W / 2, labelY);
    ctx.fillText('◀ FACE ARRIÈRE', shot2X + SHOT_W / 2, labelY);
    ctx.letterSpacing = '0px';

    // ── 7. Séparateur losange ──────────────────────────────────────────
    const sepY   = shotY + SHOT_H + SHOT_LABEL_H;
    const sepMid = sepY + SEP_H / 2;
    const midX   = totalW / 2;

    // Ligne gauche (fond → losange)
    const lgLeft = ctx.createLinearGradient(PAD, 0, midX - 26, 0);
    lgLeft.addColorStop(0, 'rgba(240,236,225,0)');
    lgLeft.addColorStop(1, C.divBold);
    ctx.fillStyle = lgLeft;
    ctx.fillRect(PAD + 12, sepMid, midX - 26 - PAD - 12, 1);

    // Ligne droite (losange → fond)
    const lgRight = ctx.createLinearGradient(midX + 26, 0, totalW - PAD, 0);
    lgRight.addColorStop(0, C.divBold);
    lgRight.addColorStop(1, 'rgba(240,236,225,0)');
    ctx.fillStyle = lgRight;
    ctx.fillRect(midX + 26, sepMid, totalW - PAD - 12 - midX - 26, 1);

    // Losange central
    ctx.save();
    ctx.translate(midX, sepMid);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle   = C.bg;
    ctx.fillRect(-11, -11, 22, 22);
    ctx.strokeStyle = C.divBold;
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(-10, -10, 20, 20);
    ctx.fillStyle   = C.divBold;
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();

    // ── 8. Section configuration ───────────────────────────────────────
    const cfgHeadY = sepY + SEP_H;
    const cfgBodyY = cfgHeadY + CFG_HEAD_H;
    const itemW    = (totalW - PAD * 2) / COLS;

    // Titre section
    ctx.font         = `20px "VT323", "Courier New", monospace`;
    ctx.fillStyle    = C.muted;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = '6px';
    ctx.fillText('CONFIGURATION', totalW / 2, cfgHeadY + 12);
    ctx.letterSpacing = '0px';

    configItems.forEach((item, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const ix  = PAD + col * itemW;
        const iy  = cfgBodyY + row * ITEM_H;

        // Swatch carré arrondi
        const swX = ix + 10;
        const swY = iy + (ITEM_H - SWATCH) / 2;
        drawRoundRect(ctx, swX, swY, SWATCH, SWATCH, 8);
        ctx.fillStyle = item.colorStyle || C.swatchEmpty;
        ctx.fill();
        ctx.strokeStyle = C.swatchBdr;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        const txtX = ix + SWATCH + 20;
        const itemCenterY = iy + ITEM_H / 2;

        // Nom de la partie (VT323, petit, muted)
        ctx.font         = `17px "VT323", "Courier New", monospace`;
        ctx.fillStyle    = C.muted;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'bottom';
        ctx.letterSpacing = '1px';
        ctx.fillText(item.title.toUpperCase(), txtX, itemCenterY - 1);
        ctx.letterSpacing = '0px';

        // Nom de la couleur (Outfit Bold, bien lisible)
        ctx.font         = `bold 16px "Outfit", "Helvetica Neue", sans-serif`;
        ctx.fillStyle    = C.text;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(item.colorName, txtX, itemCenterY + 3);

        // Séparateur de ligne de grille (léger)
        if (col === COLS - 1 || i === configItems.length - 1) {
            const lineY = iy + ITEM_H - 1;
            const lgGrid = ctx.createLinearGradient(PAD, 0, totalW - PAD, 0);
            lgGrid.addColorStop(0,   'rgba(240,236,225,0)');
            lgGrid.addColorStop(0.1, C.div);
            lgGrid.addColorStop(0.9, C.div);
            lgGrid.addColorStop(1,   'rgba(240,236,225,0)');
            ctx.fillStyle = lgGrid;
            ctx.fillRect(PAD, lineY, totalW - PAD * 2, 1);
        }
    });

    // ── 9. Footer ──────────────────────────────────────────────────────
    const footerY = cfgBodyY + CFG_BODY_H + CFG_BOT_PAD;
    hGradLine(ctx, 0, totalW, footerY, 'rgba(240,236,225,0)', C.divBold);

    const footMid = footerY + FOOTER_H / 2;

    // Logo + URL centrés ensemble
    ctx.font = `16px "Outfit", "Helvetica Neue", sans-serif`;
    const urlText  = 'OpenPixel-Lab.com';
    const urlW     = ctx.measureText(urlText).width;
    const footGap  = 10;
    let comboW     = urlW;
    let logoFootH  = 0, logoFootW = 0;
    if (logo) {
        logoFootH = 24;
        logoFootW = (logo.width / logo.height) * logoFootH;
        comboW    = logoFootW + footGap + urlW;
    }
    const comboX = (totalW - comboW) / 2;

    if (logo) {
        ctx.globalAlpha = 0.68;
        ctx.drawImage(logo, comboX, footMid - logoFootH / 2, logoFootW, logoFootH);
        ctx.globalAlpha = 1;
    }

    ctx.font         = `16px "Outfit", "Helvetica Neue", sans-serif`;
    ctx.fillStyle    = C.muted;
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(urlText, comboX + (logo ? logoFootW + footGap : 0), footMid + 1);

    // Ligne accent finale en bas
    const botGrad = ctx.createLinearGradient(0, 0, totalW, 0);
    botGrad.addColorStop(0,    'rgba(240,236,225,0)');
    botGrad.addColorStop(0.2,  'rgba(240,236,225,0.42)');
    botGrad.addColorStop(0.8,  'rgba(240,236,225,0.42)');
    botGrad.addColorStop(1,    'rgba(240,236,225,0)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, totalH - 2, totalW, 2);

    // Brackets globaux discrets sur toute la carte
    drawCornerBrackets(ctx, 8, 8, totalW - 16, totalH - 16, 30, C.bracketFaint, 1);

    // ── 10. Téléchargement ────────────────────────────────────────────
    const filename = consoleName.replace(/[^a-zA-Z0-9]/g, '_') + '_config.png';
    const link = document.createElement('a');
    link.download = filename;
    link.href     = canvas.toDataURL('image/png');
    link.click();
}
