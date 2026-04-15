import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  opacityDir: number
  color: string
}

const COLORS = ["rgba(255,255,255,", "rgba(139,156,247,", "rgba(108,123,234,"]

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.6 + 0.4,
    opacity: Math.random() * 0.2 + 0.03,
    opacityDir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.002 + 0.001),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

export function ParticleField({ count = 70 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: -1000, y: -1000 })
  const raf = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + "px"
      canvas!.style.height = window.innerHeight + "px"
      ctx!.scale(dpr, dpr)
    }

    resize()
    particles.current = Array.from({ length: count }, () =>
      createParticle(window.innerWidth, window.innerHeight)
    )

    function handleMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    function animate() {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx!.clearRect(0, 0, w, h)

      for (const p of particles.current) {
        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Pulse opacity
        p.opacity += p.opacityDir
        if (p.opacity > 0.25) { p.opacity = 0.25; p.opacityDir *= -1 }
        if (p.opacity < 0.03) { p.opacity = 0.03; p.opacityDir *= -1 }

        // Draw particle
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color + p.opacity + ")"
        ctx!.fill()

        // Grab effect — draw faint lines to nearby mouse
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) {
          const lineOpacity = (1 - dist / 140) * 0.08
          ctx!.beginPath()
          ctx!.moveTo(p.x, p.y)
          ctx!.lineTo(mouse.current.x, mouse.current.y)
          ctx!.strokeStyle = `rgba(139,156,247,${lineOpacity})`
          ctx!.lineWidth = 0.5
          ctx!.stroke()
        }
      }

      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    raf.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      style={{ pointerEvents: "none" }}
    />
  )
}
