const state = {
  slots: [],
  nextId: 1,
  maxSlots: 4
};

document.addEventListener('DOMContentLoaded', () => {
  addSlot();
  document.getElementById('add-slot-btn').addEventListener('click', addSlot);
  document.getElementById('compare-btn').addEventListener('click', compare);
});

function addSlot() {
  if (state.slots.length >= state.maxSlots) return;
  const slot = { id: state.nextId++, consoleId: null, selectedMods: {} };
  state.slots.push(slot);
  renderSlots();
  updateUI();
}

function removeSlot(id) {
  state.slots = state.slots.filter(s => s.id !== id);
  renderSlots();
  updateUI();
  hideResults();
}

function selectConsole(slotId, consoleId) {
  const slot = state.slots.find(s => s.id === slotId);
  if (!slot) return;
  slot.consoleId = consoleId || null;
  slot.selectedMods = {};
  renderSlots();
  updateUI();
  hideResults();
  if (consoleId) {
    const slotEl = document.querySelector(`[data-slot-id="${slotId}"]`);
    if (slotEl) {
      const firstCat = slotEl.querySelector('.mod-category');
      if (firstCat) firstCat.classList.add('open');
    }
  }
}

function toggleMod(slotId, categoryId, modId, exclusive) {
  const slot = state.slots.find(s => s.id === slotId);
  if (!slot) return;
  if (!slot.selectedMods[categoryId]) slot.selectedMods[categoryId] = new Set();
  const cat = slot.selectedMods[categoryId];
  if (exclusive) {
    cat.has(modId) ? cat.clear() : (cat.clear(), cat.add(modId));
  } else {
    cat.has(modId) ? cat.delete(modId) : cat.add(modId);
  }
  const slotEl = document.querySelector(`[data-slot-id="${slotId}"]`);
  if (slotEl) {
    const preview = slotEl.querySelector('.score-preview');
    if (preview) preview.innerHTML = buildScorePreview(computeScores(slot));
    refreshModItems(slotEl, slot);
  }
  hideResults();
}

function refreshModItems(slotEl, slot) {
  const consoleData = getConsoleData(slot.consoleId);
  if (!consoleData) return;
  consoleData.modCategories.forEach(cat => {
    cat.mods.forEach(mod => {
      const el = slotEl.querySelector(`[data-mod-id="${mod.id}"]`);
      if (!el) return;
      const selected = slot.selectedMods[cat.id] && slot.selectedMods[cat.id].has(mod.id);
      el.classList.toggle('selected', selected);
      const dot = el.querySelector('.mod-check-dot');
      if (dot) dot.textContent = selected ? '●' : '○';
    });
  });
}

function computeScores(slot) {
  const consoleData = getConsoleData(slot.consoleId);
  if (!consoleData) return null;
  const scores = { ...consoleData.baseScores };
  for (const [catId, modIds] of Object.entries(slot.selectedMods)) {
    const cat = consoleData.modCategories.find(c => c.id === catId);
    if (!cat) continue;
    for (const modId of modIds) {
      const mod = cat.mods.find(m => m.id === modId);
      if (!mod) continue;
      for (const [key, val] of Object.entries(mod.scoreImpact)) {
        scores[key] = clamp((scores[key] || 0) + val, 0, 10);
      }
    }
  }
  return scores;
}

