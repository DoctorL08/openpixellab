// js/configurator/engine.js — Moteur de customisation 3D (sans prix, sans mods)

export function setupLights(scene, preset) {
    if (preset === "bright") {
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 2));
        const pt = new THREE.PointLight(0xffffff, 1.5, 100);
        pt.position.set(2, 2, 2);
        scene.add(pt);
    } else {
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.25));
        const pt = new THREE.PointLight(0xffffff, 0.4, 100);
        pt.position.set(2, 2, 2);
        scene.add(pt);
    }
}

function updateMaterialColor(model, materialName, color) {
    model.traverse((child) => {
        if (child.isMesh && child.material && child.material.name === materialName) {
            child.material.color.set(color.color);
            child.material.transparent = color.opacity < 1;
            child.material.opacity = color.opacity;
            child.material.needsUpdate = true;
        }
    });
}

function buildColorSlideHTML(slide, index, total) {
    return `
        <div class="customization-slide" data-slide-index="${index}">
            <div class="slide-header">
                <button class="nav-arrow prev-slide" aria-label="Précédent">&#10094;</button>
                <div class="slide-title-group">
                    <h2>${slide.title}</h2>
                    <span class="slide-counter">${index + 1} / ${total}</span>
                </div>
                <button class="nav-arrow next-slide" aria-label="Suivant">&#10095;</button>
            </div>
            <div id="${slide.pickerId}" class="color-picker-container">
                <div class="color-row solid-row"></div>
                <div class="color-row clear-row"></div>
            </div>
        </div>`;
}

export function buildCustomizationHTML(cfg) {
    const colorCount = cfg.colorSlides.length;
    const total      = colorCount + 1; // +1 pour la slide Exporter
    let html = '<div id="customization-slider"><div id="customization-viewport"><div id="customization-track">';
    cfg.colorSlides.forEach((slide, i) => {
        html += buildColorSlideHTML(slide, i, total);
    });
    // Slide Exporter (toujours en dernière position)
    html += `
        <div class="customization-slide" data-slide-index="${colorCount}">
            <div class="slide-header">
                <button class="nav-arrow prev-slide" aria-label="Précédent">&#10094;</button>
                <div class="slide-title-group">
                    <h2>Exporter</h2>
                    <span class="slide-counter">${total} / ${total}</span>
                </div>
                <button class="nav-arrow next-slide" aria-label="Suivant">&#10095;</button>
            </div>
            <div class="export-slide-content">
                <button id="export-btn" class="export-slide-btn">&#128247;&nbsp;&nbsp;Exporter le Setup</button>
            </div>
        </div>`;
    html += '</div></div></div>';
    return html;
}

function createResetSwatch() {
    const div = document.createElement('div');
    div.className = 'color-option reset-swatch';
    div.title = 'Réinitialiser';
    div.innerHTML = '&#8635;';
    return div;
}

