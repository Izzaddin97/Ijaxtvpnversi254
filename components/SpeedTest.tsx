"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, Download, Upload, Gauge, Play, Pause, RotateCcw, Server } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

interface SpeedTestResult {
  download: number
  upload: number
  ping: number
}

const SpeedTest = () => {
  const { t } = useLanguage()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)
  const [testProgress, setTestProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState<"ping" | "download" | "upload" | null>(null)
  const [results, setResults] = useState<SpeedTestResult | null>(null)
  const [selectedServer, setSelectedServer] = useState("Singapore")

  const servers = [
    { name: "Singapore", flag: "🇸🇬", ping: 12 },
    { name: "Japan", flag: "🇯🇵", ping: 25 },
    { name: "United States", flag: "🇺🇸", ping: 45 },
    { name: "Germany", flag: "🇩🇪", ping: 35 },
    { name: "Australia", flag: "🇦🇺", ping: 55 },
  ]

  const connectToVPN = async () => {
    setIsConnecting(true)
    setConnectionProgress(0)

    // Simulate connection progress
    const interval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsConnecting(false)
          setIsConnected(true)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
  }

  const startSpeedTest = async () => {
    if (!isConnected) {
      await connectToVPN()
      return
    }

    setIsTesting(true)
    setTestProgress(0)
    setResults(null)

    // Ping test
    setCurrentTest("ping")
    await simulateTest(1000, "ping")

    // Download test
    setCurrentTest("download")
    await simulateTest(3000, "download")

    // Upload test
    setCurrentTest("upload")
    await simulateTest(2000, "upload")

    // Generate realistic results
    const downloadSpeed = Math.random() * 80 + 120 // 120-200 Mbps
    const uploadSpeed = Math.random() * 40 + 60 // 60-100 Mbps
    const pingTime = Math.random() * 10 + 8 // 8-18 ms

    setResults({
      download: Math.round(downloadSpeed * 10) / 10,
      upload: Math.round(uploadSpeed * 10) / 10,
      ping: Math.round(pingTime * 10) / 10,
    })

    setIsTesting(false)
    setCurrentTest(null)
    setTestProgress(0)
  }

  const simulateTest = (duration: number, testType: string) => {
    return new Promise<void>((resolve) => {
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / duration) * 100, 100)
        setTestProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 50)
    })
  }

  const resetTest = () => {
    setResults(null)
    setTestProgress(0)
    setCurrentTest(null)
    setIsTesting(false)
  }

  const disconnectVPN = () => {
    setIsConnected(false)
    setConnectionProgress(0)
    resetTest()
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t("speedtest.title") || "Internet Speed Test"}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t("speedtest.subtitle") || "Test your connection speed with our secure VPN servers"}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-700/50"
          >
            <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <Server className="text-purple-400" />
              {t("speedtest.selectServer") || "Select Server"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {servers.map((server) => (
                <button
                  key={server.name}
                  onClick={() => setSelectedServer(server.name)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    selectedServer === server.name
                      ? "border-purple-500 bg-purple-500/20 text-purple-300"
                      : "border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div className="text-2xl mb-1">{server.flag}</div>
                  <div className="text-sm font-medium">{server.name}</div>
                  <div className="text-xs opacity-75">{server.ping}ms</div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
          >
            {/* Connection Status */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isConnected
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
                {isConnected
                  ? t("speedtest.connected") || "Connected to VPN"
                  : t("speedtest.disconnected") || "Not Connected"}
              </div>
            </div>

            <AnimatePresence>
              {isConnecting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                      {t("speedtest.connecting") || "Connecting to VPN Server..."}
                    </h3>
                    <div className="text-sm text-slate-400">
                      {selectedServer} • {Math.round(connectionProgress)}%
                    </div>
                  </div>
                  <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${connectionProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Speed Test Results Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Download Speed */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-green-400"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: results ? Math.min(results.download / 200, 1) : 0,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{
                        strokeDasharray: "251.2",
                        strokeDashoffset: "251.2",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Download className="text-green-400" size={20} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-200">{results ? `${results.download}` : "--"}</div>
                <div className="text-sm text-slate-400">{t("speedtest.download") || "Download"} (Mbps)</div>
              </div>

              {/* Upload Speed */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-blue-400"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: results ? Math.min(results.upload / 100, 1) : 0,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      style={{
                        strokeDasharray: "251.2",
                        strokeDashoffset: "251.2",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="text-blue-400" size={20} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-200">{results ? `${results.upload}` : "--"}</div>
                <div className="text-sm text-slate-400">{t("speedtest.upload") || "Upload"} (Mbps)</div>
              </div>

              {/* Ping */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-purple-400"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: results ? Math.max(0, 1 - results.ping / 50) : 0,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                      style={{
                        strokeDasharray: "251.2",
                        strokeDashoffset: "251.2",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi className="text-purple-400" size={20} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-200">{results ? `${results.ping}` : "--"}</div>
                <div className="text-sm text-slate-400">{t("speedtest.ping") || "Ping"} (ms)</div>
              </div>
            </div>

            <AnimatePresence>
              {isTesting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="text-center mb-3">
                    <div className="text-lg font-semibold text-slate-200 capitalize">
                      {t(`speedtest.testing.${currentTest}`) || `Testing ${currentTest}...`}
                    </div>
                  </div>
                  <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${testProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isConnected ? (
                <motion.button
                  onClick={connectToVPN}
                  disabled={isConnecting}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("speedtest.connecting") || "Connecting..."}
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      {t("speedtest.connect") || "Connect to VPN"}
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="flex gap-4">
                  <motion.button
                    onClick={startSpeedTest}
                    disabled={isTesting}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isTesting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("speedtest.testing.current") || "Testing..."}
                      </>
                    ) : (
                      <>
                        <Gauge size={20} />
                        {t("speedtest.start") || "Start Speed Test"}
                      </>
                    )}
                  </motion.button>

                  {results && (
                    <motion.button
                      onClick={resetTest}
                      className="px-6 py-4 bg-slate-700 text-slate-300 rounded-full font-semibold hover:bg-slate-600 transition-all duration-300 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw size={18} />
                      {t("speedtest.reset") || "Reset"}
                    </motion.button>
                  )}

                  <motion.button
                    onClick={disconnectVPN}
                    className="px-6 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pause size={18} />
                    {t("speedtest.disconnect") || "Disconnect"}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SpeedTest
