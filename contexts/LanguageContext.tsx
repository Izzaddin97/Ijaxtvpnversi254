"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ms"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.about": "About",
    "nav.login": "Sign In",
    "nav.signup": "Get Started",

    // Hero Section
    "hero.title": "Uncompromising Digital Security",
    "hero.subtitle":
      "Protect your privacy with military-grade encryption, lightning-fast speeds, and unlimited access to the entire world. Welcome to Ijaxt VPN.",
    "hero.cta.primary": "Start Now",
    "hero.cta.secondary": "View Pricing",
    "hero.stats.servers": "Global Servers",
    "hero.stats.users": "Protected Users",
    "hero.stats.uptime": "Uptime Guarantee",

    // Features Section
    "features.title": "Engineered for Security & Speed",
    "features.subtitle": "Explore advanced features that make Ijaxt VPN the digital shield you need.",
    "features.encryption.title": "Military-Grade Encryption",
    "features.encryption.desc":
      "Your data is protected by AES-256, the gold standard in encryption trusted by global security experts.",
    "features.speed.title": "Exceptional Performance",
    "features.speed.desc":
      "Experience seamless streaming, downloads, and gaming with zero lag on our optimized 10Gbps servers.",
    "features.access.title": "Borderless Access",
    "features.access.desc": "Unlock global content effortlessly. Our network spans 750+ servers across 60+ countries.",
    "features.privacy.title": "Strict Privacy Policy",
    "features.privacy.desc": "We maintain a rigorous no-logs policy. Your online activity is your business, not ours.",
    "features.devices.title": "One Account, All Devices",
    "features.devices.desc": "Protect Windows, Mac, iOS, Android, and more with a single Ijaxt VPN subscription.",
    "features.killswitch.title": "Automatic Kill Switch",
    "features.killswitch.desc":
      "Your security is guaranteed even if connection drops, preventing any unintended data leaks.",

    // Footer
    "footer.features": "Features",
    "footer.pricing": "Pricing",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
    "footer.copyright": "All rights reserved.",

    // Loading Screen
    "loading.securing": "Securing Your Connection...",
    "loading.encrypting": "Encrypting Data Pathways...",
    "loading.checking": "Checking Global Network...",
    "loading.activating": "Activating Privacy Shield...",
    "loading.ready": "Almost Ready...",

    // Speed Test Section
    "speedtest.title": "Internet Speed Test",
    "speedtest.subtitle": "Test your connection speed with our secure VPN servers",
    "speedtest.selectServer": "Select Server",
    "speedtest.connected": "Connected to VPN",
    "speedtest.disconnected": "Not Connected",
    "speedtest.connecting": "Connecting to VPN Server...",
    "speedtest.connect": "Connect to VPN",
    "speedtest.start": "Start Speed Test",
    "speedtest.reset": "Reset",
    "speedtest.disconnect": "Disconnect",
    "speedtest.download": "Download",
    "speedtest.upload": "Upload",
    "speedtest.ping": "Ping",
    "speedtest.testing.ping": "Testing ping",
    "speedtest.testing.download": "Testing download",
    "speedtest.testing.upload": "Testing upload",
    "speedtest.testing.current": "Testing...",

    // Pricing Section
    "pricing.title": "Choose Your Plan",
    "pricing.subtitle": "Select the perfect plan for your security needs",
    "pricing.monthly": "Monthly",
    "pricing.annual": "Annual",
    "pricing.save": "Save 20%",
    "pricing.popular": "Most Popular",
    "pricing.getStarted": "Get Started",
    "pricing.guarantee": "30-Day Money Back Guarantee",
    "pricing.basic.name": "Basic",
    "pricing.basic.feature1": "1 Device Connection",
    "pricing.basic.feature2": "50+ Server Locations",
    "pricing.basic.feature3": "Standard Speed",
    "pricing.basic.feature4": "24/7 Support",
    "pricing.pro.name": "Professional",
    "pricing.pro.feature1": "5 Device Connections",
    "pricing.pro.feature2": "100+ Server Locations",
    "pricing.pro.feature3": "High Speed Priority",
    "pricing.pro.feature4": "Ad Blocker Included",
    "pricing.pro.feature5": "Kill Switch Protection",
    "pricing.premium.name": "Premium",
    "pricing.premium.feature1": "Unlimited Devices",
    "pricing.premium.feature2": "200+ Server Locations",
    "pricing.premium.feature3": "Maximum Speed",
    "pricing.premium.feature4": "Advanced Security",
    "pricing.premium.feature5": "Dedicated IP Option",
    "pricing.premium.feature6": "Priority Support",

    // Testimonials Section
    "testimonials.title": "What Our Users Say",
    "testimonials.subtitle": "Join millions of satisfied users who trust Ijaxt VPN for their digital security",
    "testimonials.testimonial1.role": "Digital Marketing Manager",
    "testimonials.testimonial1.content":
      "Ijaxt VPN has been a game-changer for my remote work. The connection is stable, fast, and I feel completely secure accessing company resources from anywhere in the world.",
    "testimonials.testimonial2.role": "Software Developer",
    "testimonials.testimonial2.content":
      "As a developer, I need reliable and fast internet access to various global services. Ijaxt VPN delivers exceptional performance without compromising on security.",
    "testimonials.testimonial3.role": "Content Creator",
    "testimonials.testimonial3.content":
      "The streaming quality is fantastic! I can access content from different regions seamlessly, and the customer support team is incredibly responsive and helpful.",
  },
  ms: {
    // Header
    "nav.home": "Utama",
    "nav.features": "Ciri-Ciri",
    "nav.pricing": "Harga",
    "nav.about": "Tentang Kami",
    "nav.login": "Log Masuk",
    "nav.signup": "Daftar Sekarang",

    // Hero Section
    "hero.title": "Keselamatan Digital Tanpa Kompromi",
    "hero.subtitle":
      "Lindungi privasi anda dengan penyulitan gred tentera, kelajuan sepantas kilat, dan akses tanpa had ke seluruh dunia. Selamat datang ke Ijaxt VPN.",
    "hero.cta.primary": "Mula Sekarang",
    "hero.cta.secondary": "Lihat Harga",
    "hero.stats.servers": "Pelayan Global",
    "hero.stats.users": "Pengguna Dilindungi",
    "hero.stats.uptime": "Jaminan Masa Operasi",

    // Features Section
    "features.title": "Direka Untuk Keselamatan & Prestasi",
    "features.subtitle": "Terokai ciri-ciri canggih yang menjadikan Ijaxt VPN perisai digital yang anda perlukan.",
    "features.encryption.title": "Penyulitan Gred Tentera",
    "features.encryption.desc":
      "Data anda dilindungi oleh AES-256, standard emas dalam penyulitan yang dipercayai oleh pakar keselamatan global.",
    "features.speed.title": "Prestasi Luar Biasa",
    "features.speed.desc":
      "Nikmati penstriman, muat turun, dan permainan tanpa gangguan dengan pelayan 10Gbps kami yang dioptimumkan.",
    "features.access.title": "Akses Tanpa Sempadan",
    "features.access.desc":
      "Buka kunci kandungan global dengan mudah. Rangkaian kami merangkumi 750+ pelayan di 60+ negara.",
    "features.privacy.title": "Dasar Privasi Ketat",
    "features.privacy.desc":
      "Kami mengekalkan dasar tiada log yang ketat. Aktiviti dalam talian anda adalah urusan peribadi anda.",
    "features.devices.title": "Satu Akaun, Semua Peranti",
    "features.devices.desc": "Lindungi Windows, Mac, iOS, Android, dan banyak lagi dengan satu langganan Ijaxt VPN.",
    "features.killswitch.title": "Suis Matikan Automatik",
    "features.killswitch.desc":
      "Keselamatan anda terjamin walaupun sambungan terputus, menghalang sebarang kebocoran data yang tidak diingini.",

    // Footer
    "footer.features": "Ciri-Ciri",
    "footer.pricing": "Harga",
    "footer.privacy": "Privasi",
    "footer.terms": "Syarat",
    "footer.contact": "Hubungi",
    "footer.copyright": "Semua hak cipta terpelihara.",

    // Loading Screen
    "loading.securing": "Mengamankan Sambungan Anda...",
    "loading.encrypting": "Menyulitkan Laluan Data...",
    "loading.checking": "Memeriksa Rangkaian Global...",
    "loading.activating": "Mengaktifkan Perisai Privasi...",
    "loading.ready": "Hampir Sedia...",

    // Speed Test Section
    "speedtest.title": "Ujian Kelajuan Internet",
    "speedtest.subtitle": "Uji kelajuan sambungan anda dengan pelayan VPN selamat kami",
    "speedtest.selectServer": "Pilih Pelayan",
    "speedtest.connected": "Disambungkan ke VPN",
    "speedtest.disconnected": "Tidak Disambungkan",
    "speedtest.connecting": "Menyambung ke Pelayan VPN...",
    "speedtest.connect": "Sambung ke VPN",
    "speedtest.start": "Mula Ujian Kelajuan",
    "speedtest.reset": "Set Semula",
    "speedtest.disconnect": "Putuskan Sambungan",
    "speedtest.download": "Muat Turun",
    "speedtest.upload": "Muat Naik",
    "speedtest.ping": "Ping",
    "speedtest.testing.ping": "Menguji ping",
    "speedtest.testing.download": "Menguji muat turun",
    "speedtest.testing.upload": "Menguji muat naik",
    "speedtest.testing.current": "Sedang Menguji...",

    // Pricing Section
    "pricing.title": "Pilih Pelan Anda",
    "pricing.subtitle": "Pilih pelan yang sempurna untuk keperluan keselamatan anda",
    "pricing.monthly": "Bulanan",
    "pricing.annual": "Tahunan",
    "pricing.save": "Jimat 20%",
    "pricing.popular": "Paling Popular",
    "pricing.getStarted": "Mula Sekarang",
    "pricing.guarantee": "Jaminan Wang Dikembalikan 30 Hari",
    "pricing.basic.name": "Asas",
    "pricing.basic.feature1": "1 Sambungan Peranti",
    "pricing.basic.feature2": "50+ Lokasi Pelayan",
    "pricing.basic.feature3": "Kelajuan Standard",
    "pricing.basic.feature4": "Sokongan 24/7",
    "pricing.pro.name": "Profesional",
    "pricing.pro.feature1": "5 Sambungan Peranti",
    "pricing.pro.feature2": "100+ Lokasi Pelayan",
    "pricing.pro.feature3": "Keutamaan Kelajuan Tinggi",
    "pricing.pro.feature4": "Penyekat Iklan Disertakan",
    "pricing.pro.feature5": "Perlindungan Suis Matikan",
    "pricing.premium.name": "Premium",
    "pricing.premium.feature1": "Peranti Tanpa Had",
    "pricing.premium.feature2": "200+ Lokasi Pelayan",
    "pricing.premium.feature3": "Kelajuan Maksimum",
    "pricing.premium.feature4": "Keselamatan Lanjutan",
    "pricing.premium.feature5": "Pilihan IP Khusus",
    "pricing.premium.feature6": "Sokongan Keutamaan",

    // Testimonials Section
    "testimonials.title": "Apa Kata Pengguna Kami",
    "testimonials.subtitle":
      "Sertai jutaan pengguna yang berpuas hati yang mempercayai Ijaxt VPN untuk keselamatan digital mereka",
    "testimonials.testimonial1.role": "Pengurus Pemasaran Digital",
    "testimonials.testimonial1.content":
      "Ijaxt VPN telah mengubah cara kerja jarak jauh saya. Sambungannya stabil, pantas, dan saya berasa selamat sepenuhnya mengakses sumber syarikat dari mana-mana sahaja di dunia.",
    "testimonials.testimonial2.role": "Pembangun Perisian",
    "testimonials.testimonial2.content":
      "Sebagai pembangun, saya memerlukan akses internet yang boleh dipercayai dan pantas ke pelbagai perkhidmatan global. Ijaxt VPN memberikan prestasi luar biasa tanpa menjejaskan keselamatan.",
    "testimonials.testimonial3.role": "Pencipta Kandungan",
    "testimonials.testimonial3.content":
      "Kualiti penstriman sangat fantastik! Saya boleh mengakses kandungan dari wilayah berbeza dengan lancar, dan pasukan sokongan pelanggan sangat responsif dan membantu.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ms")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // Update document language
    document.documentElement.lang = lang === "ms" ? "ms-MY" : "en"
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
