"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe,
  Shield as UserShield,
  Zap,
  ArrowRight,
  Lock,
  Gauge,
  UserSearch as UserSecret,
  Monitor,
  ShieldCheck,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import { useRef } from "react"
import LoadingScreen from "../components/LoadingScreen"
import LanguageSwitcher from "../components/LanguageSwitcher"
import { useLanguage } from "../contexts/LanguageContext"
import Image from "next/image"
import DistortedText from "../components/DistortedText"
import ParticleField from "../components/ParticleField"
import SpeedTest from "../components/SpeedTest"
import PricingSection from "../components/PricingSection"
import TestimonialsSection from "../components/TestimonialsSection"

const DistortionCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 150,
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener("mousemove", handleMouseMove)

    const text = "IJAXT VPN"
    const particles: Array<{
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
    }> = []

    const setupText = () => {
      particles.length = 0
      const textCanvas = document.createElement("canvas")
      const textCtx = textCanvas.getContext("2d")
      if (!textCtx) return

      const dpr = window.devicePixelRatio || 1
      const textWidth = 600
      const textHeight = 300
      textCanvas.width = textWidth * dpr
      textCanvas.height = textHeight * dpr
      textCtx.scale(dpr, dpr)

      textCtx.fillStyle = "rgba(255, 255, 255, 0.5)"
      textCtx.font = 'bold 120px "Inter", Arial, sans-serif'
      textCtx.textAlign = "center"
      textCtx.textBaseline = "middle"
      textCtx.fillText(text, textWidth / 2, textHeight / 2)

      const textData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height).data

      for (let y = 0; y < textCanvas.height; y += 4 * dpr) {
        for (let x = 0; x < textCanvas.width; x += 4 * dpr) {
          const alpha = textData[(y * textCanvas.width + x) * 4 + 3]
          if (alpha > 128) {
            particles.push({
              x: x / dpr,
              y: y / dpr,
              size: Math.random() * 1.5 + 1,
              baseX: x / dpr,
              baseY: y / dpr,
              density: Math.random() * 10 + 5,
              color: `hsl(${250 + Math.random() * 60}, 100%, 70%)`,
            })
          }
        }
      }
    }

    setupText()

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scaleX = canvas.width / 600
      const scaleY = canvas.height / 300
      const scale = Math.min(scaleX, scaleY) * 1.5

      const offsetX = (canvas.width - 600 * scale) / 2
      const offsetY = (canvas.height - 300 * scale) / 2

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = p.color
        ctx.fill()

        const mouseXInCanvas = (mouse.x - offsetX) / scale
        const mouseYInCanvas = (mouse.y - offsetY) / scale

        const dx = mouseXInCanvas - p.x
        const dy = mouseYInCanvas - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxDistance = mouse.radius / scale
        const force = (maxDistance - distance) / maxDistance
        const directionX = forceDirectionX * force * p.density
        const directionY = forceDirectionY * force * p.density

        if (distance < maxDistance) {
          p.x -= directionX
          p.y -= directionY
        } else {
          if (p.x !== p.baseX) {
            const dxReturn = p.x - p.baseX
            p.x -= dxReturn / 10
          }
          if (p.y !== p.baseY) {
            const dyReturn = p.y - p.baseY
            p.y -= dyReturn / 10
          }
        }
      }
      ctx.restore()
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full opacity-30" />
}

