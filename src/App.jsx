import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import ProductCard from './ProductCard';

/* =========================================================================
   NINJAStroy - O'zbekistonning Yetakchi Qurilish Mollari Gipermarketi
   Versiya: 3.2.0 (Production Ready)
   Arxitektura: Modulli komponentlar, reaktiv holat boshqaruvi,
   interaktiv qurilish kalkulyatori, to'liq filtrlash va savat tizimi.
   ========================================================================= */

// --- SVG IKONALAR KOMPONENTLARI (Tashqi kutubxonalarga bog'liqliksiz) ---
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  ShoppingCart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
  ),
  Heart: ({ filled }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#ff4757" : "none"} stroke={filled ? "#ff4757" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  ),
  GitCompare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><path d="M11 18H8a2 2 0 0 1-2-2V9"></path></svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  ),
  Truck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
  ),
  ShieldCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
  ),
  Calculator: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>
  ),
  Star: ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#ffb703" : "none"} stroke="#ffb703" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
  ),
  Trash2: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  List: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
  ),
  Sparkles: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
  ),
  CreditCard: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
  ),
  Hammer: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path><path d="M17.64 15 22 10.64"></path><path d="m20.91 3.26-6.36 6.36"></path><path d="M10.5 7.5 13 5l3 3-2.5 2.5"></path></svg>
  )
};

// --- REAL MAHSULOTLAR MA'LUMOTLAR BAZASI (Qurilish mollari katalogi) ---
const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    title: 'Bekobod Sement M500 D0 (Yuqori mustahkamlikdagi sement)',
    category: 'cement',
    price: 68000,
    oldPrice: 78000,
    unit: 'qop (50kg)',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    stockCount: 1850,
    badge: 'Xit savdo',
    sku: 'NS-CEM-500',
    brand: 'Bekobod Sement',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80',
    description: 'Barcha turdagi mas\'uliyatli beton konstruksiyalar, poydevor va quyma qismlar uchun mo\'ljallangan yuqori markali portlandsement.',
    specs: {
      markasi: 'M500 D0',
      ogirligi: '50 kg',
      qotish_vaqti: '45-120 daqiqa',
      ishlab_chiqaruvchi: 'O\'zbekiston (Bekobod)'
    }
  },
  {
    id: 'prod-002',
    title: 'Knauf Gipsokarton Plitasi (Namlikka chidamli GKLV 12.5mm)',
    category: 'drywall',
    price: 89000,
    oldPrice: 98000,
    unit: 'dona',
    rating: 4.8,
    reviewsCount: 98,
    inStock: true,
    stockCount: 620,
    badge: 'Kafolatlangan',
    sku: 'NS-KNF-125',
    brand: 'Knauf',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80',
    description: 'Hammom, oshxona va namligi yuqori bo\'lgan xonalar uchun maxsus yashil rangli namga chidamli gipsokarton listlari.',
    specs: { markasi: 'GKLV Namga chidamli', olchamlari: '2500x1200x12.5 mm', maydoni: '3.0 m²', ishlab_chiqaruvchi: 'Knauf Uzbekistan' }
  },
  {
    id: 'prod-003',
    title: 'Armatura A500C Ø 12 mm (Rossiya / O\'zmetkombinat)',
    category: 'metal',
    price: 9400,
    oldPrice: 10200,
    unit: 'metr',
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    stockCount: 14500,
    badge: 'Ulgurji narx',
    sku: 'NS-ARM-012',
    brand: 'O\'zmetkombinat',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    description: 'Issiq prokatlangan davriy profilli po\'lat armatura. Bino va inshootlar poydevori uchun 100% sertifikatlangan.',
    specs: { diametri: '12 mm', po_lat_markasi: 'A500C', standart: 'GOST 52544-2006', uzunligi: '11.7 metr (kesib beriladi)' }
  },
  {
    id: 'prod-004',
    title: 'Akfa Akrilik Fasad Bo\'yog\'i - Super Oq (15 litr)',
    category: 'paint',
    price: 340000,
    oldPrice: 410000,
    unit: 'chelak (15L)',
    rating: 4.7,
    reviewsCount: 65,
    inStock: true,
    stockCount: 110,
    badge: 'Chegirma -17%',
    sku: 'NS-PNT-AKF15',
    brand: 'Akfa Paint',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80',
    description: 'Tashqi atmosfera ta\'sirlariga, yomg\'ir va ultrabinafsha nurlariga o\'ta chidamli elastik fasad bo\'yog\'i.',
    specs: { hajmi: '15 litr / 25 kg', sarfi: '150-200 g/m²', qurish_vaqti: '2 soat', chidamlik: '10 yil kafolat' }
  },
  {
    id: 'prod-005',
    title: 'Pishgan Qizil G\'isht (Standart M150, 1-nav)',
    category: 'bricks',
    price: 1850,
    oldPrice: 2100,
    unit: 'dona',
    rating: 4.9,
    reviewsCount: 420,
    inStock: true,
    stockCount: 45000,
    badge: 'Xit savdo',
    sku: 'NS-BRK-M150',
    brand: 'Yangiyo\'l G\'isht',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=700&q=80',
    description: 'Devor terish, yuk ko\'taruvchi asosiy poydevor va qavatlararo devorlar uchun qattiq pishirilgan to\'liq gavdali g\'isht.',
    specs: { olchami: '250x120x65 mm', markasi: 'M150', sovuqqa_chidamliligi: 'F35', ogirligi: '3.6 kg' }
  },
  {
    id: 'prod-006',
    title: 'Bazalt Mineral Paxta Plitasi (TeploKNAUF 50mm)',
    category: 'insulation',
    price: 210000,
    oldPrice: 245000,
    unit: 'o\'ram (12 m²)',
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    stockCount: 340,
    badge: 'Issiqlik tejovchi',
    sku: 'NS-INS-BS50',
    brand: 'Basalt Wool',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    description: 'Tom qismi, pol va devorlar uchun yonmaydigan ekologik toza issiqlik hamda shovqin izolyatsiya plitasi.',
    specs: { qalinligi: '50 mm', zichligi: '35 kg/m³', yonish_guruhi: 'NG (Yonmaydi)', oramdagi_maydon: '12 m²' }
  },
  {
    id: 'prod-007',
    title: 'Knauf Rotband Universal Shuvoq Gipsi (30kg)',
    category: 'cement',
    price: 52000,
    oldPrice: 58000,
    unit: 'qop (30kg)',
    rating: 5.0,
    reviewsCount: 512,
    inStock: true,
    stockCount: 2100,
    badge: 'Tavsiya etiladi',
    sku: 'NS-KNF-ROT30',
    brand: 'Knauf',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80',
    description: 'Ichki devor va shiftlarni bir bosqichda tekislash uchun afsonaviy gipsli suvoq qorishmasi.',
    specs: { ogirligi: '30 kg', qatlam_qalinligi: '5 mm dan 50 mm gacha', sarfi: '8.5 kg / m² (10mm qatlamda)', ishlab_chiqaruvchi: 'Knauf' }
  },
  {
    id: 'prod-008',
    title: 'Bosch Professional Perforator GBH 2-28 F SDS-Plus',
    category: 'tools',
    price: 2450000,
    oldPrice: 2890000,
    unit: 'to\'plam',
    rating: 4.9,
    reviewsCount: 74,
    inStock: true,
    stockCount: 28,
    badge: 'Top Brend',
    sku: 'NS-TLS-BSH228',
    brand: 'Bosch',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=80',
    description: 'Og\'ir qurilish maydonlarida uzluksiz burg\'ulash va o\'yish ishlari uchun eng ishonchli professional perforator.',
    specs: { quvvati: '880 Vt', zarba_kuchi: '3.2 Joul', patron_turi: 'SDS-Plus + Tez almashtiriladigan', vazni: '3.1 kg' }
  },
  {
    id: 'prod-009',
    title: 'Gazoblok D500 (Avtoklavlangan Gazobeton Blok)',
    category: 'bricks',
    price: 28000,
    oldPrice: 32000,
    unit: 'dona',
    rating: 4.8,
    reviewsCount: 156,
    inStock: true,
    stockCount: 5400,
    badge: 'Yangi',
    sku: 'NS-BLK-GZ500',
    brand: 'EcoBlok Toshkent',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=700&q=80',
    description: 'Zilzilabardosh, yengil va issiqlikni ajoyib saqlovchi aniq geometriyali avtoklav gazobeton bloklari.',
    specs: { olchami: '600x300x200 mm', zichligi: 'D500', mustahkamlik: 'B2.5', dona_hajmi: '0.036 m³' }
  },
  {
    id: 'prod-010',
    title: 'Profil TruBa Kvadrat 40x40x2 mm (Metall konstruktsiyalar)',
    category: 'metal',
    price: 28500,
    oldPrice: 31000,
    unit: 'metr',
    rating: 4.7,
    reviewsCount: 94,
    inStock: true,
    stockCount: 3800,
    badge: 'Metalloprokat',
    sku: 'NS-MTL-TRB40',
    brand: 'Toshkent Truba Zavodi',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    description: 'Zabor, naves, darvoza va turli karkasli metall inshootlar barpo qilish uchun po\'lat kvadrat profil.',
    specs: { kesimi: '40x40 mm', devor_qalinligi: '2.0 mm', standart_uzunlik: '6 metr', metr_ogirligi: '2.31 kg' }
  },
  {
    id: 'prod-011',
    title: 'Kafel Yelim Qorishmasi - Ceresit CM 11 Plus (25 kg)',
    category: 'cement',
    price: 49000,
    oldPrice: 55000,
    unit: 'qop (25kg)',
    rating: 4.9,
    reviewsCount: 189,
    inStock: true,
    stockCount: 1200,
    badge: 'Kafolatlangan',
    sku: 'NS-ADH-CM11',
    brand: 'Ceresit',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80',
    description: 'Keramik plitka va granitlarni pol hamda devorlarga mustahkam yopishtirish uchun sovuqqa va suvga chidamli yelim.',
    specs: { vazni: '25 kg', ochiq_vaqt: '20 daqiqa', sarfi: '1.7 - 4.2 kg/m²', ishlatish_harorati: '+5°C dan +30°C gacha' }
  },
  {
    id: 'prod-012',
    title: 'Profil Metall Knauf CD 60x27 (Shift profili, 0.6mm)',
    category: 'drywall',
    price: 19500,
    oldPrice: 22000,
    unit: 'dona (3m)',
    rating: 4.8,
    reviewsCount: 112,
    inStock: true,
    stockCount: 4200,
    badge: 'Original Knauf',
    sku: 'NS-KNF-CD60',
    brand: 'Knauf',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80',
    description: 'Gipsokarton shift va devor karkaslari uchun qalinligi to\'liq 0.6 mm bo\'lgan galvanizatsiyalangan po\'lat profil.',
    specs: { kesimi: '60x27 mm', uzunligi: '3000 mm (3 metr)', qalinligi: '0.6 mm (haqiqiy qalinlik)', qoplamasi: 'Rux (Sink) himoyasi' }
  }
];

