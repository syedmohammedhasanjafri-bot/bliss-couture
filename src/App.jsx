import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import Lenis from 'lenis';
import {
  Menu,
  X,
  RotateCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Instagram,
  Check
} from 'lucide-react';

/* ═══ 3D LEHENGA MESH COMPONENT (React Three Fiber) ═══ */
function Lehenga3DModel({ fabric, embroidery, hue }) {
  const groupRef = useRef();
  const latkanRef = useRef();

  // Procedural 24-Kali Skirt Geometry
  const skirtGeometry = useMemo(() => {
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

      // Bell flare curve
      const flare = Math.pow(v, 1.35);
      const baseRadius = waistR + (hemR - waistR) * flare;

      // 24-Kali flute ripple
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

  // Material properties for fabric textures
  const fabricConfig = useMemo(() => {
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

  // Embroidery accent color and luster
  const embroideryConfig = useMemo(() => {
    switch (embroidery) {
      case 'sequin':
        return { color: '#FFF6D8', metalness: 0.98, roughness: 0.08 };
      case 'resham':
        return { color: '#C5A059', metalness: 0.25, roughness: 0.55 };
      case 'zardozi':
      default:
        return { color: '#D4AF37', metalness: 0.94, roughness: 0.22 };
    }
  }, [embroidery]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
    if (latkanRef.current) {
      const t = state.clock.getElapsedTime();
      latkanRef.current.rotation.z = Math.sin(t * 2.5) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Main Fluted Skirt */}
      <mesh geometry={skirtGeometry}>
        <meshStandardMaterial
          color={hue}
          roughness={fabricConfig.roughness}
          metalness={fabricConfig.metalness}
          transparent={fabricConfig.transparent}
          opacity={fabricConfig.opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Kamarbandh Waistband Ring */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.038, 16, 64]} />
        <meshStandardMaterial
          color={embroideryConfig.color}
          metalness={embroideryConfig.metalness}
          roughness={embroideryConfig.roughness}
        />
      </mesh>

      {/* Ghera Zari Lower Border Band */}
      <mesh position={[0, -1.18, 0]}>
        <cylinderGeometry args={[1.58, 1.64, 0.18, 96, 4, true]} />
        <meshStandardMaterial
          color={embroideryConfig.color}
          metalness={embroideryConfig.metalness}
          roughness={embroideryConfig.roughness}
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

/* ═══ MASTER APPLICATION COMPONENT ═══ */
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 3D Configurator State
  const [fabric, setFabric] = useState('raw-silk');
  const [embroidery, setEmbroidery] = useState('zardozi');
  const [hue, setHue] = useState('#6E141B');

  // Consultation Form State
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    city: '',
    vision: '',
    phone: '',
  });
  const [formStatus, setFormStatus] = useState('');

  // Smooth Lenis Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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

  const currentHueName = hues.find((h) => h.hex === hue)?.name || 'Sindoor Crimson';
  const currentFabricName = fabrics.find((f) => f.id === fabric)?.name || 'Raw Silk';
  const currentEmbroideryName = embroideries.find((e) => e.id === embroidery)?.name || 'Zardozi Gold';
  const specCode = `BC-${fabric.slice(0, 3).toUpperCase()}-${embroidery.slice(0, 3).toUpperCase()}-24K`;

  const waConfigMessage = encodeURIComponent(
    `Namaste Bliss Couture, I have designed a bespoke lehenga on your 3D Configurator:\n\n` +
    `• Silhouette Spec: ${specCode}\n` +
    `• Color: ${currentHueName} (${hue})\n` +
    `• Fabric Texture: ${currentFabricName}\n` +
    `• Embroidery Tone: ${currentEmbroideryName}\n` +
    `• Construction: 24-Kali Handcrafted Ghera\n\n` +
    `I would like to book a private bridal consultation.`
  );

  const runwayLooks = [
    {
      num: '01',
      name: 'Champagne Tissue Gold',
      desc: 'A whisper of champagne organza layered over tissue silk, finished with hand-applied pearl clusters and antique Zardozi trailing vines.',
      fabric: 'Pure Tissue Silk',
      embroidery: 'Zardozi, Pearl Cluster',
      ghera: '18-Kali Flared',
      hours: '1,200+',
      img: 'assets/lookbook/look-01-champagne.jpg',
    },
    {
      num: '02',
      name: 'Haldi Marigold Mirror',
      desc: 'Turmeric-soaked raw silk ablaze with hand-set Shisha mirrors and Resham running-stitch borders. Every mirror is individually backed with Lac.',
      fabric: 'Raw Silk Matka',
      embroidery: 'Shisha, Resham, Gold Wire',
      ghera: '20-Kali Circular',
      hours: '1,600+',
      img: 'assets/lookbook/look-02-haldi.jpg',
    },
    {
      num: '03',
      name: 'Rani Pink Silver Zardozi',
      desc: 'Rani silk dyed to the exact hue of crushed Gulkand petals, overlaid with silver Zardozi Jaal work so dense it takes two hands to lift the dupatta.',
      fabric: 'Pure Banarasi Silk',
      embroidery: 'Silver Zardozi, Dabka',
      ghera: '22-Kali Panelled',
      hours: '2,000+',
      img: 'assets/lookbook/look-03-rani.jpg',
    },
    {
      num: '04',
      name: 'Kesariya Peach Kundan',
      desc: 'The colour of a Vadodara sunrise pressed into Chanderi silk. Kundan stones set in gold foil follow a paisley Jaal from hemline to border.',
      fabric: 'Chanderi Silk Organza',
      embroidery: 'Kundan Jaal, Gold Zardozi',
      ghera: '20-Kali Gathered',
      hours: '1,800+',
      img: 'assets/lookbook/look-04-kesariya.jpg',
    },
    {
      num: '05',
      name: 'Nilambari Royal Cobalt',
      desc: 'Deep indigo-cobalt velvet, the colour of a Gujarati monsoon sky at dusk. Gold Zardozi vines climb every Kali panel with real Chandi Zari borders.',
      fabric: 'Silk Velvet',
      embroidery: 'Gold Zardozi, Chandi Zari',
      ghera: '22-Kali Panelled',
      hours: '2,200+',
      img: 'assets/lookbook/look-05-nilambari.jpg',
    },
    {
      num: '06',
      flagship: true,
      name: 'The Sindoor Mahal',
      subtitle: '24-Kali Crimson Zardozi Bridal Masterpiece',
      desc: 'The culmination of everything this atelier stands for. Twenty-four hand-cut Kali panels in Sindoor-red pure silk, each carrying a different ancestral motif in Zardozi, Dabka, and Resham.',
      fabric: 'Pure Silk Satin',
      embroidery: 'Zardozi, Dabka, Resham, Kundan',
      ghera: '24-Kali Full Circle',
      hours: '3,600+',
      img: 'assets/lookbook/look-06-sindoor.jpg',
    },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormStatus('Please provide both your name and WhatsApp number.');
      return;
    }
    const message = encodeURIComponent(
      `Namaste, I would like to book a private bridal consultation with Bliss Couture.\n\n` +
      `• Bride: ${formData.name}\n` +
      `• Wedding Date: ${formData.date || 'To be decided'}\n` +
      `• City/Country: ${formData.city || 'Not specified'}\n` +
      `• Vision & Traditions: ${formData.vision || 'To discuss in consultation'}\n` +
      `• Contact WhatsApp: ${formData.phone}`
    );
    window.open(`https://wa.me/919099773181?text=${message}`, '_blank', 'noopener,noreferrer');
    setFormStatus('Inquiry submitted. Connecting to WhatsApp Concierge...');
  };

  return (
    <div className="bg-[#F5F2EB] text-[#16120E] min-h-screen selection:bg-[#6E141B] selection:text-[#FAF8F5]">
      {/* ═══ NAVIGATION BAR ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EB]/90 backdrop-blur-md border-b border-[#E5E0D5]/70 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#overture" className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-medium text-[#16120E] hover:text-[#9C7238] transition-colors">
            BLISS COUTURE
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-9 font-sans text-xs uppercase tracking-[0.18em] text-[#5C554E]">
            <a href="#overture" className="hover:text-[#16120E] transition-colors">OVERTURE</a>
            <a href="#atelier" className="hover:text-[#16120E] transition-colors">ATELIER</a>
            <a href="#runway" className="hover:text-[#16120E] transition-colors">RUNWAY</a>
            <a href="#configurator" className="hover:text-[#9C7238] transition-colors flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> 3D ATELIER
            </a>
            <a href="#artisans" className="hover:text-[#16120E] transition-colors">ARTISANS</a>
            <a href="#ledger" className="hover:text-[#16120E] transition-colors">LEDGER</a>
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919099773181"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block px-5 py-2.5 border border-[#16120E] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#16120E] hover:text-[#FAF8F5] transition-all"
            >
              Book Private Consultation
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#16120E]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 bg-[#FAF8F5] border-b border-[#E5E0D5] p-6 lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4 text-sm font-sans tracking-widest uppercase">
              <a href="#overture" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#E5E0D5]/50">01 — Overture</a>
              <a href="#atelier" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#E5E0D5]/50">02 — Atelier</a>
              <a href="#runway" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#E5E0D5]/50">03 — Runway</a>
              <a href="#configurator" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#E5E0D5]/50 text-[#9C7238] font-medium">04 — 3D Configurator</a>
              <a href="#artisans" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#E5E0D5]/50">05 — Artisans</a>
              <a href="#ledger" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#E5E0D5]/50">06 — Ledger</a>
              <a
                href="https://wa.me/919099773181"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center py-3 bg-[#16120E] text-[#FAF8F5] text-xs uppercase tracking-widest"
              >
                Book Private Consultation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ═══ HERO SECTION (OVERTURE) ═══ */}
        <section id="overture" className="min-h-screen pt-32 pb-20 flex items-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Editorial Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-7"
            >
              <div className="inline-block font-mono text-xs uppercase tracking-[0.22em] text-[#9C7238]">
                Vadodara, Gujarat — Est. 1994
              </div>
              <h1 className="font-serif text-5xl sm:text-7xl font-normal leading-[1.08] tracking-tight">
                Luxury in its <br />
                <span className="italic font-light text-[#9C7238]">Purest Form</span>
              </h1>
              <p className="text-base sm:text-lg text-[#5C554E] max-w-xl font-light leading-relaxed">
                Handcrafted bridal lehengas born on the Adda frame — where Zardozi masters weave Resham and Dabka into heirlooms that outlive generations.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#runway"
                  className="px-8 py-4 bg-[#16120E] text-[#FAF8F5] hover:bg-[#9C7238] transition-colors text-xs uppercase tracking-[0.16em] text-center font-medium shadow-sm"
                >
                  View The Collection
                </a>
                <a
                  href="https://wa.me/919099773181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-[#16120E] text-[#16120E] hover:bg-[#16120E] hover:text-[#FAF8F5] transition-all text-xs uppercase tracking-[0.16em] text-center font-medium"
                >
                  Book Private Consultation
                </a>
              </div>
              <div className="pt-6 border-t border-[#E5E0D5] flex items-baseline gap-3">
                <span className="font-serif text-3xl font-light text-[#16120E]">22,000+</span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#8C847A]">Global Patrons Worldwide</span>
              </div>
            </motion.div>

            {/* Hero Image Stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative border border-[#E5E0D5] p-3 bg-white/60 shadow-lg">
                <img
                  src="assets/hero.jpg"
                  alt="Bliss Couture Flagship Zardozi Bridal Lehenga"
                  className="w-full h-auto object-cover max-h-[640px]"
                  loading="eager"
                />
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-[#FAF8F5]/90 backdrop-blur-md border border-[#E5E0D5] font-mono text-[11px] tracking-wider uppercase text-[#16120E]">
                  Sindoor Mahal • 24-Kali Flared
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CHAPTER 02: ATELIER CRAFTSMANSHIP ═══ */}
        <section id="atelier" className="py-24 border-t border-[#E5E0D5] bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-baseline">
              <div className="lg:col-span-5">
                <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
                  Where Thread Meets <br />
                  <span className="italic font-light text-[#9C7238]">Reverence</span>
                </h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base text-[#5C554E] font-light leading-relaxed">
                  Our Vadodara atelier is not a factory floor. It is a sunlit chamber where twelve master Karigar families — their Adda frames worn smooth by three generations of needlework — translate a bride's whispered vision into silk, gold wire, and Kundan stone. Every lehenga begins with a hand-drawn motif sheet.
                </p>
              </div>
            </div>

            {/* Craft Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Zardozi & Dabka', desc: 'Gold and silver metallic coil thread, twisted and couched by hand onto raw silk. A single 24-Kali panel takes forty days of continuous Adda work.' },
                { num: '02', title: 'Resham Threadwork', desc: 'Pure twisted silk thread in jewel-tone hues, hand-stitched into floral Jaal patterns that catch daylight differently from every angle.' },
                { num: '03', title: 'Kundan Jaal', desc: 'Uncut polki stones set in gold foil, pressed into Lac beds by hand. Each stone placement follows a hereditary motif map.' },
                { num: '04', title: 'Chandi Zari Border', desc: 'Real silver wire woven into brocade borders on wooden handlooms. The weight alone distinguishes genuine Chandi Zari from imitations.' },
              ].map((c) => (
                <div key={c.num} className="p-7 bg-[#F5F2EB] border border-[#E5E0D5] flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
                  <div>
                    <span className="font-serif italic text-2xl text-[#9C7238] block mb-3">{c.num}</span>
                    <h3 className="font-serif text-xl font-medium mb-3 text-[#16120E]">{c.title}</h3>
                    <p className="text-sm text-[#5C554E] font-light leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="w-8 h-0.5 bg-[#D4AF37] mt-6" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CHAPTER 03: THE BRIDAL RUNWAY ═══ */}
        <section id="runway" className="py-24 border-t border-[#E5E0D5]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9C7238] block mb-2">
                Heirloom Creations
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal">
                The Bridal <span className="italic font-light">Runway</span>
              </h2>
              <p className="mt-3 text-sm text-[#5C554E] font-light max-w-xl">
                Six bridal masterpieces crafted for royalty. Witness the fall, ghera, and handloom detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {runwayLooks.map((look) => (
                <div
                  key={look.num}
                  className={`bg-white border transition-all ${
                    look.flagship ? 'border-[#6E141B] shadow-md' : 'border-[#E5E0D5] hover:border-[#9C7238]'
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F5]">
                    <img
                      src={look.img}
                      alt={look.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 font-mono text-xs uppercase px-2.5 py-1 bg-white/90 border border-[#E5E0D5]">
                      {look.flagship ? 'Flagship 06' : `Look ${look.num}`}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif text-2xl font-medium text-[#16120E]">{look.name}</h3>
                    <p className="text-xs text-[#5C554E] font-light leading-relaxed line-clamp-3">{look.desc}</p>
                    
                    <div className="pt-3 border-t border-[#E5E0D5] space-y-1.5 font-mono text-[11px] text-[#736B63]">
                      <div className="flex justify-between">
                        <span>Base Fabric</span>
                        <span className="text-[#16120E]">{look.fabric}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Embroidery</span>
                        <span className="text-[#16120E]">{look.embroidery}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ghera Flare</span>
                        <span className="text-[#16120E]">{look.ghera}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Craft Hours</span>
                        <span className="text-[#9C7238] font-semibold">{look.hours}</span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/919099773181?text=Namaste,%20I%20am%20interested%20in%20commissioning%20${encodeURIComponent(look.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-center py-2.5 text-xs uppercase tracking-widest transition-colors ${
                        look.flagship ? 'bg-[#6E141B] text-[#FAF8F5] hover:bg-[#520E14]' : 'border border-[#16120E] hover:bg-[#16120E] hover:text-[#FAF8F5]'
                      }`}
                    >
                      Reserve Look
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CHAPTER 04: INTERACTIVE 3D/AR LEHENGA CONFIGURATOR ═══ */}
        <section id="configurator" className="py-24 border-t border-[#E5E0D5] bg-[#FAF8F5] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9C7238] block mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Interactive 3D Atelier Preview
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
                Bespoke 3D <span className="italic font-light text-[#9C7238]">Configurator</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#5C554E] max-w-2xl font-light leading-relaxed">
                Rotate the 24-Kali bridal silhouette in full 360° space. Select couture fabric weights and artisanal embroidery tones to preview your heirloom before the first needle strikes the silk.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* 3D Canvas Stage */}
              <div className="lg:col-span-7 relative min-h-[540px] bg-gradient-to-b from-white via-[#F5F2EB] to-[#ECE7DC] border border-[#E5E0D5] rounded-sm overflow-hidden flex items-center justify-center shadow-inner">
                {/* 3D Status Badge */}
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF8F5]/85 backdrop-blur-md border border-[#E5E0D5] font-mono text-[11px] tracking-widest uppercase text-[#16120E]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>3D Realtime Atelier • 60 FPS</span>
                </div>

                {/* React Three Fiber Canvas */}
                <Canvas camera={{ position: [0, 0.2, 4.3], fov: 38 }} className="w-full h-full cursor-grab active:cursor-grabbing">
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[3, 4, 3]} intensity={1.4} color="#FFF9EE" />
                  <directionalLight position={[-3.5, 2, -2.5]} intensity={1.5} color="#D4AF37" />
                  <directionalLight position={[3.5, -1, -2]} intensity={0.8} color="#EED9A0" />
                  <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                    <Lehenga3DModel fabric={fabric} embroidery={embroidery} hue={hue} />
                  </Float>
                  <OrbitControls enablePan={false} minDistance={3.0} maxDistance={5.2} maxPolarAngle={Math.PI / 2 + 0.1} />
                </Canvas>

                {/* Drag Hint */}
                <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF8F5]/85 backdrop-blur-md border border-[#E5E0D5] font-mono text-[11px] tracking-wider uppercase text-[#736B63]">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Drag to Rotate 360°</span>
                </div>
              </div>

              {/* Right Control Panel */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-7">
                {/* 1. Fabric Selection */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif italic text-[#9C7238] text-lg">01</span>
                      <span className="font-serif text-lg font-medium">Couture Fabric Texture</span>
                    </div>
                    <span className="font-mono text-xs uppercase text-[#9C7238] font-semibold">{currentFabricName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {fabrics.map((f) => (
                      <button
                        key={f.id}
                        type="button"
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

                {/* 2. Embroidery Tone */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif italic text-[#9C7238] text-lg">02</span>
                      <span className="font-serif text-lg font-medium">Artisanal Embroidery Tone</span>
                    </div>
                    <span className="font-mono text-xs uppercase text-[#9C7238] font-semibold">{currentEmbroideryName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {embroideries.map((e) => (
                      <button
                        key={e.id}
                        type="button"
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

                {/* 3. Base Hue Swatches */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif italic text-[#9C7238] text-lg">03</span>
                      <span className="font-serif text-lg font-medium">Heirloom Base Palette</span>
                    </div>
                    <span className="font-mono text-xs uppercase text-[#9C7238] font-semibold">{currentHueName}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {hues.map((h) => (
                      <button
                        key={h.hex}
                        type="button"
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

                {/* Configuration Spec Card */}
                <div className="p-5 bg-white border border-[#E5E0D5] space-y-3 mt-2">
                  <div className="flex items-baseline justify-between border-b border-[#E5E0D5] pb-2">
                    <span className="font-mono text-[11px] tracking-wider uppercase text-[#736B63]">Bespoke Spec Code</span>
                    <span className="font-mono text-xs tracking-wider text-[#9C7238] font-semibold">{specCode}</span>
                  </div>
                  <p className="font-serif italic text-[#16120E] text-sm leading-relaxed">
                    {currentHueName} bridal lehenga in {currentFabricName} with 24-Kali hand-fluted ghera and {currentEmbroideryName} artisanal embroidery.
                  </p>
                  <a
                    href={`https://wa.me/919099773181?text=${waConfigMessage}`}
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

        {/* ═══ CHAPTER 05: ARTISANS LINEAGE ═══ */}
        <section id="artisans" className="py-24 border-t border-[#E5E0D5]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
                The Karigar <span className="italic font-light text-[#9C7238]">Lineage</span>
              </h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-[#E5E0D5] mb-16">
              <div>
                <span className="font-serif text-5xl font-light text-[#16120E] block mb-2">12</span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#9C7238] block mb-2">Master Karigar Families</span>
                <p className="text-xs text-[#5C554E] leading-relaxed">Three-generation embroidery lineages from Lucknow, Bhopal, and Vadodara carrying hereditary motifs.</p>
              </div>
              <div>
                <span className="font-serif text-5xl font-light text-[#16120E] block mb-2">3,600</span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#9C7238] block mb-2">Peak Craft Hours Per Piece</span>
                <p className="text-xs text-[#5C554E] leading-relaxed">The Sindoor Mahal requires eighteen months of continuous Adda frame work. Zero shortcuts, zero machine assist.</p>
              </div>
              <div>
                <span className="font-serif text-5xl font-light text-[#16120E] block mb-2">24</span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#9C7238] block mb-2">Kali Panels in Flagship</span>
                <p className="text-xs text-[#5C554E] leading-relaxed">Each Kali is hand-cut from a single bolt of silk, embroidered individually, creating an authentic royal flare.</p>
              </div>
            </div>

            {/* Ancestral 4-Step Process */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: 'I', title: 'Consultation & Sketching', desc: 'Over chai and fabric swatches, the design team hand-draws motif sheets tailored to family traditions.' },
                { step: 'II', title: 'Fabric & Kali Cutting', desc: 'Raw silk from Varanasi and Mysore, shaped by master cutters with over twenty-two years of experience.' },
                { step: 'III', title: 'Adda Frame Needlework', desc: 'Panels are stretched on wooden Adda frames. Karigars embroider Zardozi in natural daylight.' },
                { step: 'IV', title: 'Assembly & Latkan Finishing', desc: 'Hand-assembled with Chandi Zari borders and gold wire Latkans, then pressed under muslin.' },
              ].map((p) => (
                <div key={p.step} className="p-6 bg-[#FAF8F5] border border-[#E5E0D5]">
                  <span className="font-serif italic text-2xl text-[#9C7238] block mb-2">{p.step}</span>
                  <h4 className="font-serif text-lg font-medium mb-2">{p.title}</h4>
                  <p className="text-xs text-[#5C554E] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CHAPTER 06: LEDGER & CONSULTATION ═══ */}
        <section id="ledger" className="py-24 border-t border-[#E5E0D5] bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-4xl sm:text-5xl font-normal mb-4">
                Begin Your <span className="italic font-light text-[#9C7238]">Bridal Journey</span>
              </h2>
              <p className="text-sm text-[#5C554E] font-light leading-relaxed mb-8 max-w-xl">
                Every Bliss Couture lehenga begins with a private consultation at our Vadodara atelier — or via a dedicated WhatsApp session for NRI brides across the globe.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#736B63] mb-1">Bride's Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#16120E] text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#736B63] mb-1">Wedding Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#16120E] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#736B63] mb-1">City / Country</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Vadodara, London"
                      className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#16120E] text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#736B63] mb-1">Your Vision</label>
                  <textarea
                    rows={4}
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    placeholder="Tell us about the lehenga you dream of..."
                    className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#16120E] text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#736B63] mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-3.5 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#16120E] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#16120E] text-[#FAF8F5] hover:bg-[#9C7238] transition-colors text-xs uppercase tracking-widest font-medium"
                >
                  Request Private Consultation
                </button>
                {formStatus && (
                  <p className="text-xs font-mono text-[#9C7238] mt-2">{formStatus}</p>
                )}
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6 pt-2">
              <div className="p-6 bg-white border border-[#E5E0D5] space-y-2">
                <span className="font-mono text-xs uppercase text-[#9C7238] tracking-widest">The Atelier</span>
                <p className="font-serif text-lg font-medium">Bliss Couture Studio</p>
                <p className="text-xs text-[#5C554E]">Vadodara, Gujarat, India — Est. 1994</p>
              </div>

              <div className="p-6 bg-white border border-[#E5E0D5] space-y-2">
                <span className="font-mono text-xs uppercase text-[#9C7238] tracking-widest">Direct Concierge</span>
                <p className="text-sm">
                  <a href="tel:+919099773181" className="hover:text-[#9C7238]">+91 90997 73181</a><br />
                  <a href="tel:+917990531329" className="hover:text-[#9C7238]">+91 79905 31329</a>
                </p>
                <p className="text-xs text-[#5C554E]">
                  <a href="mailto:blisscouture.in@gmail.com" className="hover:underline">blisscouture.in@gmail.com</a>
                </p>
              </div>

              <div className="p-6 bg-[#F5F2EB] border border-[#E5E0D5] space-y-2">
                <span className="font-mono text-xs uppercase text-[#6E141B] tracking-widest">For NRI Brides</span>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  We offer dedicated WhatsApp sessions with fabric swatches shipped worldwide, real-time Adda frame progress photos, and insured international shipping.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-14 border-t border-[#E5E0D5] bg-[#16120E] text-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="font-serif text-2xl tracking-widest block font-medium">BLISS COUTURE</span>
              <p className="text-xs text-white/50 tracking-wider uppercase mt-1">Luxury in its Purest Form</p>
            </div>
            <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-white/70">
              <a href="https://instagram.com/blisscoutureofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://wa.me/919099773181" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              <a href="mailto:blisscouture.in@gmail.com" className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/40 gap-4">
            <p>&copy; 1994–2026 Bliss Couture. Vadodara, Gujarat — Est. 1994. All rights reserved.</p>
            <p>Handcrafted with the same devotion we pour into every stitch.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
