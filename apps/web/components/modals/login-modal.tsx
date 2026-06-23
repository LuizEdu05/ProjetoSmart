"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const { login } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Preencha e-mail e senha.")
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      onClose()
      showToast(`👋 Bem-vindo(a)!`)
      setEmail("")
      setPassword("")
    } catch (err: any) {
      setError(err.message || "Erro ao entrar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full border-[1.5px] border-[#d9e3dd] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors duration-200 bg-white"

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="bg-white rounded-[24px] p-8 max-w-[440px] w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f2f5f3] hover:bg-[#e8ede9] flex items-center justify-center text-[#6b7c72] transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X size={16} />
            </button>

            <h2
              id="login-title"
              className="text-[24px] font-bold text-[#0e1a14] mb-1"
            >
              Entrar na conta
            </h2>
            <p className="text-[13px] text-[#6b7c72] mb-5">
              Acesse seu histórico e gerencie seus agendamentos.
            </p>

            {error && (
              <div
                role="alert"
                className="bg-[#FCEBEB] text-[#791F1F] rounded-lg px-3 py-2.5 text-[13px] mb-4"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label
                  htmlFor="login-email"
                  className="block text-[12px] font-medium text-[#2a3d33] mb-1.5"
                >
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="login-pass"
                  className="block text-[12px] font-medium text-[#2a3d33] mb-1.5"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass + " pr-10"}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7c72] hover:text-[#0e1a14] transition-colors cursor-pointer"
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="text-right mb-5">
                <button
                  type="button"
                  className="text-[12px] text-[#1D9E75] hover:underline cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-60 text-white rounded-xl py-3 text-[14px] font-medium transition-colors duration-200 cursor-pointer"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4 text-[12px] text-[#6b7c72]">
              <div className="flex-1 h-px bg-[#d9e3dd]" />
              ou
              <div className="flex-1 h-px bg-[#d9e3dd]" />
            </div>

            <button className="w-full bg-white border-[1.5px] border-[#d9e3dd] hover:border-[#1D9E75] text-[#0e1a14] rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer mb-4">
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </button>

            <p className="text-center text-[13px] text-[#6b7c72]">
              Não tem conta?{" "}
              <button
                onClick={() => {
                  onClose()
                  onSwitchToRegister()
                }}
                className="text-[#1D9E75] font-medium hover:underline cursor-pointer"
              >
                Criar agora
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