// --- KATEGORIYALAR RO'YXATI ---
const CATEGORIES = [
  { id: 'all', name: 'Barcha mahsulotlar', icon: 'Sparkles', count: 12 },
  { id: 'cement', name: 'Sement & Quruq qorishmalar', icon: 'Hammer', count: 3 },
  { id: 'drywall', name: 'Gipsokarton & Profillar', icon: 'Grid', count: 2 },
  { id: 'metal', name: 'Metalloprokat & Armatura', icon: 'ShieldCheck', count: 2 },
  { id: 'bricks', name: 'G\'isht & Gazoblok', icon: 'Truck', count: 2 },
  { id: 'paint', name: 'Bo\'yoqlar & Laklar', icon: 'Sparkles', count: 1 },
  { id: 'insulation', name: 'Izolyatsiya & Tom yopish', icon: 'ShieldCheck', count: 1 },
  { id: 'tools', name: 'Professional Asboblar', icon: 'Hammer', count: 1 }
];

// --- HERO BANNER SLAYDLARI ---
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'BAHORGI AKSIYA 2026',
    title: 'Katta Qurilish Mavsumi Boshlandi!',
    subtitle: 'Bekobod sementi, Knauf gipsokarton va O\'zmetkombinat armaturalariga 25% gacha chegirma.',
    buttonText: 'Aksiyadagi tovarlar',
    badge: 'Faqat shu haftada',
    bgColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #ea580c 150%)',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    tag: 'PROFESSIONAL BRIGADALARGA',
    title: 'Ulgurji Xarid Uchun Maxsus Narxlar',
    subtitle: 'Qurilish kompaniyalari va ustalar uchun shaxsiy menejer, shartnoma va bepul yetkazish.',
    buttonText: 'Ulgurji narxlarni olish',
    badge: 'Keshbek 3%',
    bgColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    tag: 'TEZKOR LOGISTIKA',
    title: 'Toshkent Bo\'ylab 2 Soatda Yetkazish',
    subtitle: 'Yuk mashinalarimiz (Isuzu, Gazel, MAN manipulyator) og\'ir yuklarni to\'g\'ridan-to\'g\'ri ob\'ektingizga tushirib beradi.',
    buttonText: 'Yetkazib berish shartlari',
    badge: 'Manipulyator xizmati',
    bgColor: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  }
];

