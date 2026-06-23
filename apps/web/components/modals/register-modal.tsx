"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const { register } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.firstName || !form.email || !form.password) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }
    if (form.password.length < 6) {
      setError("Senha mínimo 6 caracteres.")
      return
    }
    setLoading(true)
    try {
      await register(
        form.firstName,
        form.lastName,
        form.email,
        form.phone,
        form.password
      )
      onClose()
      showToast(`🎉 Bem-vindo(a), ${form.firstName}!`)
      setForm({ firstName: "", lastName: "", email: "", phone: "", password: "" })
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full border-[1.5px] border-[#d9e3dd] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors duration-200 bg-white"
  const labelClass =
    "block text-[12px] font-medium text-[#2a3d33] mb-1.5"

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-title"
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
              id="register-title"
              className="text-[24px] font-bold text-[#0e1a14] mb-1"
            >
              Criar conta
            </h2>
            <p className="text-[13px] text-[#6b7c72] mb-5">
              É grátis! Agende e acompanhe suas consultas.
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
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="reg-first" className={labelClass}>
                    Nome <span className="text-[#E24B4A]">*</span>
                  </label>
                  <input
                    id="reg-first"
                    name="firstName"
                    type="text"
                    placeholder="Seu nome"
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reg-last" className={labelClass}>
                    Sobrenome
                  </label>
                  <input
                    id="reg-last"
                    name="lastName"
                    type="text"
                    placeholder="Sobrenome"
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="reg-email" className={labelClass}>
                  E-mail <span className="text-[#E24B4A]">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="reg-phone" className={labelClass}>
                  Telefone / WhatsApp
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="(47) 99999-9999"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="reg-pass" className={labelClass}>
                  Senha <span className="text-[#E24B4A]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-pass"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Mín. 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    className={inputClass + " pr-10"}
                    autoComplete="new-password"
                    required
                    minLength={6}
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

              <p className="text-[11px] text-[#6b7c72] mb-4">
                Ao criar conta, você concorda com os{" "}
                <button
                  type="button"
                  className="text-[#1D9E75] hover:underline cursor-pointer"
                >
                  Termos de Uso
                </button>{" "}
                e{" "}
                <button
                  type="button"
                  className="text-[#1D9E75] hover:underline cursor-pointer"
                >
                  Política de Privacidade
                </button>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-60 text-white rounded-xl py-3 text-[14px] font-medium transition-colors duration-200 cursor-pointer"
              >
                {loading ? "Criando conta..." : "Criar conta grátis"}
              </button>
            </form>

            <p className="text-center text-[13px] text-[#6b7c72] mt-4">
              Já tem conta?{" "}
              <button
                onClick={() => {
                  onClose()
                  onSwitchToLogin()
                }}
                className="text-[#1D9E75] font-medium hover:underline cursor-pointer"
              >
                Entrar
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
