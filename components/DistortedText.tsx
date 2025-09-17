"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface DistortedTextProps {
  text: string
  className?: string
  glowColor?: string
}

const DistortedText = ({ text, className = "", glowColor = "#8A2BE2" }: DistortedTextProps) => {
  const textRef = useRef<HTMLHeadingElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const textElement = textRef.current
    if (!textElement) return

    const originalText = text
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let interval: NodeJS.Timeout

    const handleMouseEnter = () => {
      setIsHovering(true)
      let iteration = 0

      // Flash effect
      const flash = document.createElement("div")
      flash.className = "fixed inset-0 pointer-events-none z-50"
      flash.style.background = `rgba(138, 43, 226, 0.1)`
      flash.style.animation = "flash 0.3s ease-out"
      document.body.appendChild(flash)

      setTimeout(() => {
        flash.remove()
      }, 300)

      interval = setInterval(() => {
        if (textElement) {
          textElement.textContent = originalText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return originalText[index]
              }
              if (letter === " ") return " "
              return letters[Math.floor(Math.random() * letters.length)]
            })
            .join("")

          if (iteration >= originalText.length) {
            clearInterval(interval)
            textElement.textContent = originalText
          }

          iteration += 0.3
        }
      }, 50)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      clearInterval(interval)
      if (textElement) {
        textElement.textContent = originalText
      }
    }

    textElement.addEventListener("mouseenter", handleMouseEnter)
    textElement.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      textElement.removeEventListener("mouseenter", handleMouseEnter)
      textElement.removeEventListener("mouseleave", handleMouseLeave)
      clearInterval(interval)
    }
  }, [text])

  return (
    <>
      <style jsx global>{`
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            text-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor};
          }
          50% { 
            text-shadow: 0 0 20px ${glowColor}, 0 0 30px ${glowColor}, 0 0 40px ${glowColor};
          }
        }
        
        .distorted-text {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .distorted-text:hover {
          animation: glow-pulse 0.6s ease-in-out;
          transform: scale(1.02);
        }
        
        .distorted-text::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, ${glowColor}20 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .distorted-text:hover::before {
          opacity: 1;
        }
      `}</style>

      <motion.h1
        ref={textRef}
        className={`distorted-text ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {text}
      </motion.h1>
    </>
  )
}

export default DistortedText
