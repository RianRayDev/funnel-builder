import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ParticleField } from "@/components/ParticleField"

type Mode = "login" | "register" | "forgot"

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function resetForm() { setEmail(""); setPassword(""); setName(""); setError(""); setSuccess("") }
  function switchMode(newMode: Mode) { resetForm(); setMode(newMode) }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error.message); else navigate("/funnel-builder")
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (!name.trim()) { setError("Name is required"); return }
    if (!email.trim()) { setError("Email is required"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    setSubmitting(true)
    const { error } = await signUp(email, password, name.trim())
    setSubmitting(false)
    if (error) setError(error.message); else navigate("/funnel-builder")
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (!email.trim()) { setError("Enter your email address"); return }
    setSubmitting(true)
    const { error } = await resetPassword(email)
    setSubmitting(false)
    if (error) setError(error.message); else setSuccess("Check your email for a password reset link")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Dark ambient background */}
      <div className="absolute inset-0 bg-[#0a0a12]">
        <motion.div className="absolute h-[800px] w-[800px] rounded-full opacity-40" style={{ background: "radial-gradient(circle, oklch(0.45 0.18 270) 0%, transparent 70%)", filter: "blur(100px)", left: "20%", top: "10%" }} animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute h-[600px] w-[600px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, oklch(0.5 0.15 230) 0%, transparent 70%)", filter: "blur(80px)", right: "15%", bottom: "5%" }} animate={{ x: [0, -50, 40, 0], y: [0, 30, -60, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute h-[400px] w-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, oklch(0.6 0.12 320) 0%, transparent 70%)", filter: "blur(60px)", left: "55%", top: "60%" }} animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat" }} />
        <ParticleField />
      </div>

      {/* Frosted glass card */}
      <motion.div className="relative z-10 w-full max-w-[400px] px-5" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <div className="rounded-[var(--radius-xl)] p-8" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)", backdropFilter: "blur(40px) saturate(140%)", WebkitBackdropFilter: "blur(40px) saturate(140%)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
          <div className="mb-8 flex flex-col items-center">
            <motion.div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)]" style={{ background: "linear-gradient(135deg, oklch(0.5 0.2 270), oklch(0.4 0.18 250))", boxShadow: "0 4px 24px oklch(0.4 0.2 265 / 0.4), 0 2px 8px oklch(0.3 0.15 265 / 0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}>
              <Layers className="h-8 w-8 text-white" strokeWidth={1.6} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={mode} className="flex flex-col items-center" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                <h1 className="text-[26px] font-bold tracking-[-0.02em] text-white">
                  {mode === "login" && "Welcome back"}{mode === "register" && "Create account"}{mode === "forgot" && "Reset password"}
                </h1>
                <p className="mt-1.5 text-[15px] text-white/50">
                  {mode === "login" && "Sign in to your workspace"}{mode === "register" && "Start building funnels today"}{mode === "forgot" && "We'll send a reset link to your email"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.form key="login" onSubmit={handleLogin} className="space-y-4" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                <DarkField label="Email" id="email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
                <DarkField label="Password" id="password" type="password" placeholder="Enter your password" value={password} onChange={setPassword}
                  labelRight={<button type="button" onClick={() => switchMode("forgot")} className="text-[12px] font-medium text-white/40 transition-colors hover:text-white/70">Forgot?</button>} />
                {error && <ErrorMsg text={error} />}
                <DarkSubmit loading={submitting} label="Sign In" />
              </motion.form>
            )}
            {mode === "register" && (
              <motion.form key="register" onSubmit={handleRegister} className="space-y-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                <DarkField label="Full Name" id="name" type="text" placeholder="Your name" value={name} onChange={setName} autoFocus />
                <DarkField label="Email" id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
                <DarkField label="Password" id="reg-password" type="password" placeholder="Minimum 6 characters" value={password} onChange={setPassword} />
                {error && <ErrorMsg text={error} />}
                <DarkSubmit loading={submitting} label="Create Account" />
              </motion.form>
            )}
            {mode === "forgot" && (
              <motion.form key="forgot" onSubmit={handleForgot} className="space-y-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                <DarkField label="Email" id="forgot-email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoFocus />
                {error && <ErrorMsg text={error} />}
                {success && <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-[13px] text-emerald-400">{success}</p>}
                <DarkSubmit loading={submitting} label="Send Reset Link" />
              </motion.form>
            )}
          </AnimatePresence>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/25">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <motion.button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")} className="group flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] py-3 text-[14px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.04] hover:text-white/70" whileTap={{ scale: 0.98 }}>
            {mode === "login" ? (<>Create a new account <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>) : mode === "register" ? (<>Already have an account? Sign in <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>) : (<><ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to sign in</>)}
          </motion.button>
        </div>
        <motion.p className="mt-6 text-center text-[12px] text-white/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>Funnel Builder</motion.p>
      </motion.div>
    </div>
  )
}

function DarkField({ label, id, type, placeholder, value, onChange, labelRight, autoFocus }: { label: string; id: string; type: string; placeholder: string; value: string; onChange: (v: string) => void; labelRight?: React.ReactNode; autoFocus?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-[13px] font-medium text-white/60">{label}</label>
        {labelRight}
      </div>
      <input id={id} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} autoFocus={autoFocus}
        className="flex h-12 w-full rounded-[var(--radius-lg)] border-0 px-4 text-[15px] text-white placeholder:text-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.04)" }} />
    </div>
  )
}

function DarkSubmit({ loading, label }: { loading: boolean; label: string }) {
  return (
    <div className="pt-1">
      <motion.button type="submit" disabled={loading} className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] text-[15px] font-semibold text-white transition-all duration-200 disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, oklch(0.5 0.2 270), oklch(0.42 0.18 255))", boxShadow: "0 4px 16px oklch(0.4 0.2 265 / 0.35), 0 1px 3px oklch(0.3 0.15 265 / 0.25), inset 0 1px 0 rgba(255,255,255,0.12)" }}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <motion.div className="absolute inset-0 opacity-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} animate={{ x: ["-100%", "200%"], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="relative z-10">{label}</span>}
      </motion.button>
    </div>
  )
}

function ErrorMsg({ text }: { text: string }) {
  return <motion.p className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>{text}</motion.p>
}