function initGameboyCustomization(cfg, model, renderer, scene, camera) {
    const colorPalettes = cfg.colorPalettes;
    const selectedFace = { color: null };

    function createColorPicker(containerId, materialName) {
        const pickerEl = document.getElementById(containerId);
        if (!pickerEl) return;
        const solidRow = pickerEl.querySelector('.solid-row');
        const clearRow = pickerEl.querySelector('.clear-row');
        solidRow.innerHTML = '';
        clearRow.innerHTML = '';

        const colors = Object.values(colorPalettes[materialName] || {});
        const solidColors = colors.filter(c => c.opacity === 1);
        const clearColors = colors.filter(c => c.opacity < 1);

        function deselectAll() {
            pickerEl.querySelectorAll('.color-option').forEach(el => el.classList.remove('is-selected'));
        }

        // Reset swatch
        const resetDiv = createResetSwatch();
        resetDiv.addEventListener('click', () => {
            deselectAll();
            resetDiv.classList.add('is-selected');

            model.traverse((child) => {
                if (child.isMesh && child.material && child.material.name === materialName) {
                    if (materialName === 'ledMaterial') {
                        child.material.color.set('#ff0000');
                    } else if (child.userData.originalColor) {
                        child.material.color.copy(child.userData.originalColor);
                    } else {
                        child.material.color.set('#ffffff');
                    }
                    child.material.opacity = 1;
                    child.material.transparent = false;
                    child.material.needsUpdate = true;
                }
            });

            if (materialName === 'faceMaterial') {
                selectedFace.color = null;
                model.traverse((child) => {
                    if (child.isMesh && child.material && child.material.name === 'backMaterial') {
                        if (child.userData.originalColor) {
                            child.material.color.copy(child.userData.originalColor);
                        } else {
                            child.material.color.set('#ffffff');
                        }
                        child.material.opacity = 1;
                        child.material.transparent = false;
                        child.material.needsUpdate = true;
                    }
                });
                const backPicker = document.getElementById('back-color-picker');
                if (backPicker) {
                    backPicker.querySelectorAll('.color-option').forEach(el => el.classList.remove('is-selected'));
                    const backReset = backPicker.querySelector('.reset-swatch');
                    if (backReset) backReset.classList.add('is-selected');
                }
            }

            renderer.render(scene, camera);
        });
        solidRow.appendChild(resetDiv);

        function createColorDiv(col) {
            const div = document.createElement('div');
            div.className = 'color-option' + (col.opacity < 1 ? ' is-clear' : '');
            div.style.backgroundColor = col.color;
            div.title = col.name;

            if (col.opacity < 1) {
                div.style.opacity = 0.7 + col.opacity * 0.3;
            }

            div.addEventListener('click', () => {
                deselectAll();
                div.classList.add('is-selected');

                if (materialName === 'faceMaterial') {
                    selectedFace.color = col;
                    updateMaterialColor(model, 'faceMaterial', col);

                    if (colorPalettes.backMaterial) {
                        let matchedBack;
                        if (cfg.backSyncCheckOpacity) {
                            matchedBack = Object.values(colorPalettes.backMaterial).find(
                                bc => bc.color === col.color && bc.opacity === col.opacity
                            );
                        } else {
                            matchedBack = Object.values(colorPalettes.backMaterial).find(
                                bc => bc.color === col.color
                            );
                        }
                        if (matchedBack) {
                            updateMaterialColor(model, 'backMaterial', matchedBack);
                            const backSlide = cfg.colorSlides.find(s => s.materialName === 'backMaterial');
                            if (backSlide) {
                                const backPicker = document.getElementById(backSlide.pickerId);
                                if (backPicker) {
                                    backPicker.querySelectorAll('.color-option').forEach(el => el.classList.remove('is-selected'));
                                    const matchEl = Array.from(backPicker.querySelectorAll('.color-option')).find(
                                        el => el.title === matchedBack.name
                                    );
                                    if (matchEl) matchEl.classList.add('is-selected');
                                }
                            }
                        }
                    }
                } else {
                    updateMaterialColor(model, materialName, col);
                }

                renderer.render(scene, camera);
            });

            return div;
        }

        solidColors.forEach(col => solidRow.appendChild(createColorDiv(col)));
        clearColors.forEach(col => clearRow.appendChild(createColorDiv(col)));

        if (clearColors.length === 0) {
            clearRow.style.display = 'none';
        }
    }

    const menu = document.getElementById('customization-menu');
    menu.innerHTML = buildCustomizationHTML(cfg);

    cfg.colorSlides.forEach(slide => createColorPicker(slide.pickerId, slide.materialName));

    renderer.render(scene, camera);
}

