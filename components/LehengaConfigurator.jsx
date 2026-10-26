import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

/**
 * Procedural 24-Kali Bridal Lehenga Mesh for React Three Fiber
 */
function LehengaMesh({ fabric, embroidery, hue }) {
  const meshRef = useRef();
  const latkanRef = useRef();

  // Generate 24-Kali fluted conical skirt geometry
  const geometry = useMemo(() => {
    const height = 2.4;
    const waistR = 0.46;
    const hemR = 1.62;
    const radialSegs = 96;
    const heightSegs = 36;

    const geom = new THREE.CylinderGeometry(waistR, hemR, height, radialSegs, heightSegs, true);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const v = 0.5 - (y / height); // 0 at waist, 1 at hem
      const angle = Math.atan2(z, x);
      const currentR = Math.sqrt(x * x + z * z);

      // Flared bell drape
      const flare = Math.pow(v, 1.35);
      const baseRadius = waistR + (hemR - waistR) * flare;

      // 24-Kali flute pleats
      const pleatDepth = 0.085 * Math.pow(v, 1.25);
      const flute = Math.sin(angle * 24) * pleatDepth;

      const newR = baseRadius + flute;
      const scale = newR / (currentR || 1);

      pos.setX(i, x * scale);
      pos.setZ(i, z * scale);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Material properties based on selected couture fabric
  const fabricProps = useMemo(() => {
    switch (fabric) {
      case 'velvet':
        return { roughness: 0.88, metalness: 0.04, transparent: false, opacity: 1.0 };
      case 'organza':
        return { roughness: 0.25, metalness: 0.22, transparent: true, opacity: 0.84 };
      case 'raw-silk':
      default:
        return { roughness: 0.46, metalness: 0.12, transparent: false, opacity: 1.0 };
    }
  }, [fabric]);

  // Accent properties based on selected embroidery tone
  const embroideryColor = useMemo(() => {
    switch (embroidery) {
      case 'sequin':
        return '#FFF6D8';
      case 'resham':
        return '#C5A059';
      case 'zardozi':
      default:
        return '#D4AF37';
    }
  }, [embroidery]);

  // Subtle floating sway
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (latkanRef.current) {
      const t = state.clock.getElapsedTime();
      latkanRef.current.rotation.z = Math.sin(t * 2.5) * 0.06;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.1, 0]}>
      {/* 24-Kali Skirt */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={hue}
          roughness={fabricProps.roughness}
          metalness={fabricProps.metalness}
          transparent={fabricProps.transparent}
          opacity={fabricProps.opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Kamarbandh Waistband */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.038, 16, 64]} />
        <meshStandardMaterial
          color={embroideryColor}
          metalness={embroidery === 'resham' ? 0.25 : 0.94}
          roughness={embroidery === 'sequin' ? 0.08 : 0.22}
        />
      </mesh>

      {/* Ghera Zari Hem Border */}
      <mesh position={[0, -1.18, 0]}>
        <cylinderGeometry args={[1.58, 1.64, 0.18, 96, 4, true]} />
        <meshStandardMaterial
          color={embroideryColor}
          metalness={embroidery === 'resham' ? 0.25 : 0.94}
          roughness={embroidery === 'sequin' ? 0.08 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hanging Latkan Tassels */}
      <group ref={latkanRef} position={[-0.46, 1.15, 0.1]}>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.9, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.3} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.035, -0.9 - i * 0.04, (i - 1) * 0.02]}>
            <coneGeometry args={[0.035, 0.07, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * BLISS COUTURE — Interactive 3D/AR Lehenga Configurator Component
 * Designed for Next.js 14/15 or React 18/19 with Tailwind CSS & Framer Motion
 */
export default function LehengaConfigurator() {
  const [fabric, setFabric] = useState('raw-silk');
  const [embroidery, setEmbroidery] = useState('zardozi');
  const [hue, setHue] = useState('#6E141B');

  const fabrics = [
    { id: 'raw-silk', name: 'Raw Silk', sub: 'Handwoven Slub Luster' },
    { id: 'velvet', name: 'Velvet', sub: 'Deep Plush Royal Nap' },
    { id: 'organza', name: 'Organza', sub: 'Airy Gossamer Sheen' },
  ];

  const embroideries = [
    { id: 'zardozi', name: 'Zardozi Gold', sub: '24K Wire & Dabka' },
    { id: 'resham', name: 'Resham', sub: 'Twisted Silk Threadwork' },
    { id: 'sequin', name: 'Sequin', sub: 'Faceted Micro-Luster' },
  ];

  const hues = [
    { hex: '#6E141B', name: 'Sindoor Crimson' },
    { hex: '#C99E32', name: 'Haldi Gold' },
    { hex: '#9E244B', name: 'Rani Pink' },
    { hex: '#1A3A6B', name: 'Nilambari Cobalt' },
    { hex: '#B89758', name: 'Champagne Tissue' },
    { hex: '#1C3F30', name: 'Emerald Velvet' },
  ];

  const currentHueName = hues.find((h) => h.hex === hue)?.name || 'Custom';
  const currentFabricName = fabrics.find((f) => f.id === fabric)?.name || 'Silk';
  const currentEmbroideryName = embroideries.find((e) => e.id === embroidery)?.name || 'Gold';
  const specCode = `BC-${fabric.slice(0, 3).toUpperCase()}-${embroidery.slice(0, 3).toUpperCase()}-24K`;

  const waMessage = encodeURIComponent(
    `Namaste Bliss Couture, I have configured a bespoke lehenga:\n\n` +
    `• Spec: ${specCode}\n` +
    `• Palette: ${currentHueName} (${hue})\n` +
    `• Fabric: ${currentFabricName}\n` +
    `• Embroidery: ${currentEmbroideryName}\n\n` +
    `I would like to book a private consultation.`
  );

  return (
    <section className="py-24 bg-[#F5F2EB] text-[#16120E] border-t border-[#E5E0D5] relative overflow-hidden" id="configurator">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9C7238] block mb-2">
            Interactive 3D Atelier
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
            Bespoke 3D <span className="italic font-light">Configurator</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5C554E] max-w-2xl font-light leading-relaxed">
            Rotate the 24-Kali bridal silhouette in full 360° space. Select couture fabric weights and artisanal embroidery tones to preview your heirloom before the first needle strikes the silk.
          </p>
        </motion.div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* 3D Canvas Pedestal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative min-h-[520px] bg-gradient-to-b from-white via-[#F5F2EB] to-[#ECE7DC] border border-[#E5E0D5] rounded-sm overflow-hidden flex items-center justify-center shadow-inner"
          >
            {/* Top Badge */}
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF8F5]/85 backdrop-blur-md border border-[#E5E0D5] font-mono text-[11px] tracking-widest uppercase text-[#16120E]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>3D Realtime Atelier • 60 FPS</span>
            </div>

            {/* Three.js Canvas */}
            <Canvas camera={{ position: [0, 0.2, 4.3], fov: 38 }} className="w-full h-full cursor-grab active:cursor-grabbing">
              <ambientLight intensity={0.7} />
              <directionalLight position={[3, 4, 3]} intensity={1.4} color="#FFF9EE" />
              <directionalLight position={[-3.5, 2, -2.5]} intensity={1.5} color="#D4AF37" />
              <directionalLight position={[3.5, -1, -2]} intensity={0.8} color="#EED9A0" />
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <LehengaMesh fabric={fabric} embroidery={embroidery} hue={hue} />
              </Float>
              <OrbitControls enablePan={false} minDistance={3.0} maxDistance={5.2} maxPolarAngle={Math.PI / 2 + 0.1} />
            </Canvas>

            {/* Bottom Drag Hint */}
            <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5]/80 backdrop-blur-md border border-[#E5E0D5] font-mono text-[11px] tracking-wider uppercase text-[#736B63]">
              <span>Drag to Rotate 360°</span>
            </div>
          </motion.div>

          {/* Right Control Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-7">
            {/* 1. Fabric */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-[#9C7238] text-lg">01</span>
                  <span className="font-serif text-lg font-medium">Couture Fabric Texture</span>
                </div>
                <span className="font-mono text-xs uppercase text-[#9C7238]">{currentFabricName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {fabrics.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFabric(f.id)}
                    className={`p-3 text-left border transition-all ${
                      fabric === f.id
                        ? 'bg-[#16120E] text-[#FAF8F5] border-[#16120E] shadow-sm'
                        : 'bg-white/80 hover:bg-white border-[#E5E0D5] text-[#16120E]'
                    }`}
                  >
                    <span className="block font-serif text-sm font-medium">{f.name}</span>
                    <span className="block text-[10px] opacity-70 mt-1 leading-tight">{f.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Embroidery */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-[#9C7238] text-lg">02</span>
                  <span className="font-serif text-lg font-medium">Artisanal Embroidery Tone</span>
                </div>
                <span className="font-mono text-xs uppercase text-[#9C7238]">{currentEmbroideryName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {embroideries.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setEmbroidery(e.id)}
                    className={`p-3 text-left border transition-all ${
                      embroidery === e.id
                        ? 'bg-[#16120E] text-[#FAF8F5] border-[#16120E] shadow-sm'
                        : 'bg-white/80 hover:bg-white border-[#E5E0D5] text-[#16120E]'
                    }`}
                  >
                    <span className="block font-serif text-sm font-medium">{e.name}</span>
                    <span className="block text-[10px] opacity-70 mt-1 leading-tight">{e.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Palette */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-[#9C7238] text-lg">03</span>
                  <span className="font-serif text-lg font-medium">Heirloom Base Palette</span>
                </div>
                <span className="font-mono text-xs uppercase text-[#9C7238]">{currentHueName}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {hues.map((h) => (
                  <button
                    key={h.hex}
                    onClick={() => setHue(h.hex)}
                    style={{ backgroundColor: h.hex }}
                    title={h.name}
                    className={`w-10 h-10 rounded-full transition-transform relative ${
                      hue === h.hex ? 'scale-110 ring-2 ring-offset-2 ring-[#9C7238]' : 'hover:scale-105'
                    }`}
                  >
                    {hue === h.hex && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Card & CTA */}
            <div className="p-5 bg-[#FAF8F5] border border-[#E5E0D5] space-y-3 mt-2">
              <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                <span className="font-mono text-[11px] tracking-wider uppercase text-[#736B63]">Bespoke Spec</span>
                <span className="font-mono text-xs tracking-wider text-[#9C7238] font-semibold">{specCode}</span>
              </div>
              <p className="font-serif italic text-[#16120E] text-sm leading-relaxed">
                {currentHueName} bridal lehenga crafted in {currentFabricName} with 24-Kali hand-fluted ghera and {currentEmbroideryName} artisanal embroidery.
              </p>
              <a
                href={`https://wa.me/919099773181?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3.5 px-6 bg-[#16120E] text-[#FAF8F5] hover:bg-[#9C7238] transition-colors font-serif text-sm tracking-wide"
              >
                Commission This Custom Silhouette
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