function getConsoleData(id) {
  return COMPARATOR_DATA.consoles.find(c => c.id === id) || null;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function totalScore(scores) {
  return Object.values(scores).reduce((a, b) => a + b, 0);
}

function getSelectedMods(slot) {
  const consoleData = getConsoleData(slot.consoleId);
  if (!consoleData) return [];
  const mods = [];
  for (const [catId, modIds] of Object.entries(slot.selectedMods)) {
    const cat = consoleData.modCategories.find(c => c.id === catId);
    if (!cat) continue;
    for (const modId of modIds) {
      const mod = cat.mods.find(m => m.id === modId);
      if (mod) mods.push({ ...mod, categoryLabel: cat.label });
    }
  }
  return mods;
}

function renderSlots() {
  const container = document.getElementById('slots-container');
  container.innerHTML = state.slots.map(slot => buildSlotHTML(slot)).join('');
  container.querySelectorAll('.console-selector').forEach(sel => {
    sel.addEventListener('change', e => {
      const slotId = parseInt(e.target.closest('[data-slot-id]').dataset.slotId);
      selectConsole(slotId, e.target.value || null);
    });
  });
  container.querySelectorAll('.slot-remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const slotId = parseInt(e.target.closest('[data-slot-id]').dataset.slotId);
      removeSlot(slotId);
    });
  });
  container.querySelectorAll('.mod-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('.mod-item-detail-btn')) return;
      const slotId = parseInt(item.closest('[data-slot-id]').dataset.slotId);
      const catId = item.dataset.catId;
      const modId = item.dataset.modId;
      const exclusive = item.dataset.exclusive === 'true';
      toggleMod(slotId, catId, modId, exclusive);
    });
  });
  container.querySelectorAll('.mod-category-header').forEach(header => {
    header.addEventListener('click', () => {
      const cat = header.closest('.mod-category');
      cat.classList.toggle('open');
    });
  });
  container.querySelectorAll('.slot-name-input').forEach(input => {
    input.addEventListener('input', e => {
      const slotId = parseInt(e.target.closest('[data-slot-id]').dataset.slotId);
      const slot = state.slots.find(s => s.id === slotId);
      if (slot) slot.customName = e.target.value;
    });
  });
}

function buildSlotHTML(slot) {
  const num = state.slots.indexOf(slot) + 1;
  const consoleData = getConsoleData(slot.consoleId);
  const scores = computeScores(slot);
  const canRemove = state.slots.length > 1;

  return `
<div class="slot-card" data-slot-id="${slot.id}">
  <div class="slot-header">
    <span class="slot-number">Setup ${num}</span>
    <input class="slot-name-input" type="text" placeholder="Nom du custom..." value="${slot.customName || ''}" maxlength="30">
    ${canRemove ? `<button class="slot-remove-btn" title="Supprimer">✕</button>` : ''}
  </div>

  <div class="console-selector-wrap">
    <select class="console-selector">
      <option value="">— Choisir une console —</option>
      ${COMPARATOR_DATA.consoles.map(c =>
        `<option value="${c.id}" ${slot.consoleId === c.id ? 'selected' : ''}>${c.icon} ${c.name} (${c.year})</option>`
      ).join('')}
    </select>
  </div>

  ${consoleData ? `
  <div class="console-info">
    <span class="console-info-type">${consoleData.type === 'portable' ? '📦 Portable' : '🏠 Console de salon'}</span>
    <span class="console-info-desc">${consoleData.description}</span>
  </div>

  <div class="mod-categories">
    ${consoleData.modCategories.map(cat => buildCategoryHTML(cat, slot)).join('')}
  </div>

  <div class="score-preview">
    ${buildScorePreview(scores)}
  </div>
  ` : `
  <div class="slot-empty-state">
    <p>Sélectionnez une console pour commencer</p>
  </div>
  `}
</div>`;
}

