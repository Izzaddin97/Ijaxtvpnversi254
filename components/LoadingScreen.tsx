"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../contexts/LanguageContext"

const LoadingScreen = () => {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)

  const loadingTextKeys = [
    "loading.securing",
    "loading.encrypting",
    "loading.checking",
    "loading.activating",
    "loading.ready",
  ]

  // Kitaran untuk menukar teks setiap 2 saat
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingTextKeys.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [loadingTextKeys.length])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Kandungan di tengah */}
      <div className="text-center">
        {/* Video Loader */}
        <video className="w-48 h-48 mx-auto" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1757699793609-tPhV2ChU7XO8pqhXXWN35NCdEnIILb.mp4" autoPlay loop muted playsInline />

        {/* Teks Dinamik */}
        <div className="relative h-8 mt-4 overflow-hidden text-lg text-slate-400">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingTextKeys[index]}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {t(loadingTextKeys[index])}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bar Pemuatan (Loading Bar) */}
        <div className="w-48 h-1 mt-6 overflow-hidden bg-purple-600/20 rounded-full mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-cyan-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
