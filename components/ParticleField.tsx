"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const particles: Particle[] = []
    const maxParticles = 50

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const colors = ["#8A2BE2", "#00CED1", "#ADFF2F", "#FF69B4", "#00BFFF"]

    const createParticle = (x?: number, y?: number) => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle())
    }

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]

        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Fade out as particle ages
        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)

        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1)
          particles.push(createParticle()) // Replace with new particle
        }

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Create particles near mouse
      if (Math.random() < 0.3) {
        particles.push(createParticle(mouseX + (Math.random() - 0.5) * 50, mouseY + (Math.random() - 0.5) * 50))

        // Remove excess particles
        if (particles.length > maxParticles * 2) {
          particles.splice(0, particles.length - maxParticles)
        }
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ mixBlendMode: "screen" }} />
  )
}

export default ParticleField
