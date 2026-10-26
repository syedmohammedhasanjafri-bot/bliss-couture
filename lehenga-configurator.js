/* ════════════════════════════════════════════════════════════
   BLISS COUTURE — Interactive 3D Lehenga Configurator Engine
   Procedural 24-Kali Bridal Skirt Mesh + Couture Material Shaders
   (Raw Silk / Velvet / Organza) + Embroidery (Zardozi / Resham / Sequin)
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Wait for DOM and Three.js
  function initConfigurator() {
    const canvas = document.getElementById('lehengaCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const stage = canvas.parentElement;

    // Palette & State
    const state = {
      fabric: 'raw-silk',
      embroidery: 'zardozi',
      hue: '#6E141B', // Sindoor Crimson
      hueName: 'Sindoor Crimson',
      fabricName: 'Raw Silk Matka',
      embroideryName: 'Zardozi Gold',
    };

    // Color definitions
    const COLORS = {
      '#6E141B': { name: 'Sindoor Crimson', desc: 'Sindoor Crimson pure silk satin' },
      '#C99E32': { name: 'Haldi Gold', desc: 'Turmeric-infused raw matka' },
      '#9E244B': { name: 'Rani Pink', desc: 'Crushed Gulkand rani silk' },
      '#1A3A6B': { name: 'Nilambari Cobalt', desc: 'Deep monsoon twilight cobalt' },
      '#B89758': { name: 'Champagne Tissue', desc: 'Champagne tissue organza with gold weave' },
      '#1C3F30': { name: 'Emerald Velvet', desc: 'Royal emerald hand-dyed silk' },
    };

    // ═══ THREE.JS SCENE SETUP ═══
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0.2, 4.3);

    // Renderer with high DPR and color fidelity
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false;

    // ═══ LIGHTING (Luxury Studio Setup) ═══
    // Key light (soft warm white)
    const keyLight = new THREE.DirectionalLight(0xFFF9EE, 1.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Antique Gold Rim Light (Accentuates 24-Kali Pleat Folds)
    const rimLight = new THREE.DirectionalLight(0xD4AF37, 1.5);
    rimLight.position.set(-3.5, 2, -2.5);
    scene.add(rimLight);

    // Secondary Rim Light
    const fillRim = new THREE.DirectionalLight(0xEED9A0, 0.8);
    fillRim.position.set(3.5, -1, -2);
    scene.add(fillRim);

    // Soft Ambient fill
    const ambientLight = new THREE.AmbientLight(0xF5F2EB, 0.7);
    scene.add(ambientLight);

    // ═══ PROCEDURAL TEXTURES (Slub Silk & Velvet Nap) ═══
    function createSlubTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);

      // Fine horizontal & vertical slub threads
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let i = 0; i < 200; i++) {
        const y = Math.random() * 256;
        const h = Math.random() * 2 + 1;
        ctx.fillRect(0, y, 256, h);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 256;
        const w = Math.random() * 2 + 1;
        ctx.fillRect(x, 0, w, 256);
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      return tex;
    }

    const slubBumpTex = createSlubTexture();

    // ═══ PROCEDURAL 24-KALI LEHENGA GEOMETRY ═══
    const lehengaGroup = new THREE.Group();
    lehengaGroup.position.y = -0.1;
    scene.add(lehengaGroup);

    function buildLehengaMesh() {
      const height = 2.4;
      const waistR = 0.46;
      const hemR = 1.62;
      const radialSegs = 96; // Divisible by 24 -> 4 vertices per kali
      const heightSegs = 36;

      const geom = new THREE.CylinderGeometry(waistR, hemR, height, radialSegs, heightSegs, true);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Normalized height: 0 at waist (top, y = +height/2), 1 at hem (bottom, y = -height/2)
        const v = 0.5 - (y / height); // 0 -> 1

        const angle = Math.atan2(z, x);
        const currentR = Math.sqrt(x * x + z * z);

        // Couture bell flare curve
        const flare = Math.pow(v, 1.35);
        const baseRadius = waistR + (hemR - waistR) * flare;

        // 24-Kali flute pleat ripple (starts tight at waist, fans out into deep flutes at hem)
        const kaliCount = 24;
        const pleatDepth = 0.085 * Math.pow(v, 1.25);
        const flute = Math.sin(angle * kaliCount) * pleatDepth;

        // Micro-drape variation
        const microFold = Math.sin(angle * kaliCount * 2 + v * 3) * (0.015 * v);

        const newR = baseRadius + flute + microFold;
        const scale = newR / (currentR || 1);

        pos.setX(i, x * scale);
        pos.setZ(i, z * scale);
      }

      geom.computeVertexNormals();
      return geom;
    }

    // Skirt Material
    const skirtMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(state.hue),
      roughness: 0.45,
      metalness: 0.12,
      bumpMap: slubBumpTex,
      bumpScale: 0.012,
      side: THREE.DoubleSide,
    });

    const skirtMesh = new THREE.Mesh(buildLehengaMesh(), skirtMaterial);
    lehengaGroup.add(skirtMesh);

    // ═══ WAISTBAND (Kamarbandh) ═══
    const waistBandGeom = new THREE.TorusGeometry(0.46, 0.038, 16, 64);
    const waistBandMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xD4AF37),
      metalness: 0.95,
      roughness: 0.22,
    });
    const waistBandMesh = new THREE.Mesh(waistBandGeom, waistBandMat);
    waistBandMesh.rotation.x = Math.PI / 2;
    waistBandMesh.position.y = 1.2;
    lehengaGroup.add(waistBandMesh);

    // ═══ HEMLINE BORDER EMBROIDERY BAND (Chandi / Zardozi Zari) ═══
    function buildHemBorderMesh() {
      const height = 0.18;
      const waistR = 1.58;
      const hemR = 1.64;
      const radialSegs = 96;
      const geom = new THREE.CylinderGeometry(waistR, hemR, height, radialSegs, 4, true);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const angle = Math.atan2(z, x);
        const currentR = Math.sqrt(x * x + z * z);
        const flute = Math.sin(angle * 24) * 0.082;
        const newR = currentR + flute;
        const scale = newR / currentR;
        pos.setX(i, x * scale);
        pos.setZ(i, z * scale);
      }
      geom.computeVertexNormals();
      return geom;
    }

    const hemBorderMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xD4AF37),
      metalness: 0.92,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });

    const hemBorderMesh = new THREE.Mesh(buildHemBorderMesh(), hemBorderMaterial);
    hemBorderMesh.position.y = -1.18;
    lehengaGroup.add(hemBorderMesh);

    // ═══ HANGING LATKAN (Artisanal Gold Tassel Cord) ═══
    const latkanGroup = new THREE.Group();
    latkanGroup.position.set(-0.46, 1.15, 0.1);

    // Hanging cord
    const cordGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.9, 8);
    const goldCordMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xD4AF37),
      metalness: 0.9,
      roughness: 0.3,
    });
    const cordMesh = new THREE.Mesh(cordGeom, goldCordMat);
    cordMesh.position.y = -0.45;
    cordMesh.rotation.z = -0.05;
    latkanGroup.add(cordMesh);

    // Three Latkan Bells
    for (let b = 0; b < 3; b++) {
      const bellGeom = new THREE.ConeGeometry(0.035, 0.07, 12);
      const bellMesh = new THREE.Mesh(bellGeom, goldCordMat);
      bellMesh.position.set((b - 1) * 0.035, -0.9 - b * 0.04, (b - 1) * 0.02);
      latkanGroup.add(bellMesh);
    }
    lehengaGroup.add(latkanGroup);

    // Subtle mannequin waist support ring for structure
    const waistRingGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.1, 32);
    const waistRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1F1A17),
      roughness: 0.8,
    });
    const waistRing = new THREE.Mesh(waistRingGeom, waistRingMat);
    waistRing.position.y = 1.25;
    lehengaGroup.add(waistRing);

    // ═══ SHADER / MATERIAL UPDATE ENGINE ═══
    function updateMaterials() {
      const baseColor = new THREE.Color(state.hue);

      // 1. Fabric properties
      if (state.fabric === 'raw-silk') {
        skirtMaterial.color = baseColor;
        skirtMaterial.roughness = 0.46;
        skirtMaterial.metalness = 0.12;
        skirtMaterial.bumpMap = slubBumpTex;
        skirtMaterial.bumpScale = 0.015;
        skirtMaterial.transparent = false;
        skirtMaterial.opacity = 1.0;
      } else if (state.fabric === 'velvet') {
        // Velvet: deep, light-absorbing plush sheen
        const darkColor = baseColor.clone().multiplyScalar(0.92);
        skirtMaterial.color = darkColor;
        skirtMaterial.roughness = 0.88;
        skirtMaterial.metalness = 0.04;
        skirtMaterial.bumpMap = null;
        skirtMaterial.transparent = false;
        skirtMaterial.opacity = 1.0;
      } else if (state.fabric === 'organza') {
        // Organza: translucent, airy, high gossamer sheen
        skirtMaterial.color = baseColor;
        skirtMaterial.roughness = 0.25;
        skirtMaterial.metalness = 0.22;
        skirtMaterial.bumpMap = null;
        skirtMaterial.transparent = true;
        skirtMaterial.opacity = 0.84;
      }
      skirtMaterial.needsUpdate = true;

      // 2. Embroidery tones
      if (state.embroidery === 'zardozi') {
        // 24K Antique Gold Metallic
        hemBorderMaterial.color = new THREE.Color(0xD4AF37);
        hemBorderMaterial.metalness = 0.94;
        hemBorderMaterial.roughness = 0.22;

        waistBandMat.color = new THREE.Color(0xD4AF37);
        waistBandMat.metalness = 0.94;
        waistBandMat.roughness = 0.22;

        rimLight.color.setHex(0xD4AF37);
      } else if (state.embroidery === 'resham') {
        // Twisted Jewel-tone Silk Threadwork
        const reshamHue = state.hue === '#6E141B' ? 0xC5A059 : 0xD8B26E;
        hemBorderMaterial.color = new THREE.Color(reshamHue);
        hemBorderMaterial.metalness = 0.18;
        hemBorderMaterial.roughness = 0.58;

        waistBandMat.color = new THREE.Color(0xC5A059);
        waistBandMat.metalness = 0.25;
        waistBandMat.roughness = 0.52;

        rimLight.color.setHex(0xEADBB8);
      } else if (state.embroidery === 'sequin') {
        // Faceted High-Sparkle Micro-Luster
        hemBorderMaterial.color = new THREE.Color(0xFFF6D8);
        hemBorderMaterial.metalness = 0.98;
        hemBorderMaterial.roughness = 0.08;

        waistBandMat.color = new THREE.Color(0xFFF6D8);
        waistBandMat.metalness = 0.98;
        waistBandMat.roughness = 0.08;

        rimLight.color.setHex(0xFFFFFF);
      }
      hemBorderMaterial.needsUpdate = true;
      waistBandMat.needsUpdate = true;

      updateSummaryUI();
    }

    // ═══ SUMMARY & WHATSAPP GENERATOR ═══
    function updateSummaryUI() {
      const summaryText = document.getElementById('configSummaryText');
      const specCode = document.getElementById('configSpecCode');
      const consultBtn = document.getElementById('configConsultBtn');
      const fabricVal = document.getElementById('selectedFabricValue');
      const embVal = document.getElementById('selectedEmbroideryValue');
      const hueVal = document.getElementById('selectedHueValue');

      if (fabricVal) fabricVal.textContent = state.fabricName;
      if (embVal) embVal.textContent = state.embroideryName;
      if (hueVal) hueVal.textContent = state.hueName;

      const code = `BC-${state.fabric.slice(0, 3).toUpperCase()}-${state.embroidery.slice(0, 3).toUpperCase()}-24K`;
      if (specCode) specCode.textContent = code;

      const desc = `${state.hueName} bespoke bridal lehenga in ${state.fabricName} with 24-Kali hand-fluted ghera and ${state.embroideryName} artisanal embroidery.`;
      if (summaryText) summaryText.textContent = desc;

      if (consultBtn) {
        const msg = encodeURIComponent(
          `Namaste Bliss Couture, I have designed a bespoke lehenga on your 3D Configurator:\n\n` +
          `• Silhouette Spec: ${code}\n` +
          `• Color: ${state.hueName} (${state.hue})\n` +
          `• Fabric Texture: ${state.fabricName}\n` +
          `• Embroidery Tone: ${state.embroideryName}\n` +
          `• Construction: 24-Kali Handcrafted Ghera\n\n` +
          `I would like to arrange a private bridal consultation.`
        );
        consultBtn.href = `https://wa.me/919099773181?text=${msg}`;
      }
    }

    // ═══ INTERACTIVE ORBIT & DRAG PHYSICS ═══
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    let targetRotationY = 0.3; // Default elegant 3/4 angle
    let targetRotationX = 0.05;
    let autoRotate = true;
    let isVisible = false;

    function onPointerDown(e) {
      isDragging = true;
      autoRotate = false;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      previousPointerX = clientX;
      previousPointerY = clientY;
      canvas.style.cursor = 'grabbing';
      const hint = document.getElementById('canvasDragHint');
      if (hint) hint.classList.add('faded');
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      rotationVelocityX = deltaX * 0.007;
      rotationVelocityY = deltaY * 0.004;

      targetRotationY += rotationVelocityX;
      targetRotationX += rotationVelocityY;

      // Clamp vertical tilt
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX));

      previousPointerX = clientX;
      previousPointerY = clientY;
    }

    function onPointerUp() {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // Wheel zoom clamp
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.003;
      camera.position.z = Math.max(3.0, Math.min(5.2, camera.position.z));
    }, { passive: false });

    // Reset View Button
    const resetBtn = document.getElementById('btnResetView');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        targetRotationY = 0.3;
        targetRotationX = 0.05;
        camera.position.set(0, 0.2, 4.3);
        autoRotate = true;
      });
    }

    // ═══ UI EVENT BINDINGS ═══
    // Fabric Buttons
    document.querySelectorAll('[data-fabric]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-fabric]').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.fabric = btn.dataset.fabric;
        state.fabricName = btn.querySelector('.pill-name')?.textContent || btn.dataset.fabric;
        updateMaterials();
      });
    });

    // Embroidery Buttons
    document.querySelectorAll('[data-embroidery]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-embroidery]').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.embroidery = btn.dataset.embroidery;
        state.embroideryName = btn.querySelector('.pill-name')?.textContent || btn.dataset.embroidery;
        updateMaterials();
      });
    });

    // Hue Swatches
    document.querySelectorAll('.hue-swatch').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hue-swatch').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.hue = btn.dataset.hue;
        state.hueName = btn.dataset.name || btn.dataset.hue;
        updateMaterials();
      });
    });

    // ═══ INTERSECTION OBSERVER (Performance: Render only when in view) ═══
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(stage);

    // ═══ RESIZE HANDLER ═══
    function handleResize() {
      if (!canvas || !renderer) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    // ═══ RENDER LOOP (Fluid 60 FPS) ═══
    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible) return;

      // Auto gentle turn when idle
      if (autoRotate && !isDragging) {
        targetRotationY += 0.0025;
      }

      // Smooth dampening interpolation
      lehengaGroup.rotation.y += (targetRotationY - lehengaGroup.rotation.y) * 0.08;
      lehengaGroup.rotation.x += (targetRotationX - lehengaGroup.rotation.x) * 0.08;

      // Subtle breathing floating motion
      const time = performance.now() * 0.001;
      lehengaGroup.position.y = -0.1 + Math.sin(time * 1.5) * 0.02;

      // Latkan subtle inertia sway
      latkanGroup.rotation.z = Math.sin(time * 2.5 + lehengaGroup.rotation.y * 3) * 0.06;

      renderer.render(scene, camera);
    }

    updateMaterials();
    animate();
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigurator);
  } else {
    initConfigurator();
  }
})();