// --- KO'P BERILADIGAN SAVOLLAR (FAQ) ---
const FAQ_ITEMS = [
  {
    question: "Katta hajmdagi qurilish mollarini ob'ektga qanday yetkazib berasiz?",
    answer: "Bizda shaxsiy avtopark mavjud: 1.5 tonnadan 25 tonnagacha bo'lgan yuk mashinalari va manipulyatorlar. Toshkent shahri va Toshkent viloyati bo'ylab buyurtma berilgan kunda yoki belgilangan soatda yetkaziladi. Xodimlarimiz yukni joyiga tushirib berish imkoniyatiga ega."
  },
  {
    question: "Tashkilotlar uchun to'lov va hisob-faktura (shartnoma) orqali ishlaysizmi?",
    answer: "Albatta! Biz barcha yuridik shaxslar bilan shartnoma, QQS (NDS) hisob-faktura (Didox orqali) va to'liq sertifikatlar bilan ishlaymiz. Shuningdek, naqd, Uzum Nasiya, Click, Payme va terminal orqali ham to'lovlar qabul qilinadi."
  },
  {
    question: "Mahsulotlarning sifati va sertifikatlari bormi?",
    answer: "NINJAStroy barcha tovarlarni to'g'ridan-to'g'ri ishlab chiqaruvchi zavodlardan olib keladi (Knauf, Bekobod Sement, O'zmetkombinat, Ceresit, Akfa). Har bir partiyaga muvofiqlik sertifikati va sifat pasporti taqdim etiladi."
  },
  {
    question: "Ortib qolgan qurilish materiallarini qaytarib bersa bo'ladimi?",
    answer: "Ha, agar mahsulotning o'rami butun, qadoqlangan holatda va tovar xarid cheki bo'lsa, xarid qilingan kundan boshlab 14 kun ichida to'liq pulini qaytarib olishingiz yoki boshqa mahsulotga almashtirishingiz mumkin."
  }
];

