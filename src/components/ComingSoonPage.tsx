import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

/** Minimal particle field — lighter than auth page, warm tones */
function SoftParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    function resize() {
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + "px"
      canvas!.style.height = window.innerHeight + "px"
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.12 + 0.03,
      dir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.001 + 0.0005),
      color: ["rgba(139,92,246,", "rgba(99,102,241,", "rgba(168,85,247,"][Math.floor(Math.random() * 3)],
    }))

    function animate() {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx!.clearRect(0, 0, w, h)

      for (const p of dots) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -5) p.x = w + 5
        if (p.x > w + 5) p.x = -5
        if (p.y < -5) p.y = h + 5
        if (p.y > h + 5) p.y = -5
        p.opacity += p.dir
        if (p.opacity > 0.15) { p.opacity = 0.15; p.dir *= -1 }
        if (p.opacity < 0.02) { p.opacity = 0.02; p.dir *= -1 }
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color + p.opacity + ")"
        ctx!.fill()
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    raf.current = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />
}

export function ComingSoonPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/40" />

      {/* Soft radial glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-100/30 via-violet-100/20 to-transparent blur-3xl" />
      </div>

      <SoftParticles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo mark */}
        <motion.div
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
          style={{ background: "linear-gradient(135deg, oklch(0.52 0.18 270), oklch(0.42 0.16 255))" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5Z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </motion.div>

        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          style={{ letterSpacing: "-0.03em" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Something great is
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            on the way
          </span>
        </motion.h1>

        <motion.p
          className="mb-10 max-w-md text-lg leading-relaxed text-slate-500"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          We're putting the finishing touches on something
          you'll love. Check back soon.
        </motion.p>

        {/* Decorative dots */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-indigo-300/50"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