function buildCategoryHTML(cat, slot) {
  const selectedSet = slot.selectedMods[cat.id] || new Set();
  const count = selectedSet.size;
  return `
<div class="mod-category">
  <div class="mod-category-header">
    <span class="mod-cat-icon">${cat.icon}</span>
    <span class="mod-cat-label">${cat.label}</span>
    ${count > 0 ? `<span class="mod-cat-count">${count}</span>` : ''}
    <span class="mod-cat-arrow">▼</span>
  </div>
  <div class="mod-category-content">
    ${cat.exclusive ? `<p class="mod-cat-hint">Sélection unique</p>` : ''}
    ${cat.mods.map(mod => {
      const selected = selectedSet.has(mod.id);
      return `
<div class="mod-item ${selected ? 'selected' : ''}"
     data-mod-id="${mod.id}" data-cat-id="${cat.id}" data-exclusive="${cat.exclusive}">
  <span class="mod-check-dot">${selected ? '●' : '○'}</span>
  <div class="mod-item-body">
    <div class="mod-item-name">${mod.name}</div>
    <div class="mod-item-meta">
      <span class="mod-brand">${mod.brand}</span>
      <span class="mod-price">${mod.priceRange}</span>
      <span class="mod-diff">${buildDiffDots(mod.difficulty)}</span>
    </div>
    ${selected ? `
    <div class="mod-item-details">
      ${mod.pros.length ? `<ul class="mod-pros">${mod.pros.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
      ${mod.cons.length ? `<ul class="mod-cons">${mod.cons.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
    </div>` : ''}
  </div>
</div>`;
    }).join('')}
  </div>
</div>`;
}

function buildDiffDots(level) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="diff-dot ${i < level ? 'filled' : ''}">${i < level ? '●' : '○'}</span>`
  ).join('');
}

function buildScorePreview(scores) {
  if (!scores) return '';
  const total = totalScore(scores);
  return `
<div class="score-preview-bars">
  ${COMPARATOR_DATA.scoreCategories.map(cat => `
  <div class="score-row">
    <span class="score-label">${cat.icon} ${cat.label}</span>
    <div class="score-track">
      <div class="score-fill" style="width:${scores[cat.id] * 10}%"></div>
    </div>
    <span class="score-val">${scores[cat.id]}/10</span>
  </div>`).join('')}
</div>
<div class="score-total-row">
  <span>Score total</span>
  <span class="score-total-val">${total}<span class="score-total-max">/50</span></span>
</div>`;
}

function updateUI() {
  const count = state.slots.length;
  document.getElementById('slots-counter').textContent = `${count} / ${state.maxSlots}`;
  const addBtn = document.getElementById('add-slot-btn');
  addBtn.disabled = count >= state.maxSlots;
  addBtn.style.opacity = count >= state.maxSlots ? '0.4' : '1';

  const filledSlots = state.slots.filter(s => s.consoleId);
  const canCompare = filledSlots.length >= 2;
  const compareBtn = document.getElementById('compare-btn');
  compareBtn.disabled = !canCompare;
  document.getElementById('compare-hint').style.display = canCompare ? 'none' : 'block';
}

function hideResults() {
  const sec = document.getElementById('results-section');
  sec.classList.add('hidden');
}

function compare() {
  const validSlots = state.slots.filter(s => s.consoleId);
  if (validSlots.length < 2) return;

  const results = validSlots.map(slot => {
    const consoleData = getConsoleData(slot.consoleId);
    const scores = computeScores(slot);
    const mods = getSelectedMods(slot);
    const name = slot.customName || `${consoleData.name} Custom`;
    return { slot, consoleData, scores, mods, name, total: totalScore(scores) };
  });

  renderResults(results);
  document.getElementById('results-section').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function generateNarrative(results) {
  const sorted = [...results].sort((a, b) => b.total - a.total);
  const winner = sorted[0];
  const runnerUp = sorted[1] || null;
  const gap = runnerUp ? winner.total - runnerUp.total : 0;

  const catComparison = COMPARATOR_DATA.scoreCategories.map(cat => ({
    cat,
    winScore: winner.scores[cat.id],
    delta: runnerUp ? winner.scores[cat.id] - runnerUp.scores[cat.id] : 0
  }));

  const winnerEdge = catComparison.filter(c => c.delta > 0).sort((a, b) => b.delta - a.delta);
  const loserEdge = catComparison.filter(c => c.delta < 0).sort((a, b) => a.delta - b.delta);

  const keyMod = winner.mods.length > 0
    ? winner.mods.reduce((best, m) => {
        const sum = Object.values(m.scoreImpact).reduce((s, v) => s + Math.max(0, v), 0);
        const bestSum = Object.values(best.scoreImpact).reduce((s, v) => s + Math.max(0, v), 0);
        return sum > bestSum ? m : best;
      }, winner.mods[0])
    : null;

  const lines = [];

  if (gap === 0) {
    lines.push(`C'est une égalité parfaite : <strong>${sorted.map(r => r.name).join('</strong> et <strong>')}</strong> atteignent toutes les deux <strong>${winner.total}/50</strong> — le choix final se fera sur vos préférences personnelles.`);
  } else if (gap >= 5) {
    lines.push(`<strong>${winner.name}</strong> s'impose sans discussion avec <strong>${winner.total}/50</strong>, soit ${gap} points d'avance sur ${runnerUp ? runnerUp.name : 'les autres'} — une domination nette dans cette comparaison.`);
  } else {
    lines.push(`La comparaison est serrée, mais <strong>${winner.name}</strong> prend l'avantage avec <strong>${winner.total}/50</strong> contre ${runnerUp ? `${runnerUp.total}/50 pour ${runnerUp.name}` : 'les autres setups'} — ${gap} point${gap > 1 ? 's' : ''} d'écart seulement.`);
  }

  if (winnerEdge.length >= 2) {
    const top2 = winnerEdge.slice(0, 2).map(c => `${c.cat.icon} <strong>${c.cat.label}</strong> (${c.winScore}/10)`);
    lines.push(`Sa force réside surtout en ${top2.join(' et ')}, des domaines où il creuse un écart décisif par rapport aux autres configurations.`);
  } else if (winnerEdge.length === 1) {
    const top = winnerEdge[0];
    lines.push(`Il se distingue principalement sur ${top.cat.icon} <strong>${top.cat.label}</strong> avec ${top.winScore}/10, une catégorie clé pour l'expérience globale.`);
  } else {
    lines.push(`Il ne surpasse pas les autres sur une catégorie précise, mais maintient une régularité remarquable sur l'ensemble des critères — c'est son équilibre qui fait la différence.`);
  }

  if (keyMod) {
    const extras = winner.mods.length - 1;
    lines.push(`Le choix du <strong>${keyMod.name}</strong> (${keyMod.brand})${extras > 0 ? `, combiné à ${extras} autre${extras > 1 ? 's' : ''} mod${extras > 1 ? 's' : ''}` : ''}, contribue directement à ces performances et justifie l'investissement pour ce setup.`);
  } else {
    lines.push(`Sans aucun mod, <strong>${winner.name}</strong> s'appuie uniquement sur les qualités natives de la console — un rappel que la base compte autant que les modifications.`);
  }

  if (runnerUp) {
    if (loserEdge.length > 0) {
      const topLoser = loserEdge[0];
      lines.push(`<strong>${runnerUp.name}</strong> n'est pas sans atout : il dépasse le gagnant sur ${topLoser.cat.icon} <strong>${topLoser.cat.label}</strong> (${runnerUp.scores[topLoser.cat.id]}/10 vs ${topLoser.winScore}/10) — un avantage à peser selon vos priorités.`);
    } else {
      lines.push(`<strong>${runnerUp.name}</strong> reste une option solide avec ${runnerUp.total}/50 et pourrait s'imposer si votre priorité diffère de l'expérience globale recherchée ici.`);
    }
  }

  const lowestMods = sorted.reduce((m, r) => r.mods.length < m.mods.length ? r : m, sorted[0]);
  if (winner.name === lowestMods.name && sorted.some(r => r.mods.length > winner.mods.length)) {
    lines.push(`En définitive, <strong>${winner.name}</strong> prouve qu'un setup minimaliste bien pensé peut surpasser une configuration plus chargée — la qualité des mods prime sur la quantité.`);
  } else if (winner.mods.length > 2) {
    lines.push(`En résumé, <strong>${winner.name}</strong> est le meilleur choix ici, mais il demande un investissement conséquent — si votre budget est serré, réévaluez les mods non essentiels pour rester compétitif.`);
  } else {
    lines.push(`En conclusion, <strong>${winner.name}</strong> est le setup conseillé : il offre la meilleure expérience globale de cette comparaison et constitue un investissement cohérent pour profiter pleinement de votre console.`);
  }

  return lines;
}

