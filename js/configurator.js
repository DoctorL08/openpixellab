// js/configurator.js — Contrôleur principal Three.js du configurateur 3D

import { CONSOLE_CONFIGS } from './configurator/console-data.js';
import { buildConfig } from './configurator/engine.js';
import { exportConfigImage } from './configurator/exporter.js';

let scene, camera, renderer, currentConsole, currentConfig;

const container    = document.getElementById('canvas-container');
const loadingEl    = document.getElementById('loading-indicator');
const selector     = document.getElementById('consoleSelector');
const custMenu     = document.getElementById('customization-menu');
const welcomeEl    = document.getElementById('welcome-prompt');
const themeToggleBtn = document.getElementById('theme-toggle');
const topBar         = document.getElementById('top-bar');
const tooltip      = document.getElementById('custom-tooltip');

let uiVisible = false; // UI starts hidden until a console is loaded

// Redimensionne le canvas pour couvrir exactement l'espace entre la top bar et le menu du bas
function updateCanvasBounds() {
    const topH  = topBar  ? topBar.offsetHeight  : 0;
    const menuH = uiVisible && custMenu ? custMenu.offsetHeight : 0;
    const w = window.innerWidth;
    const h = Math.max(window.innerHeight - topH - menuH, 100);

    container.style.top    = topH  + 'px';
    container.style.bottom = menuH + 'px';

    if (renderer) renderer.setSize(w, h);
    if (camera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}

initThree();
selector.addEventListener('change', loadConsole);
window.addEventListener('resize', onWindowResize);
animate();

// --- THEME TOGGLE ---
if (themeToggleBtn) {
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');

    // Sync button state with stored theme on load
    const savedTheme = localStorage.getItem('opl-theme');
    if (savedTheme === 'dark') {
        themeIcon.textContent = '☀️';
        themeToggleBtn.classList.remove('theme-moon');
        themeToggleBtn.classList.add('theme-sun');
    }

    function switchTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('opl-theme', newTheme);
        if (newTheme === 'light') {
            themeIcon.textContent = '🌙';
            themeToggleBtn.classList.remove('theme-sun');
            themeToggleBtn.classList.add('theme-moon');
        } else {
            themeIcon.textContent = '☀️';
            themeToggleBtn.classList.remove('theme-moon');
            themeToggleBtn.classList.add('theme-sun');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (!document.startViewTransition) {
            switchTheme();
            return;
        }

        const transition = document.startViewTransition(() => { switchTheme(); });

        transition.ready.then(() => {
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const clipPathStart = isDark
                ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';

            document.documentElement.animate(
                { clipPath: [clipPathStart, 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'] },
                { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
            );
        });
    });
}

// --- THREE.JS INIT ---
function initThree() {
    if (renderer) {
        renderer.dispose();
        const old = container.querySelector('canvas');
        if (old) container.removeChild(old);
    }

    scene    = new THREE.Scene();
    camera   = new THREE.PerspectiveCamera(75, 1, 0.001, 1000);
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    updateCanvasBounds();
}

function onWindowResize() {
    updateCanvasBounds();

    if (currentConfig) {
        let camY = currentConfig.cameraSettings?.position.y || 0;
        if (window.innerWidth <= 768 && currentConfig.cameraSettings?.mobileYOffset !== undefined) {
            camY += currentConfig.cameraSettings.mobileYOffset;
        }
        camera.position.y = camY;
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function setHighQuality() {
    if (!currentConsole) return;
    currentConsole.traverse((child) => {
        if (child.isMesh && child.material?.map) {
            child.material.map.minFilter = THREE.LinearMipMapLinearFilter;
            child.material.map.magFilter = THREE.LinearFilter;
            child.material.map.generateMipmaps = true;
            child.material.needsUpdate = true;
        }
    });
}

function disposeModel(obj) {
    if (!obj) return;
    obj.traverse((node) => {
        if (!node.isMesh) return;
        node.geometry?.dispose();
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach(mat => {
            if (!mat) return;
            mat.dispose();
            for (const key in mat) {
                if (typeof mat[key]?.dispose === 'function') mat[key].dispose();
            }
        });
    });
    renderer?.renderLists.dispose();
}

// --- SLIDE NAVIGATION ---
function initSlider() {
    let currentSlide = 0;
    const viewport = document.getElementById('customization-viewport');
    const track    = document.getElementById('customization-track');
    const slides   = Array.from(document.querySelectorAll('.customization-slide'));

    if (!viewport || !track || slides.length === 0) return;

    slides.forEach(s => {
        s.style.minWidth = '100%';
        s.style.width    = '100%';
        s.style.flexShrink = '0';
    });

    function goTo(index) {
        currentSlide = ((index % slides.length) + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * viewport.offsetWidth}px)`;
    }

    custMenu.querySelectorAll('.prev-slide').forEach(btn => {
        btn.addEventListener('click', () => goTo(currentSlide - 1));
    });
    custMenu.querySelectorAll('.next-slide').forEach(btn => {
        btn.addEventListener('click', () => goTo(currentSlide + 1));
    });

    window.addEventListener('resize', () => goTo(currentSlide));

    // Swipe
    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    viewport.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) > 50) goTo(currentSlide + (delta < 0 ? 1 : -1));
    }, { passive: true });

    goTo(0);
}

// --- TOOLTIP ON HOVER ---
function initTooltips() {
    if (!tooltip) return;

    document.querySelectorAll('.color-option').forEach(opt => {
        if (opt._hasTooltip) return;

        let hideTimer;

        opt.addEventListener('mouseenter', function () {
            if (!this.title) return;
            clearTimeout(hideTimer);

            tooltip.textContent = this.title;
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';

            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top  = `${rect.top - 36}px`;

            hideTimer = setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => { tooltip.style.visibility = 'hidden'; }, 250);
            }, 1800);
        });

        opt.addEventListener('mouseleave', () => {
            clearTimeout(hideTimer);
            tooltip.style.opacity = '0';
            setTimeout(() => { tooltip.style.visibility = 'hidden'; }, 250);
        });

        opt._hasTooltip = true;
    });
}

// Vide la scène (objets + lumières) sans recréer le renderer
function clearScene() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

// --- LOAD CONSOLE ---
async function loadConsole() {
    const selected = selector.value;

    if (!selected) {
        if (welcomeEl) welcomeEl.classList.remove('hidden');
        custMenu.style.display = 'none';
        uiVisible = false;
        if (currentConsole) {
            disposeModel(currentConsole);
            currentConsole = null;
        }
        clearScene();
        return;
    }

    loadingEl.style.display = 'flex';
    custMenu.style.display  = 'none';
    uiVisible = false;
    if (welcomeEl) welcomeEl.classList.add('hidden');

    // Libérer l'ancienne console et vider la scène
    if (currentConsole) {
        disposeModel(currentConsole);
        currentConsole = null;
    }
    clearScene();

    try {
        const consoleData = CONSOLE_CONFIGS[selected];
        if (!consoleData) throw new Error(`Console inconnue : ${selected}`);

        currentConfig = buildConfig(consoleData);

        let camZ = currentConfig.cameraSettings?.position.z || 3;
        let camY = currentConfig.cameraSettings?.position.y || 0;
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            if (currentConfig.cameraSettings?.mobileYOffset !== undefined) camY += currentConfig.cameraSettings.mobileYOffset;
            if (currentConfig.cameraSettings?.mobileZOffset !== undefined) camZ += currentConfig.cameraSettings.mobileZOffset;
        }

        camera.position.set(currentConfig.cameraSettings?.position.x || 0, camY, camZ);
        camera.near = currentConfig.cameraSettings?.cameraNear ?? 0.001;
        camera.updateProjectionMatrix();

        const loader = new THREE.GLTFLoader();
        const draco  = new THREE.DRACOLoader();
        draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        loader.setDRACOLoader(draco);

        loader.load(currentConfig.modelPath, (gltf) => {
            currentConsole = gltf.scene;

            // Sauvegarder les couleurs originales
            currentConsole.traverse((child) => {
                if (child.isMesh && child.material?.color && !child.userData.originalColor) {
                    child.userData.originalColor = child.material.color.clone();
                }
            });

            scene.add(currentConsole);
            setHighQuality();

            // Remplacer le logo Doctor L par le logo OpenPixel Lab (matériau ciblé uniquement)
            if (consoleData.logoMaterialName) {
                const texLoader = new THREE.TextureLoader();
                texLoader.load('Images/Logo OpenPixel Lab.png', (oplTex) => {
                    oplTex.flipY       = false;
                    oplTex.encoding    = THREE.sRGBEncoding;
                    oplTex.needsUpdate = true;
                    currentConsole.traverse((child) => {
                        if (!child.isMesh) return;
                        const mats = Array.isArray(child.material) ? child.material : [child.material];
                        mats.forEach((mat, idx) => {
                            if (!mat || mat.name !== consoleData.logoMaterialName) return;
                            const fresh = mat.clone();
                            fresh.map   = oplTex;
                            fresh.color.set('#ffffff'); // évite que la couleur violette teinte le logo
                            fresh.needsUpdate = true;
                            if (Array.isArray(child.material)) {
                                child.material[idx] = fresh;
                            } else {
                                child.material = fresh;
                            }
                        });
                    });
                    renderer.render(scene, camera);
                });
            }

            if (typeof currentConfig.lights === 'function') {
                currentConfig.lights(scene);
            }

            currentConfig.initCustomization(currentConsole, renderer, scene, camera);

            initSlider();
            initTooltips();

            const exportBtn = document.getElementById('export-btn');
            if (exportBtn) {
                exportBtn.addEventListener('click', async () => {
                    if (!currentConsole) return;
                    const label = selector.options[selector.selectedIndex]?.text || 'Console';
                    exportBtn.disabled = true;
                    exportBtn.innerHTML = 'Export en cours...';
                    try {
                        await exportConfigImage(scene, camera, renderer, currentConsole, label);
                    } finally {
                        exportBtn.disabled = false;
                        exportBtn.innerHTML = '&#128247;&nbsp;&nbsp;Exporter le Setup';
                    }
                });
            }

            loadingEl.style.display = 'none';
            custMenu.style.display  = 'block';
            uiVisible = true;
            updateCanvasBounds();
        });

    } catch (err) {
        console.error('Erreur de chargement :', err);
        loadingEl.style.display = 'none';
    }
}

// --- DRAG & ROTATE ---
let isDragging = false;
let prevMouse  = { x: 0, y: 0 };
let initPinch  = 0;
let isPinching = false;

container.addEventListener('mousedown', e => {
    isDragging = true;
    prevMouse  = { x: e.clientX, y: e.clientY };
});
container.addEventListener('mouseup',  () => { isDragging = false; });
container.addEventListener('mouseleave', () => { isDragging = false; });

container.addEventListener('mousemove', e => {
    if (!isDragging || !currentConsole) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    currentConsole.rotation.y += dx * 0.005;
    currentConsole.rotation.x += dy * 0.005;
    prevMouse = { x: e.clientX, y: e.clientY };
});

container.addEventListener('wheel', e => {
    e.preventDefault();
    if (!currentConfig) return;
    const s = currentConfig.cameraSettings || {};
    const speed  = s.zoomSpeed ?? 0.1;
    const min    = s.zoomMin   ?? 2.2;
    const max    = s.zoomMax   ?? 4;
    camera.position.z = Math.max(min, Math.min(max, camera.position.z + (e.deltaY < 0 ? -speed : speed)));
}, { passive: false });

container.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
        isDragging = true;
        isPinching = false;
        prevMouse  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
        isDragging = false;
        isPinching = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initPinch = Math.sqrt(dx * dx + dy * dy);
    }
    e.preventDefault();
}, { passive: false });

container.addEventListener('touchmove', e => {
    if (!currentConsole) return;
    if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        currentConsole.rotation.y += dx * 0.005;
        currentConsole.rotation.x += dy * 0.005;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (isPinching && e.touches.length === 2 && currentConfig) {
        const dx   = e.touches[0].clientX - e.touches[1].clientX;
        const dy   = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const s    = currentConfig.cameraSettings || {};
        const isMob = window.innerWidth <= 768;
        const min   = isMob && s.mobileZoomMin !== undefined ? s.mobileZoomMin : (s.zoomMin ?? 2.2);
        const max   = isMob && s.mobileZoomMax !== undefined ? s.mobileZoomMax : (s.zoomMax ?? 4);
        const speed = (max - min) * 0.005;
        camera.position.z = Math.max(min, Math.min(max, camera.position.z + (initPinch - dist) * speed));
        initPinch = dist;
    }
    e.preventDefault();
}, { passive: false });

container.addEventListener('touchend', () => {
    isDragging = false;
    isPinching = false;
});

// Empêcher le double-tap zoom sur iOS — uniquement sur le canvas, pas sur l'UI
let lastTap = 0;
container.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTap <= 300) e.preventDefault();
    lastTap = now;
}, { passive: false });