export default function App() {
  // --- HOLATLAR (STATE MANAGEMENT) ---
  const [products] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCity, setSelectedCity] = useState('Toshkent');

  // Modallar va Drawerlar
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Promokod tizimi
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  // Xabarnomalar (Toasts)
  const [toasts, setToasts] = useState([]);

  // Qurilish kalkulyatori holati
  const [calcTab, setCalcTab] = useState('brick'); // 'brick' | 'concrete' | 'plaster'
  const [calcInputs, setCalcInputs] = useState({
    wallLength: 10,
    wallHeight: 3,
    wallThickness: 25, // 12, 25, 38 cm
    concreteVolume: 5,
    plasterArea: 50,
    plasterThickness: 15
  });

  // Checkout formasi holati
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    deliveryType: 'standard', // 'standard' | 'express' | 'pickup'
    paymentMethod: 'cash', // 'cash' | 'click' | 'payme' | 'invoice'
    comment: ''
  });

  // --- EFFEKTLAR (CAROUSEL & TIMERS) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Toast qo'shish funksiyasi
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // --- SAVATCHA HARAKATLARI ---
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`"${product.title.slice(0, 32)}..." savatchaga qo'shildi!`, 'success');
  };

  const handleUpdateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Mahsulot savatchadan o'chirildi", 'info');
  };

  // --- SEVIMLILAR VA TAQQOSLASH HARAKATLARI ---
  const handleToggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast("Sevimlilardan olib tashlandi", 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast("Sevimlilar ro'yxatiga qo'shildi ❤️", 'success');
        return [...prev, product.id];
      }
    });
  };

  const handleToggleCompare = (product) => {
    setComparisonList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast("Taqqoslashdan chiqarildi", 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast("Maksimal 4 ta mahsulotni taqqoslash mumkin!", 'error');
          return prev;
        }
        showToast("Taqqoslash ro'yxatiga qo'shildi", 'success');
        return [...prev, product];
      }
    });
  };

  // --- PROMOKOD TEKSHIRISH ---
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'NINJA2026' || cleanCode === 'USTA') {
      setDiscountPercent(10);
      setPromoMessage({ text: "Super! 10% chegirma taqdim etildi!", type: 'success' });
      showToast("Promokod faollashtirildi: -10% chegirma!", 'success');
    } else if (cleanCode === 'BAHOR') {
      setDiscountPercent(15);
      setPromoMessage({ text: "Mavsumiy 15% chegirma qo'llanildi!", type: 'success' });
      showToast("Promokod faollashtirildi: -15% chegirma!", 'success');
    } else {
      setDiscountPercent(0);
      setPromoMessage({ text: "Bunday promokod topilmadi yoki muddati o'tgan.", type: 'error' });
    }
  };

  // --- SAVATNING MOLIYAVIY HISOB-KITOBI ---
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const cartDiscountAmount = useMemo(() => {
    return (cartSubtotal * discountPercent) / 100;
  }, [cartSubtotal, discountPercent]);

  const deliveryCost = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= 2000000) return 0; // 2 milliondan oshsa bepul
    return 120000; // Standart og'ir yuk yetkazish
  }, [cartSubtotal]);

  const cartGrandTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscountAmount + deliveryCost);
  }, [cartSubtotal, cartDiscountAmount, deliveryCost]);

  // --- FILTRLASH VA SARALASH (MEMOIZED) ---
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Kategoriya
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        // Qidiruv
        if (
          searchQuery &&
          !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        // Narx diapazoni
        if (p.price < priceRange.min || p.price > priceRange.max) return false;
        // Omborda borligi
        if (inStockOnly && !p.inStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // 'popular'
      });
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  // --- QURILISH KALKULYATORI HISOBLASH MANTIG'I ---
  const calcResults = useMemo(() => {
    if (calcTab === 'brick') {
      // Devor yuzasi = Bo'yi * Balandligi
      const area = calcInputs.wallLength * calcInputs.wallHeight;
      // 1 m2 ga kerakli g'isht soni (25 sm li devor uchun o'rtacha 102 dona, 12 sm li devor uchun 51 dona)
      const bricksPerM2 = calcInputs.wallThickness === 12 ? 51 : calcInputs.wallThickness === 38 ? 153 : 102;
      const totalBricks = Math.ceil(area * bricksPerM2 * 1.05); // 5% zaxira
      const cementBags = Math.ceil((totalBricks * 0.22) / 50); // Sement qop hisobi
      const sandTons = (totalBricks * 0.0008).toFixed(1);

      return {
        area: area.toFixed(1),
        item1Name: "Pishgan g'isht (zaxirasi bilan):",
        item1Value: `${totalBricks.toLocaleString()} dona`,
        item2Name: "Sement M500 (qorishma uchun):",
        item2Value: `${cementBags} qop (50kg)`,
        item3Name: "Qurilish qumi:",
        item3Value: `${sandTons} tonna`,
        estimatedCost: totalBricks * 1850 + cementBags * 68000
      };
    } else if (calcTab === 'concrete') {
      // 1 m3 B20 beton uchun ~ 330 kg sement, 0.8 m3 shag'al, 0.5 m3 qum
      const vol = calcInputs.concreteVolume;
      const cementBags = Math.ceil((vol * 330) / 50);
      const gravelTons = (vol * 1.2).toFixed(1);
      const sandTons = (vol * 0.8).toFixed(1);

      return {
        volume: vol,
        item1Name: "Sement M500 D0:",
        item1Value: `${cementBags} qop (50kg)`,
        item2Name: "Yuvilgan qum:",
        item2Value: `${sandTons} tonna`,
        item3Name: "Shag'al (Fraksiya 5-20):",
        item3Value: `${gravelTons} tonna`,
        estimatedCost: cementBags * 68000 + vol * 350000
      };
    } else {
      // Shpaklyovka / Suvoq
      const area = calcInputs.plasterArea;
      const thickness = calcInputs.plasterThickness;
      // 10 mm qatlam uchun Rotband sarfi ~ 8.5 kg/m2
      const totalKg = area * (thickness / 10) * 8.5;
      const bags = Math.ceil(totalKg / 30); // 30kg lik qop
      const primerLiters = Math.ceil(area * 0.15); // Gruntovka

      return {
        area: area,
        item1Name: "Rotband suvoq gipsi (30kg):",
        item1Value: `${bags} qop`,
        item2Name: "Chuqur singuvchi gruntovka:",
        item2Value: `${primerLiters} litr`,
        item3Name: "To'r (Serpyanka / Armirlash):",
        item3Value: `${Math.ceil(area * 1.1)} m²`,
        estimatedCost: bags * 52000 + primerLiters * 15000
      };
    }
  }, [calcTab, calcInputs]);

  // --- BUYURTMANI RASMIYLASHTIRISH ---
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
      showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", 'error');
      return;
    }

    showToast("🎉 Buyurtmangiz qabul qilindi! Menejer 5 daqiqada bog'lanadi.", 'success');
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className="ninja-store-app">
      {/* 1. TOP HEADER - E'LONLAR VA ALOQA */}
      <div className="ninja-topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span className="topbar-badge">Yangi omborxona</span>
            <span className="topbar-text">Toshkent halqa yo'li bo'ylab yangi yirik logistika markazimiz ishga tushdi!</span>
          </div>
          <div className="topbar-right">
            <div className="city-selector">
              <Icons.MapPin />
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="Toshkent">Toshkent filiali</option>
                <option value="Samarqand">Samarqand filiali</option>
                <option value="Fargona">Farg'ona filiali</option>
                <option value="Buxoro">Buxoro filiali</option>
              </select>
            </div>
            <a href="tel:+998712005500" className="topbar-phone">
              <Icons.Phone /> +998 (71) 200-55-00
            </a>
          </div>
        </div>
      </div>

      {/* 2. ASOSIY HEADER VA QIDIRUV */}
      <header className="ninja-header">
        <div className="container header-inner">
          {/* Logo */}
          <div className="brand-logo" onClick={() => setSelectedCategory('all')}>
            <div className="logo-icon-wrap">
              <span className="ninja-helmet">⚔️</span>
            </div>
            <div className="logo-text-wrap">
              <h1 className="brand-name">NINJA<span>Stroy</span></h1>
              <p className="brand-tagline">Qurilish mollari gipermarketi</p>
            </div>
          </div>

          {/* Qidiruv tizimi */}
          <div className="search-bar-wrap">
            <div className="search-input-group">
              <span className="search-icon"><Icons.Search /></span>
              <input
                type="text"
                placeholder="Mahsulot nomi, marka yoki artikul bo'yicha qidiring (Masalan: Bekobod, Knauf, M500)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <Icons.X />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="search-live-status">
                Topildi: <strong>{filteredProducts.length}</strong> ta tovar
              </div>
            )}
          </div>

          {/* Foydalanuvchi amallari */}
          <div className="header-actions">
            {/* Taqqoslash */}
            <button
              className="action-btn"
              title="Taqqoslangan tovarlar"
              onClick={() => setIsCompareOpen(true)}
            >
              <Icons.GitCompare />
              <span className="action-label">Taqoslash</span>
              {comparisonList.length > 0 && (
                <span className="action-badge">{comparisonList.length}</span>
              )}
            </button>

            {/* Sevimlilar */}
            <button
              className="action-btn"
              title="Sevimlilar"
              onClick={() => setIsFavoritesOpen(true)}
            >
              <Icons.Heart filled={favorites.length > 0} />
              <span className="action-label">Saralangan</span>
              {favorites.length > 0 && (
                <span className="action-badge">{favorites.length}</span>
              )}
            </button>

            {/* Savatcha */}
            <button
              className="action-btn cart-btn-accent"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="cart-icon-box">
                <Icons.ShoppingCart />
                {cart.length > 0 && (
                  <span className="action-badge cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                )}
              </div>
              <div className="cart-btn-info">
                <span className="cart-title">Savatcha</span>
                <span className="cart-total-sum">{cartSubtotal.toLocaleString()} so'm</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tezkor toifalar paneli */}
        <nav className="quick-category-nav">
          <div className="container nav-categories-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
                <span className="pill-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* 3. HERO SLIDER & AKSIYALAR */}
      <section className="ninja-hero-section">
        <div className="container">
          <div className="hero-slider" style={{ background: HERO_SLIDES[activeSlide].bgColor }}>
            <div className="hero-content">
              <div className="hero-badge-tag">{HERO_SLIDES[activeSlide].tag}</div>
              <h2 className="hero-title">{HERO_SLIDES[activeSlide].title}</h2>
              <p className="hero-subtitle">{HERO_SLIDES[activeSlide].subtitle}</p>
              <div className="hero-cta-group">
                <button
                  className="btn-primary hero-btn"
                  onClick={() => {
                    const catalogEl = document.getElementById('catalog-section');
                    catalogEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {HERO_SLIDES[activeSlide].buttonText}
                  <Icons.ChevronRight />
                </button>
                <button
                  className="btn-secondary hero-calc-btn"
                  onClick={() => setIsConsultOpen(true)}
                >
                  <Icons.Calculator /> Bepul Smeta Hisoblatish
                </button>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img
                src={HERO_SLIDES[activeSlide].image}
                alt="NINJAStroy qurilish mollari"
                className="hero-banner-img"
              />
              <div className="hero-float-badge">
                <span className="pulse-dot"></span>
                {HERO_SLIDES[activeSlide].badge}
              </div>
            </div>

            {/* Slider navigatsiya nuqtalari */}
            <div className="slider-dots">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${activeSlide === idx ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. AFZALLIKLAR PANELI (VALUE PROPOSITION) */}
      <section className="features-strip">
        <div className="container features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Icons.Truck /></div>
            <div className="feature-details">
              <h4>Tezkor Ob'ektga Yetkazish</h4>
              <p>Toshkent bo'ylab 2 soatda, viloyatlarga 24 soatda yetkazamiz.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icons.ShieldCheck /></div>
            <div className="feature-details">
              <h4>100% Sifat Kafolati</h4>
              <p>Barcha tovarlar zavod sertifikatlari va GOST talablariga mos.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icons.CreditCard /></div>
            <div className="feature-details">
              <h4>Qulay To'lov Turlari</h4>
              <p>Uzum Nasiya, Click, Payme yoki shartnoma orqali hisob-kitob.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Icons.Hammer /></div>
            <div className="feature-details">
              <h4>Professional Maslahat</h4>
              <p>Tajribali muhandislar to'g'ri mahsulot tanlashda bepul yordam beradi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERAKTIV QURILISH KALKULYATORI WIDGETI */}
      <section className="ninja-calculator-section">
        <div className="container">
          <div className="calculator-box">
            <div className="calculator-header">
              <div className="calc-title-wrap">
                <span className="calc-badge">Aqlli Maslahatchi</span>
                <h3>📐 Interaktiv Qurilish Materiallari Kalkulyatori</h3>
                <p>O'lchamlarni kiriting, biz zarur materiallar miqdori va taxminiy narxini hisoblab beramiz.</p>
              </div>
              <div className="calc-tabs">
                <button
                  className={`calc-tab-btn ${calcTab === 'brick' ? 'active' : ''}`}
                  onClick={() => setCalcTab('brick')}
                >
                  🧱 G'isht Devor
                </button>
                <button
                  className={`calc-tab-btn ${calcTab === 'concrete' ? 'active' : ''}`}
                  onClick={() => setCalcTab('concrete')}
                >
                  🏗️ Poydevor Betoni
                </button>
                <button
                  className={`calc-tab-btn ${calcTab === 'plaster' ? 'active' : ''}`}
                  onClick={() => setCalcTab('plaster')}
                >
                  🎨 Suvoq va Shpaklyovka
                </button>
              </div>
            </div>

            <div className="calculator-body">
              {/* Kirish parametrlari */}
              <div className="calc-inputs-column">
                {calcTab === 'brick' && (
                  <>
                    <div className="input-field">
                      <label>Devor umumiy uzunligi (metr):</label>
                      <input
                        type="number"
                        min="1"
                        value={calcInputs.wallLength}
                        onChange={(e) => setCalcInputs({ ...calcInputs, wallLength: Number(e.target.value) })}
                      />
                    </div>
                    <div className="input-field">
                      <label>Devor balandligi (metr):</label>
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={calcInputs.wallHeight}
                        onChange={(e) => setCalcInputs({ ...calcInputs, wallHeight: Number(e.target.value) })}
                      />
                    </div>
                    <div className="input-field">
                      <label>Devor qalinligi:</label>
                      <select
                        value={calcInputs.wallThickness}
                        onChange={(e) => setCalcInputs({ ...calcInputs, wallThickness: Number(e.target.value) })}
                      >
                        <option value={12}>Yarimta g'isht (12 sm)</option>
                        <option value={25}>Bitta g'isht (25 sm - Standart)</option>
                        <option value={38}>Bir yarimta g'isht (38 sm)</option>
                      </select>
                    </div>
                  </>
                )}

                {calcTab === 'concrete' && (
                  <div className="input-field">
                    <label>Kerakli beton hajmi (kub metr - m³):</label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={calcInputs.concreteVolume}
                      onChange={(e) => setCalcInputs({ ...calcInputs, concreteVolume: Number(e.target.value) })}
                    />
                    <small>Masalan: 10m x 0.5m x 1m lenta poydevor = 5 m³</small>
                  </div>
                )}

                {calcTab === 'plaster' && (
                  <>
                    <div className="input-field">
                      <label>Shuvaladigan yuza maydoni (m²):</label>
                      <input
                        type="number"
                        min="1"
                        value={calcInputs.plasterArea}
                        onChange={(e) => setCalcInputs({ ...calcInputs, plasterArea: Number(e.target.value) })}
                      />
                    </div>
                    <div className="input-field">
                      <label>Qorishma qalinligi (mm):</label>
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={calcInputs.plasterThickness}
                        onChange={(e) => setCalcInputs({ ...calcInputs, plasterThickness: Number(e.target.value) })}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Natijalar ko'rinishi */}
              <div className="calc-results-column">
                <div className="results-card">
                  <h4>Hisoblangan Natija:</h4>
                  <ul className="results-list">
                    <li><span>{calcResults.item1Name}</span><strong>{calcResults.item1Value}</strong></li>
                    <li><span>{calcResults.item2Name}</span><strong>{calcResults.item2Value}</strong></li>
                    <li><span>{calcResults.item3Name}</span><strong>{calcResults.item3Value}</strong></li>
                  </ul>
                  <div className="calc-total-bar">
                    <span>Taxminiy xomashyo narxi:</span>
                    <span className="calc-sum">{calcResults.estimatedCost.toLocaleString()} so'm</span>
                  </div>
                  <button
                    className="btn-primary full-width mt-3"
                    onClick={() => {
                      showToast("Kalkulyatsiya asosida savatcha to'ldirildi!", 'success');
                      handleAddToCart(products[0], 5);
                      setIsCartOpen(true);
                    }}
                  >
                    Ushbu tovarlarni savatga qo'shish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. KATALOG VA ASOSIY MAHSULOTLAR RO'YXATI */}
      <main className="container catalog-section" id="catalog-section">
        {/* Katalog boshqaruv paneli */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <h2>Katalog Mahsulotlari</h2>
            <span className="items-counter">{filteredProducts.length} ta mahsulot mavjud</span>
          </div>

          <div className="toolbar-right">
            {/* Saralash */}
            <div className="sort-box">
              <label>Saralash:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Ommabopligi bo'yicha</option>
                <option value="price-asc">Narx: Arzondan qimmatga</option>
                <option value="price-desc">Narx: Qimmatdan arzonga</option>
                <option value="rating">Reyting bo'yicha</option>
              </select>
            </div>

            {/* Ko'rinish rejimi (Grid / List) */}
            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Katak ko'rinishi"
              >
                <Icons.Grid />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Ro'yxat ko'rinishi"
              >
                <Icons.List />
              </button>
            </div>
          </div>
        </div>

        <div className="catalog-layout">
          {/* Chap yon panel - Filtrlar */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <div className="filter-title">
                <Icons.Filter /> Filtrlash
              </div>
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 3000000 });
                  setInStockOnly(false);
                  setSearchQuery('');
                }}
              >
                Tozalash
              </button>
            </div>

            {/* Toifalar filtri */}
            <div className="filter-group">
              <h5 className="filter-group-title">Toifalar</h5>
              <div className="filter-categories-radio">
                {CATEGORIES.map((cat) => (
                  <label key={cat.id} className="custom-radio-row">
                    <input
                      type="radio"
                      name="catalogCategory"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                    />
                    <span className="radio-label">{cat.name}</span>
                    <span className="cat-counter">({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Narx diapazoni */}
            <div className="filter-group">
              <h5 className="filter-group-title">Narx diapazoni (so'm)</h5>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Dan"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                />
                <span className="price-dash">—</span>
                <input
                  type="number"
                  placeholder="Gacha"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                />
              </div>
              <input
                type="range"
                min="0"
                max="3000000"
                step="50000"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="price-range-slider"
              />
            </div>

            {/* Omborda mavjudligi */}
            <div className="filter-group">
              <label className="custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>Faqat omborda mavjudlarini ko'rsatish</span>
              </label>
            </div>

            {/* Usta yordami banneri */}
            <div className="sidebar-banner">
              <h5>Mutaxassis yordami kerakmi?</h5>
              <p>Chizma yoki xonangiz hajmini yuboring, barcha materiallarni bepul hisoblab beramiz.</p>
              <button className="btn-secondary full-width btn-sm" onClick={() => setIsConsultOpen(true)}>
                Konsultatsiya olish
              </button>
            </div>
          </aside>

          {/* O'ng tomon - Mahsulotlar to'plami */}
          <section className="products-container">
            {filteredProducts.length === 0 ? (
              <div className="no-products-box">
                <div className="no-prod-icon">🔍</div>
                <h3>Hech narsa topilmadi</h3>
                <p>Qidiruv so'zini yoki o'rnatilgan filtrlarni o'zgartirib ko'ring.</p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange({ min: 0, max: 3000000 });
                    setSearchQuery('');
                  }}
                >
                  Barcha filtrlarni bekor qilish
                </button>
              </div>
            ) : (
              <div className={`products-grid-wrapper ${viewMode === 'list' ? 'list-layout' : 'grid-layout'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    isFavorite={favorites.includes(product.id)}
                    isCompared={comparisonList.some((p) => p.id === product.id)}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleCompare={handleToggleCompare}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 7. ULURJI VA HAMKORLIK BANNERI */}
      <section className="wholesale-banner-section">
        <div className="container">
          <div className="wholesale-card">
            <div className="wholesale-info">
              <span className="wholesale-tag">Quruvchilar va Tashkilotlar diqqatiga</span>
              <h3>Katta Obyektlar Uchun Ulgurji Shartnoma</h3>
              <p>
                Biz to'g'ridan-to'g'ri ishlab chiqaruvchi narxlarida, kechiktirib to'lash (nasiya) va
                QQS bilan hisob-faktura taqdim etamiz. Ob'ektingizga doimiy yetkazib berish kafolatlanadi.
              </p>
              <div className="wholesale-contacts">
                <button className="btn-primary" onClick={() => setIsConsultOpen(true)}>
                  Tijoriy Taklif Olish
                </button>
                <a href="tel:+998712005500" className="wholesale-tel">
                  <Icons.Phone /> +998 (71) 200-55-00 (Ichki: 104)
                </a>
              </div>
            </div>
            <div className="wholesale-stats">
              <div className="stat-item">
                <strong>500+</strong>
                <span>Yirik ob'ektlar ta'minlangan</span>
              </div>
              <div className="stat-item">
                <strong>15 000 t</strong>
                <span>Oylik aylanma yuk</span>
              </div>
              <div className="stat-item">
                <strong>100%</strong>
                <span>Sertifikatlangan tovarlar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. KO'P BERILADIGAN SAVOLLAR (FAQ) */}
      <section className="faq-section">
        <div className="container faq-container">
          <div className="faq-title-wrap">
            <span className="section-subtitle">Ko'p beriladigan savollar</span>
            <h2>Qurilish mollari xaridi bo'yicha ma'lumotlar</h2>
          </div>

          <div className="faq-accordion">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className={`faq-card ${activeFaq === index ? 'open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <span>{item.question}</span>
                  <span className="faq-toggle-icon">
                    <Icons.ChevronDown />
                  </span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. ASOSIY FOOTER */}
      <footer className="ninja-footer">
        <div className="container footer-top">
          <div className="footer-col brand-info">
            <div className="brand-logo footer-logo">
              <span className="ninja-helmet">⚔️</span>
              <h2 className="brand-name">NINJA<span>Stroy</span></h2>
            </div>
            <p className="footer-about">
              NINJAStroy - O'zbekistonning eng ishonchli qurilish mollari gipermarketi. Sifatli materiallar, qulay narxlar va professional logistika.
            </p>
            <div className="social-links">
              <a href="#telegram" className="social-icon" title="Telegram">✈️</a>
              <a href="#instagram" className="social-icon" title="Instagram">📷</a>
              <a href="#facebook" className="social-icon" title="Facebook">🌐</a>
              <a href="#youtube" className="social-icon" title="YouTube">▶️</a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Tezkor Havolalar</h5>
            <ul className="footer-links">
              <li><a href="#about">Biz haqimizda</a></li>
              <li><a href="#catalog">Tovarlar katalogi</a></li>
              <li><a href="#delivery">Yetkazib berish shartlari</a></li>
              <li><a href="#wholesale">Ulgurji xaridorlarga</a></li>
              <li><a href="#calculator">Smeta kalkulyatori</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Kategoriyalar</h5>
            <ul className="footer-links">
              <li><a href="#cement" onClick={() => setSelectedCategory('cement')}>Sement va qorishmalar</a></li>
              <li><a href="#drywall" onClick={() => setSelectedCategory('drywall')}>Knauf gipsokarton</a></li>
              <li><a href="#metal" onClick={() => setSelectedCategory('metal')}>Armatura va metall</a></li>
              <li><a href="#bricks" onClick={() => setSelectedCategory('bricks')}>Pishgan g'isht va bloklar</a></li>
              <li><a href="#paint" onClick={() => setSelectedCategory('paint')}>Fasad va ichki bo'yoqlar</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Aloqa va Manzil</h5>
            <div className="contact-entry">
              <Icons.MapPin />
              <span>Toshkent sh., Sergeli tumani, Yangi Sergeli ko'chasi 45-uy</span>
            </div>
            <div className="contact-entry">
              <Icons.Phone />
              <span>+998 (71) 200-55-00 (Ko'p tarmoqli)</span>
            </div>
            <div className="working-hours">
              <p>Ish vaqti: Har kuni 08:00 dan 20:00 gacha (Dam olish kunlarisiz)</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>© 2026 NINJAStroy. Barcha huquqlar himoyalangan.</p>
            <div className="payment-badges">
              <span className="pay-tag">Uzum Nasiya</span>
              <span className="pay-tag">Payme</span>
              <span className="pay-tag">Click</span>
              <span className="pay-tag">Naqd / Perechisleniye</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALLAR VA DRAWERLAR (SLIDE-OVER VA POPUPLAR)
          ========================================================================= */}

      {/* A. SAVATCHA YON PANELI (CART DRAWER) */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-box">
                <Icons.ShoppingCart />
                <h3>Savatchangiz</h3>
                <span className="drawer-counter">{cart.length} ta mahsulot</span>
              </div>
              <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>
                <Icons.X />
              </button>
            </div>

            {/* Bepul yetkazish indikatori */}
            <div className="free-shipping-progress">
              {cartSubtotal >= 2000000 ? (
                <div className="shipping-achieved">
                  <Icons.Check /> Tabriklaymiz! Siz uchun ob'ektga yetkazish bepul!
                </div>
              ) : (
                <>
                  <div className="shipping-text">
                    Yana <strong>{(2000000 - cartSubtotal).toLocaleString()} so'm</strong>lik xarid qiling va bepul yetkazib berishga ega bo'ling!
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.min(100, (cartSubtotal / 2000000) * 100)}%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>

            {/* Savatdagi tovarlar ro'yxati */}
            <div className="drawer-body">
              {cart.length === 0 ? (
                <div className="empty-cart-state">
                  <div className="empty-cart-icon">🛒</div>
                  <h4>Savatchangiz hozircha bo'sh</h4>
                  <p>Katalogimizdan kerakli qurilish mollarini tanlang va bu yerga qo'shing.</p>
                  <button
                    className="btn-primary"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Xaridni boshlash
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      <img src={item.image} alt={item.title} className="cart-item-thumb" />
                      <div className="cart-item-info">
                        <h5 className="cart-item-name">{item.title}</h5>
                        <div className="cart-item-price-unit">
                          {item.price.toLocaleString()} so'm / {item.unit}
                        </div>
                        <div className="cart-qty-controls">
                          <button
                            className="qty-btn"
                            onClick={() => handleUpdateCartQty(item.id, -1)}
                          >
                            <Icons.Minus />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => handleUpdateCartQty(item.id, 1)}
                          >
                            <Icons.Plus />
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-end">
                        <span className="cart-item-subtotal">{(item.price * item.quantity).toLocaleString()} so'm</span>
                        <button
                          className="cart-item-delete"
                          onClick={() => handleRemoveFromCart(item.id)}
                          title="O'chirish"
                        >
                          <Icons.Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Savatning quyi qismi (Promokod va Buyurtma tugmasi) */}
            {cart.length > 0 && (
              <div className="drawer-footer">
                {/* Promokod kiritish formasi */}
                <form className="promo-form" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    placeholder="Promokod (masalan: NINJA2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button type="submit" className="btn-secondary btn-sm">Qo'llash</button>
                </form>
                {promoMessage && (
                  <p className={`promo-alert ${promoMessage.type}`}>{promoMessage.text}</p>
                )}

                {/* Hisob-kitob tafsilotlari */}
                <div className="summary-lines">
                  <div className="summary-row">
                    <span>Mahsulotlar summasi:</span>
                    <span>{cartSubtotal.toLocaleString()} so'm</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="summary-row discount">
                      <span>Chegirma ({discountPercent}%):</span>
                      <span>-{cartDiscountAmount.toLocaleString()} so'm</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Yetkazib berish (Toshkent):</span>
                    <span>{deliveryCost === 0 ? <strong className="text-green">Bepul</strong> : `${deliveryCost.toLocaleString()} so'm`}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Jami to'lov:</span>
                    <span className="grand-total">{cartGrandTotal.toLocaleString()} so'm</span>
                  </div>
                </div>

                <button
                  className="btn-primary full-width checkout-btn"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Buyurtmani Rasmiylashtirish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* B. TEZKOR KO'RISH MODAL OYNASI (QUICK VIEW) */}
      {quickViewProduct && (
        <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quickview-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={() => setQuickViewProduct(null)}>
              <Icons.X />
            </button>
            <div className="quickview-grid">
              <div className="quickview-media">
                <img src={quickViewProduct.image} alt={quickViewProduct.title} />
                <span className="qv-badge">{quickViewProduct.badge}</span>
              </div>
              <div className="quickview-details">
                <div className="qv-brand-sku">
                  <span className="qv-brand">{quickViewProduct.brand}</span>
                  <span className="qv-sku">Artikul: {quickViewProduct.sku}</span>
                </div>
                <h3 className="qv-title">{quickViewProduct.title}</h3>
                <div className="qv-rating">
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Icons.Star key={i} filled={i < Math.floor(quickViewProduct.rating)} />
                    ))}
                  </div>
                  <span className="rating-num">{quickViewProduct.rating}</span>
                  <span className="reviews-cnt">({quickViewProduct.reviewsCount} ta sharh)</span>
                </div>
                <div className="qv-price-box">
                  <span className="qv-current-price">{quickViewProduct.price.toLocaleString()} so'm</span>
                  {quickViewProduct.oldPrice && (
                    <span className="qv-old-price">{quickViewProduct.oldPrice.toLocaleString()} so'm</span>
                  )}
                  <span className="qv-unit">/ {quickViewProduct.unit}</span>
                </div>
                <p className="qv-description">{quickViewProduct.description}</p>

                {/* Xususiyatlar jadvali */}
                <div className="qv-specs-table">
                  <h5>Texnik xususiyatlari:</h5>
                  {Object.entries(quickViewProduct.specs || {}).map(([key, val]) => (
                    <div key={key} className="spec-row">
                      <span className="spec-name">{key.replace('_', ' ')}:</span>
                      <span className="spec-val">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="qv-actions">
                  <button
                    className="btn-primary qv-add-btn"
                    onClick={() => {
                      handleAddToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                  >
                    <Icons.ShoppingCart /> Savatga Qo'shish
                  </button>
                  <button
                    className={`btn-secondary icon-only ${favorites.includes(quickViewProduct.id) ? 'active' : ''}`}
                    onClick={() => handleToggleFavorite(quickViewProduct)}
                  >
                    <Icons.Heart filled={favorites.includes(quickViewProduct.id)} />
                  </button>
                  <button
                    className="btn-secondary icon-only"
                    onClick={() => handleToggleCompare(quickViewProduct)}
                  >
                    <Icons.GitCompare />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. BUYURTMANI RASMIYLASHTIRISH MODALI (CHECKOUT MODAL) */}
      {isCheckoutOpen && (
        <div className="modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
          <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Buyurtmani Rasmiylashtirish</h3>
              <button className="modal-close-icon" onClick={() => setIsCheckoutOpen(false)}>
                <Icons.X />
              </button>
            </div>
            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>To'liq ism-familiyangiz *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Sardor Rahimov"
                    value={checkoutForm.fullName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Telefon raqamingiz *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Yetkazib berish manzili (Tuman, ko'cha, uy/ob'ekt) *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Chilonzor tumani, 19-mavze, 2-uy qurilish ob'ekti"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Yetkazib berish turi</label>
                  <select
                    value={checkoutForm.deliveryType}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, deliveryType: e.target.value })}
                  >
                    <option value="standard">Standart yuk yetkazish (Bugun yoki ertaga)</option>
                    <option value="express">Tezkor Express (2 soat ichida)</option>
                    <option value="pickup">Ombordan o'zi olib ketish (Samovivoz)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>To'lov usuli</label>
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                  >
                    <option value="cash">Yukni qabul qilib olganda naqd</option>
                    <option value="click">Click / Payme orqali onlayn</option>
                    <option value="invoice">Yuridik shaxs hisob-faktura (Didox)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Qo'shimcha izoh yoki kran/manipulyator kerakligi:</label>
                <textarea
                  rows="2"
                  placeholder="Kran kerak, tor ko'cha yoki kirish qoidalari haqida ma'lumot..."
                  value={checkoutForm.comment}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, comment: e.target.value })}
                ></textarea>
              </div>

              <div className="checkout-summary-box">
                <div className="total-label">To'lanadigan yakuniy summa:</div>
                <div className="total-amount">{cartGrandTotal.toLocaleString()} so'm</div>
              </div>

              <div className="modal-footer-btns">
                <button type="button" className="btn-secondary" onClick={() => setIsCheckoutOpen(false)}>
                  Orqaga
                </button>
                <button type="submit" className="btn-primary">
                  Buyurtmani Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. USTALAR VA KONSULTATSIYA MODALI */}
      {isConsultOpen && (
        <div className="modal-backdrop" onClick={() => setIsConsultOpen(false)}>
          <div className="consult-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👷 Professional Muhandis Maslahati</h3>
              <button className="modal-close-icon" onClick={() => setIsConsultOpen(false)}>
                <Icons.X />
              </button>
            </div>
            <p className="consult-intro">
              Telefon raqamingizni qoldiring. Tajribali muhandisimiz ob'ektingiz bo'yicha to'liq smeta tuzib,
              ortiqcha xarajatlarsiz material hisoblab beradi.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Murojaatingiz qabul qilindi! Mutaxassis tez orada qo'ng'iroq qiladi.", 'success');
                setIsConsultOpen(false);
              }}
              className="consult-form"
            >
              <div className="form-group">
                <label>Ismingiz:</label>
                <input type="text" required placeholder="Ali Valiyev" />
              </div>
              <div className="form-group">
                <label>Telefon raqam:</label>
                <input type="tel" required placeholder="+998 90 123 45 67" />
              </div>
              <div className="form-group">
                <label>Ob'ekt turi va qanday mahsulotlar kerak:</label>
                <textarea rows="3" placeholder="Masalan: 2 qavatli hovli uchun poydevor va g'isht kerak..."></textarea>
              </div>
              <button type="submit" className="btn-primary full-width">
                Bepul Hisoblatish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* E. TAQQOSLASH MODALI (COMPARE MODAL) */}
      {isCompareOpen && (
        <div className="modal-backdrop" onClick={() => setIsCompareOpen(false)}>
          <div className="compare-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="drawer-title-box">
                <Icons.GitCompare />
                <h3>Mahsulotlarni Taqqoslash</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setIsCompareOpen(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="compare-body">
              {comparisonList.length === 0 ? (
                <div className="empty-compare">
                  <p>Taqqoslash uchun katalogdan kamida 2 ta mahsulot tanlang.</p>
                </div>
              ) : (
                <div className="compare-table-responsive">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>Xususiyat</th>
                        {comparisonList.map((item) => (
                          <th key={item.id}>
                            <div className="compare-head-item">
                              <img src={item.image} alt={item.title} />
                              <h5>{item.title}</h5>
                              <div className="compare-price">{item.price.toLocaleString()} so'm</div>
                              <button
                                className="remove-compare-btn"
                                onClick={() => handleToggleCompare(item)}
                              >
                                O'chirish
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ishlab chiqaruvchi / Brend</td>
                        {comparisonList.map((item) => (
                          <td key={item.id}>{item.brand}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>Reyting</td>
                        {comparisonList.map((item) => (
                          <td key={item.id}>⭐ {item.rating} ({item.reviewsCount} sharh)</td>
                        ))}
                      </tr>
                      <tr>
                        <td>O'lchov birligi</td>
                        {comparisonList.map((item) => (
                          <td key={item.id}>{item.unit}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>Holati</td>
                        {comparisonList.map((item) => (
                          <td key={item.id}>
                            {item.inStock ? <span className="text-green">Omborda bor</span> : 'Buyurtmaga'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Amal</td>
                        {comparisonList.map((item) => (
                          <td key={item.id}>
                            <button
                              className="btn-primary btn-sm full-width"
                              onClick={() => handleAddToCart(item)}
                            >
                              Savatga
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* F. SEVIMLILAR RO'YXATI MODALI */}
      {isFavoritesOpen && (
        <div className="drawer-overlay" onClick={() => setIsFavoritesOpen(false)}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-box">
                <Icons.Heart filled />
                <h3>Sevimlilar Ro'yxati</h3>
                <span className="drawer-counter">{favorites.length} ta</span>
              </div>
              <button className="close-drawer-btn" onClick={() => setIsFavoritesOpen(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="drawer-body">
              {favorites.length === 0 ? (
                <div className="empty-cart-state">
                  <div className="empty-cart-icon">🤍</div>
                  <h4>Sevimlilar ro'yxati bo'sh</h4>
                  <p>Sizga yoqqan tovarlarni yurakcha belgisini bosib bu yerga saqlashingiz mumkin.</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {products
                    .filter((p) => favorites.includes(p.id))
                    .map((item) => (
                      <div key={item.id} className="cart-item-row">
                        <img src={item.image} alt={item.title} className="cart-item-thumb" />
                        <div className="cart-item-info">
                          <h5 className="cart-item-name">{item.title}</h5>
                          <div className="cart-item-price-unit">{item.price.toLocaleString()} so'm</div>
                          <button
                            className="btn-primary btn-sm mt-1"
                            onClick={() => handleAddToCart(item)}
                          >
                            Savatga qo'shish
                          </button>
                        </div>
                        <button
                          className="cart-item-delete"
                          onClick={() => handleToggleFavorite(item)}
                          title="O'chirish"
                        >
                          <Icons.Trash2 />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* G. TOAST BILDIRISHNOMALARI TIZIMI */}
      <div className="toast-notifications-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card toast-${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' && '✓'}
              {t.type === 'error' && '✕'}
              {t.type === 'info' && 'ℹ'}
            </span>
            <span className="toast-msg">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