function renderResults(results) {
  const content = document.getElementById('results-content');

  const verdicts = computeVerdicts(results);
  const allPros = results.map(r => r.mods.flatMap(m => m.pros));
  const allCons = results.map(r => r.mods.flatMap(m => m.cons));
  const winner = results.reduce((best, r) => r.total > best.total ? r : best, results[0]);
  const narrative = generateNarrative(results);

  content.innerHTML = `
<div class="narrative-section">
  <div class="narrative-header">
    <span class="narrative-icon">📋</span>
    <h3>Compte rendu</h3>
  </div>
  <div class="narrative-body">
    ${narrative.map((line, i) => `
    <p class="narrative-line"><span class="narrative-num">0${i + 1}</span>${line}</p>`).join('')}
  </div>
</div>

<div class="results-overview">
  ${results.map(r => `
  <div class="result-overview-card ${r === winner ? 'winner' : ''}">
    ${r === winner ? '<div class="winner-crown">👑 MEILLEUR CUSTOM</div>' : ''}
    <div class="result-console-icon">${r.consoleData.icon}</div>
    <div class="result-name">${r.name}</div>
    <div class="result-console-sub">${r.consoleData.fullName}</div>
    <div class="result-total-score">${r.total}<span class="result-total-max">/50</span></div>
    <div class="result-mods-count">${r.mods.length} mod${r.mods.length !== 1 ? 's' : ''} sélectionné${r.mods.length !== 1 ? 's' : ''}</div>
    ${r.mods.length > 0 ? `
    <ul class="result-mods-chips">
      ${r.mods.map(m => `<li class="mod-chip">${m.name}</li>`).join('')}
    </ul>` : '<p class="result-no-mods">Console stock (sans mod)</p>'}
  </div>`).join('')}
</div>

<div class="results-comparison">
  <h3 class="results-sub-title">Comparaison par catégorie</h3>
  <div class="comparison-grid">
    ${COMPARATOR_DATA.scoreCategories.map(cat => {
      const maxVal = Math.max(...results.map(r => r.scores[cat.id]));
      return `
<div class="comparison-category">
  <div class="comparison-cat-header">
    <span>${cat.icon}</span>
    <span>${cat.label}</span>
  </div>
  ${results.map(r => {
    const val = r.scores[cat.id];
    const isBest = val === maxVal && results.filter(x => x.scores[cat.id] === maxVal).length === 1;
    return `
  <div class="comparison-bar-row ${isBest ? 'best' : ''}">
    <span class="comparison-bar-label">${r.name}</span>
    <div class="comparison-bar-track">
      <div class="comparison-bar-fill" style="width:${val * 10}%"></div>
    </div>
    <span class="comparison-bar-val ${isBest ? 'best-val' : ''}">${val}/10${isBest ? ' ★' : ''}</span>
  </div>`;
  }).join('')}
</div>`;
    }).join('')}
  </div>
</div>

<div class="verdicts-section">
  <h3 class="results-sub-title">Verdicts</h3>
  <div class="verdicts-grid">
    ${verdicts.map(v => `
    <div class="verdict-card">
      <div class="verdict-icon">${v.icon}</div>
      <div class="verdict-label">${v.label}</div>
      <div class="verdict-winner">${v.winner}</div>
    </div>`).join('')}
  </div>
</div>

<div class="global-analysis">
  <h3 class="results-sub-title">Analyse globale</h3>
  <div class="analysis-grid">
    ${results.map((r, i) => `
    <div class="analysis-card">
      <div class="analysis-card-header">
        <span>${r.consoleData.icon}</span>
        <strong>${r.name}</strong>
      </div>
      ${r.mods.length > 0 ? `
      <div class="analysis-pros">
        <p class="analysis-section-label">✅ Points forts du custom</p>
        <ul>${[...new Set(allPros[i])].slice(0, 5).map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
      ${allCons[i].length > 0 ? `
      <div class="analysis-cons">
        <p class="analysis-section-label">⚠️ Points faibles & compromis</p>
        <ul>${[...new Set(allCons[i])].slice(0, 4).map(c => `<li>${c}</li>`).join('')}</ul>
      </div>` : ''}
      ` : '<p class="analysis-no-mods">Aucun mod sélectionné — configuration stock.</p>'}
    </div>`).join('')}
  </div>
</div>`;
}

function computeVerdicts(results) {
  const verdicts = COMPARATOR_DATA.scoreCategories.map(cat => {
    const maxVal = Math.max(...results.map(r => r.scores[cat.id]));
    const winners = results.filter(r => r.scores[cat.id] === maxVal);
    return {
      icon: cat.icon,
      label: `Meilleur ${cat.label}`,
      winner: winners.length === 1 ? winners[0].name : 'Ex aequo'
    };
  });

  const maxTotal = Math.max(...results.map(r => r.total));
  const totalWinners = results.filter(r => r.total === maxTotal);
  verdicts.push({
    icon: '🏆',
    label: 'Meilleur score global',
    winner: totalWinners.length === 1 ? totalWinners[0].name : 'Ex aequo'
  });

  const fewestCons = results.reduce((best, r) => {
    const cons = r.mods.flatMap(m => m.cons).length;
    return cons < best.cons ? { name: r.name, cons } : best;
  }, { name: results[0].name, cons: Infinity });
  verdicts.push({
    icon: '⚖️',
    label: 'Moins de compromis',
    winner: fewestCons.name
  });

  return verdicts;
}