const Header = () => {
  const { t } = useLanguage()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex justify-between items-center bg-slate-950/50 backdrop-blur-lg rounded-full p-2 px-4 sm:px-6 border border-white/10">
          <a href="#" className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3 text-slate-50">
            <Image
              src="/images/logo.png"
              alt="Ijaxt VPN Logo"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10 rounded-full"
            />
            <span className="hidden sm:inline">Ijaxt VPN</span>
            <span className="sm:hidden">Ijaxt</span>
          </a>

          <div className="hidden lg:flex gap-6 xl:gap-8 text-sm">
            <a href="#" className="text-slate-400 hover:text-slate-50 transition-colors">
              {t("nav.home")}
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-50 transition-colors">
              {t("nav.features")}
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-50 transition-colors">
              {t("nav.pricing")}
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-50 transition-colors">
              {t("nav.about")}
            </a>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <a
              href="#"
              className="hidden sm:inline text-sm text-slate-400 hover:text-slate-50 transition-colors px-2 sm:px-4 py-2"
            >
              {t("nav.login")}
            </a>
            <a
              href="#"
              className="px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-purple-600/20 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">{t("nav.signup")}</span>
              <span className="sm:hidden">Join</span>
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

const Hero = () => {
  const { t } = useLanguage()

  const StatItem = ({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) => (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="text-cyan-400 text-2xl sm:text-3xl">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold text-slate-50">{number}</span>
        <span className="text-xs sm:text-sm text-slate-400">{label}</span>
      </div>
    </div>
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-24 sm:pt-32 pb-12 sm:pb-16">
      <div className="absolute inset-0 z-0">
        <DistortionCanvas />
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <DistortedText
            text={t("hero.title")}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight text-slate-50"
            glowColor="#8A2BE2"
          />
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <a
              href="#"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {t("hero.cta.primary")} <ArrowRight size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold border-2 border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-slate-950 transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base"
            >
              {t("hero.cta.secondary")}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 max-w-4xl mx-auto bg-white/5 p-6 sm:p-8 rounded-2xl backdrop-blur-lg border border-white/10"
        >
          <StatItem icon={<Globe />} number="750+" label={t("hero.stats.servers")} />
          <StatItem icon={<UserShield />} number="2M+" label={t("hero.stats.users")} />
          <StatItem icon={<Zap />} number="99.9%" label={t("hero.stats.uptime")} />
        </motion.div>
      </div>
    </section>
  )
}

const Features = () => {
  const { t } = useLanguage()

  const featureData = [
    {
      icon: <Lock />,
      title: t("features.encryption.title"),
      description: t("features.encryption.desc"),
    },
    {
      icon: <Gauge />,
      title: t("features.speed.title"),
      description: t("features.speed.desc"),
    },
    {
      icon: <Globe />,
      title: t("features.access.title"),
      description: t("features.access.desc"),
    },
    {
      icon: <UserSecret />,
      title: t("features.privacy.title"),
      description: t("features.privacy.desc"),
    },
    {
      icon: <Monitor />,
      title: t("features.devices.title"),
      description: t("features.devices.desc"),
    },
    {
      icon: <ShieldCheck />,
      title: t("features.killswitch.title"),
      description: t("features.killswitch.desc"),
    },
  ]

  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  }

  const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <motion.div
      variants={cardVariants}
      className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-purple-600 hover:-translate-y-2 group"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-purple-600 flex items-center justify-center mb-4 sm:mb-6 text-white text-2xl sm:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-50">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{description}</p>
    </motion.div>
  )

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-slate-50">{t("features.title")}</h2>
          <p className="text-base sm:text-lg text-slate-400">{t("features.subtitle")}</p>
        </motion.div>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featureData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-white/10 py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 text-center text-slate-400">
        <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <a href="#" className="hover:text-purple-600 transition-colors p-2">
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="hover:text-purple-600 transition-colors p-2">
            <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="hover:text-purple-600 transition-colors p-2">
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>

        <div className="flex justify-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
          <a href="#" className="hover:text-slate-50 transition-colors">
            {t("footer.features")}
          </a>
          <a href="#" className="hover:text-slate-50 transition-colors">
            {t("footer.pricing")}
          </a>
          <a href="#" className="hover:text-slate-50 transition-colors">
            {t("footer.privacy")}
          </a>
          <a href="#" className="hover:text-slate-50 transition-colors">
            {t("footer.terms")}
          </a>
          <a href="#" className="hover:text-slate-50 transition-colors">
            {t("footer.contact")}
          </a>
        </div>
        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} Ijaxt VPN. {t("footer.copyright")}
        </p>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 4500) // 4.5 saat

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Aurora background effect */}
      <div className="fixed top-0 left-0 w-full h-screen z-[-1] bg-gradient-radial from-purple-600/30 via-transparent to-transparent" />

      {/* Particle field for enhanced visual effects */}
      <ParticleField />

      {/* Skrin Pemuatan akan hilang dengan animasi apabila isLoading menjadi false */}
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {/* Kandungan Laman Web Utama */}
      {/* Ia akan muncul dengan animasi selepas skrin pemuatan hilang */}
      {!isLoading && (
        <motion.div
          className="bg-slate-950 text-slate-50 min-h-screen relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header />
          <main>
            <Hero />
            <Features />
            <SpeedTest />
            <TestimonialsSection />
            <PricingSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  )
}
