/* ════════════════════════════════════════════════════════════
   BLISS COUTURE — Three.js 3D WebGL Scroll Animation Engine
   Interactive Gold Zardozi Silk Ribbon + Floating Zari Dust
   + Scroll-Linked Camera Choreography + Mouse Fluid Physics
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Guard against missing canvas or missing THREE
  const canvas = document.getElementById('webglCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══ 1. SCENE, CAMERA & RENDERER SETUP ═══ */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  /* ═══ 2. LIGHTING ═══ */
  const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
  scene.add(ambientLight);

  // Key light: Warm Adda golden radiance
  const dirLight = new THREE.DirectionalLight(0xf5d9a0, 2.2);
  dirLight.position.set(5, 6, 4);
  scene.add(dirLight);

  // Rim light: Cool Banarasi silver fill
  const rimLight = new THREE.DirectionalLight(0xb5c9e2, 1.4);
  rimLight.position.set(-6, -4, 2);
  scene.add(rimLight);

  // Dynamic cursor point light
  const cursorLight = new THREE.PointLight(0xc4974c, 2.5, 12);
  cursorLight.position.set(0, 0, 3);
  scene.add(cursorLight);

  /* ═══ 3. ROYAL ZARDOZI RIBBON (3D Spline Silk Ghera) ═══ */
  const splinePoints = [
    new THREE.Vector3(-3.5, 2.0, -2.0),
    new THREE.Vector3(-1.8, -1.2, -0.5),
    new THREE.Vector3(0.0, 1.6, 0.5),
    new THREE.Vector3(2.2, -1.4, -1.0),
    new THREE.Vector3(3.6, 1.8, -2.5),
    new THREE.Vector3(1.8, -2.2, -3.5),
    new THREE.Vector3(-1.0, 0.0, -2.5),
    new THREE.Vector3(-2.8, 2.5, -1.5),
    new THREE.Vector3(0.2, -1.8, -1.0),
    new THREE.Vector3(2.8, 1.0, -2.0),
    new THREE.Vector3(1.0, 2.6, -3.2),
    new THREE.Vector3(-3.5, 2.0, -2.0),
  ];

  const curve = new THREE.CatmullRomCurve3(splinePoints, true, 'catmullrom', 0.5);
  const tubeGeometry = new THREE.TubeGeometry(curve, 180, 0.16, 20, true);

  // Rich metallic Zari material
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9C7238'),
    metalness: 0.88,
    roughness: 0.22,
    wireframe: false,
  });

  const ribbonMesh = new THREE.Mesh(tubeGeometry, ribbonMaterial);
  scene.add(ribbonMesh);

  // Delicate Zari wireframe halo
  const wireGeometry = new THREE.TubeGeometry(curve, 100, 0.22, 6, true);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#C4974C'),
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  ribbonMesh.add(wireMesh);

  /* ═══ 4. FLOATING GOLDEN ZARI & DABKA DUST PARTICLES ═══ */
  const particleCount = 750;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const basePositions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);

  // Palette of gold flakes, silk ivory, and sindoor embers
  const particlePalette = [
    new THREE.Color('#9C7238'),
    new THREE.Color('#C4974C'),
    new THREE.Color('#E8D8B5'),
    new THREE.Color('#D8A25E'),
    new THREE.Color('#78141F'),
  ];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 16;
    const y = (Math.random() - 0.5) * 16;
    const z = (Math.random() - 0.5) * 10 - 1;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = z;

    speeds[i] = 0.2 + Math.random() * 0.8;

    const col = particlePalette[Math.floor(Math.random() * particlePalette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Generate circular particle texture via canvas
  function createParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(240, 210, 140, 0.8)');
    grad.addColorStop(0.8, 'rgba(180, 130, 50, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(pCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.14,
    map: createParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  /* ═══ 5. SCROLL & MOUSE INTERACTION STATE ═══ */
  let scrollProgress = 0;
  let targetColor = new THREE.Color('#9C7238');
  let currentColor = new THREE.Color('#9C7238');

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener(
    'mousemove',
    (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );

  function calculateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
  }

  window.addEventListener('scroll', calculateScrollProgress, { passive: true });
  calculateScrollProgress();

  // Listen to runway looks for color morphing
  const runwayObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const swatch = entry.target.dataset.swatch;
          if (swatch) {
            targetColor = new THREE.Color(swatch);
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.runway-look').forEach((look) => {
    runwayObserver.observe(look);
  });

  // Reset color when leaving runway
  const runwaySection = document.getElementById('runway');
  if (runwaySection) {
    const resetObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            targetColor = new THREE.Color('#9C7238');
          }
        });
      },
      { threshold: 0 }
    );
    resetObserver.observe(runwaySection);
  }

  /* ═══ 6. 60 FPS ANIMATION LOOP ═══ */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth cursor interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Position cursor point light
    cursorLight.position.x = mouseX * 5;
    cursorLight.position.y = mouseY * 3.5;

    // Smooth color lerping for royal ribbon
    currentColor.lerp(targetColor, 0.04);
    ribbonMaterial.color.copy(currentColor);

    if (!prefersReducedMotion) {
      // Rotate & undulate ribbon based on time + scroll progress
      ribbonMesh.rotation.x = elapsedTime * 0.15 + scrollProgress * Math.PI * 1.5;
      ribbonMesh.rotation.y = elapsedTime * 0.2 + scrollProgress * Math.PI * 2.0;
      ribbonMesh.rotation.z = Math.sin(elapsedTime * 0.3) * 0.15;

      // Camera choreography along the 3D scroll runway
      camera.position.y = -scrollProgress * 5.5 + mouseY * 0.4;
      camera.position.x = mouseX * 0.6;
      camera.position.z = 7.5 - Math.sin(scrollProgress * Math.PI) * 1.8;
      camera.lookAt(0, -scrollProgress * 4.5, 0);

      // Animate floating gold particles
      const posAttr = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const speed = speeds[i];
        let py = posAttr.getY(i) - speed * delta * 0.3;

        // Reset particles that drift off screen
        if (py < -8) py = 8;
        posAttr.setY(i, py);

        // Subtle horizontal wave
        const bx = basePositions[i * 3];
        posAttr.setX(i, bx + Math.sin(elapsedTime * 0.8 + i) * 0.15 + mouseX * 0.3);
      }
      posAttr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ═══ 7. RESIZE HANDLING ═══ */
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', onWindowResize);
})();
