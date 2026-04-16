import { motion } from "framer-motion"
import { useNavigate } from "react-router"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50/80">
      <div className="flex flex-col items-center px-6 text-center">
        <motion.div
          className="mb-6 text-7xl font-bold tracking-tighter text-slate-200"
          style={{ letterSpacing: "-0.05em" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          404
        </motion.div>

        <motion.h1
          className="mb-3 text-2xl font-semibold tracking-tight text-slate-800"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Page not found
        </motion.h1>

        <motion.p
          className="mb-8 max-w-sm text-base text-slate-400"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.button
          onClick={() => navigate("/")}
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.97]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Go Home
        </motion.button>
      </div>
    </div>
  )
}
