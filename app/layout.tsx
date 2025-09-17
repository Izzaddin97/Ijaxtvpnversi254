import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "../contexts/LanguageContext"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ijaxt VPN - Premium Digital Security",
  description:
    "Protect your privacy with military-grade encryption, lightning-fast speeds, and unlimited global access.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageProvider>{children}</LanguageProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