function initGamecubeCustomization(cfg, model, renderer, scene, camera) {
    const colorPalettes = cfg.colorPalettes;
    const rules = cfg.plasticSyncRules || {};

    function updateFaceMaterial(faceColor) {
        model.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            const matName = child.material.name;

            if (matName === 'faceMaterial') {
                child.material.color.set(faceColor.color);
                child.material.transparent = faceColor.opacity < 1;
                child.material.opacity = faceColor.opacity;
                child.material.needsUpdate = true;
            }

            if (matName === 'plasticMaterial' || matName === 'plasticMaterial2') {
                const cloned = child.material.clone();
                cloned.name = matName;

                if (rules.forcePlasticToGray && rules.forcePlasticToGray.includes(faceColor.name)) {
                    if (matName === 'plasticMaterial') {
                        cloned.color.set('#DDDDDD');
                    } else {
                        cloned.color.set('#3c3d3c');
                    }
                    cloned.transparent = false;
                    cloned.opacity = 1;
                } else if (rules.syncClear && rules.syncClear.includes(faceColor.name)) {
                    cloned.color.set(faceColor.color);
                    cloned.transparent = faceColor.opacity < 1;
                    cloned.opacity = faceColor.opacity;
                } else if (rules.forcePlastic2Black && rules.forcePlastic2Black.includes(faceColor.name)) {
                    if (matName === 'plasticMaterial' && child.userData.originalColor) {
                        cloned.color.copy(child.userData.originalColor);
                        cloned.transparent = false;
                        cloned.opacity = 1;
                    } else {
                        cloned.color.set('#3c3d3c');
                        cloned.transparent = false;
                        cloned.opacity = 1;
                    }
                } else if (rules.forceAllBlack && rules.forceAllBlack.includes(faceColor.name)) {
                    cloned.color.set('#3c3d3c');
                    cloned.transparent = false;
                    cloned.opacity = 1;
                } else {
                    cloned.color.set(faceColor.color);
                    cloned.transparent = faceColor.opacity < 1;
                    cloned.opacity = faceColor.opacity;
                }

                cloned.needsUpdate = true;
                child.material = cloned;
            }
        });
    }

    function createColorPicker(containerId, materialName) {
        const pickerEl = document.getElementById(containerId);
        if (!pickerEl) return;
        const solidRow = pickerEl.querySelector('.solid-row');
        const clearRow = pickerEl.querySelector('.clear-row');
        solidRow.innerHTML = '';
        // GameCube: always single row — hide clear-row
        if (clearRow) clearRow.style.display = 'none';

        function deselectAll() {
            pickerEl.querySelectorAll('.color-option').forEach(el => el.classList.remove('is-selected'));
        }

        const resetDiv = createResetSwatch();
        resetDiv.addEventListener('click', () => {
            deselectAll();
            resetDiv.classList.add('is-selected');

            if (materialName === 'faceMaterial') {
                model.traverse((child) => {
                    if (child.isMesh && child.material) {
                        const name = child.material.name;
                        if (name === 'faceMaterial' || name === 'plasticMaterial' || name === 'plasticMaterial2') {
                            if (child.userData.originalColor) {
                                child.material.color.copy(child.userData.originalColor);
                            }
                            child.material.transparent = false;
                            child.material.opacity = 1;
                            child.material.needsUpdate = true;
                        }
                    }
                });
            } else if (materialName === 'LedControllerMaterial') {
                model.traverse((child) => {
                    if (child.isMesh && child.material && child.material.name === 'LedControllerMaterial') {
                        child.visible = false;
                        child.material.emissiveIntensity = 0;
                    }
                    if (child.isLight && child.name && child.name.includes('Point')) {
                        child.visible = false;
                    }
                });
            } else {
                model.traverse((child) => {
                    if (child.isMesh && child.material && child.material.name === materialName && child.userData.originalColor) {
                        child.material.color.copy(child.userData.originalColor);
                        child.material.transparent = false;
                        child.material.opacity = 1;
                        child.material.needsUpdate = true;
                    }
                });
            }

            renderer.render(scene, camera);
        });
        solidRow.appendChild(resetDiv);

        const colors = Object.values(colorPalettes[materialName] || {});

        function createColorDiv(col) {
            const div = document.createElement('div');
            div.className = 'color-option' + (col.opacity < 1 ? ' is-clear' : '');
            div.style.backgroundColor = col.color;
            div.title = col.name;

            if (col.opacity < 1) {
                div.style.opacity = 0.7 + col.opacity * 0.3;
            }

            div.addEventListener('click', () => {
                deselectAll();
                div.classList.add('is-selected');

                if (materialName === 'faceMaterial') {
                    updateFaceMaterial(col);
                } else if (materialName === 'LedControllerMaterial') {
                    model.traverse((child) => {
                        if (child.isMesh && child.material && child.material.name === 'LedControllerMaterial') {
                            child.visible = true;
                            child.material.transparent = false;
                            child.material.opacity = 1;
                            child.material.color.setHex(0x000000);
                            child.material.emissive = new THREE.Color(col.color);
                            child.material.emissiveIntensity = 6;
                            child.material.needsUpdate = true;
                        }
                        if (child.isLight && child.name && child.name.includes('Point')) {
                            child.visible = true;
                            child.color = new THREE.Color(col.color);
                            child.intensity = 50;
                            child.distance = 2;
                            child.decay = 10;
                        }
                    });
                } else {
                    updateMaterialColor(model, materialName, col);
                }

                renderer.render(scene, camera);
            });

            return div;
        }

        // GameCube: all colors on a single row (no split)
        colors.forEach(col => solidRow.appendChild(createColorDiv(col)));
    }

    const menu = document.getElementById('customization-menu');
    menu.innerHTML = buildCustomizationHTML(cfg);

    cfg.colorSlides.forEach(slide => createColorPicker(slide.pickerId, slide.materialName));

    // Masquer les LED port par défaut
    model.traverse((child) => {
        if (child.isMesh && child.material && child.material.name === 'LedControllerMaterial') {
            child.visible = false;
        }
        if (child.isLight && child.name && child.name.includes('Point')) {
            child.visible = false;
        }
    });

    renderer.render(scene, camera);
}

export function buildConfig(consoleData) {
    return {
        modelPath: consoleData.modelPath,
        cameraSettings: consoleData.cameraSettings,
        lights: (scene) => setupLights(scene, consoleData.lightsPreset),
        initCustomization: (model, renderer, scene, camera) => {
            if (consoleData.behavior === 'gamecube') {
                initGamecubeCustomization(consoleData, model, renderer, scene, camera);
            } else {
                initGameboyCustomization(consoleData, model, renderer, scene, camera);
            }
        },
    };
}
