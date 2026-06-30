"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Building2, Calendar, BarChart2, Users, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { seedClinicAdmins } from "@/lib/clinic-store"

const FEATURES = [
  { Icon: Calendar,  title: "Agenda inteligente",       desc: "Gerencie horários e disponibilidade em tempo real" },
  { Icon: BarChart2, title: "Relatórios completos",     desc: "Faturamento, ocupação e métricas de desempenho" },
  { Icon: Users,     title: "Gestão de profissionais",  desc: "Cadastre médicos e controle escalas facilmente" },
  { Icon: Shield,    title: "Dados protegidos",         desc: "Prontuários e agendamentos com segurança total" },
]

const STATS = [
  { value: "320+",   label: "Clínicas parceiras" },
  { value: "48 mil", label: "Consultas agendadas" },
  { value: "98%",    label: "Satisfação" },
]

export default function ClinicLoginPage() {
  const { login, clinic } = useClinicAuth()
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    seedClinicAdmins()
    if (clinic) router.replace("/clinic/dashboard")
  }, [clinic, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) { setError("Preencha e-mail e senha."); return }
    setLoading(true)
    try {
      login(email, password)
      router.replace("/clinic/dashboard")
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas.")
    } finally {
      setLoading(false)
    }
  }

  const input = "w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-4 py-3 text-[14px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors bg-white"

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel (desktop) ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="hidden lg:flex flex-col w-[500px] flex-shrink-0 bg-[#060d09] relative overflow-hidden p-10"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(29,158,117,0.16) 0%, transparent 70%)", top: "-15%", left: "-25%" }} />
          <div className="absolute w-[350px] h-[350px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(29,158,117,0.10) 0%, transparent 70%)", bottom: "5%", right: "-15%" }} />
          <div className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex items-center gap-3 mb-12 relative"
        >
          <span className="w-10 h-10 bg-[#1D9E75] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">+</span>
          <div>
            <div className="font-bold text-[18px] leading-none">
              <span className="text-[#FFB800]">SMART</span>
              <span className="text-white"> Clínica</span>
            </div>
            <div className="text-[#4a7a5e] text-[11px] mt-0.5">Portal de Gestão</div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          className="text-[34px] font-black text-white leading-[1.15] mb-3 relative"
        >
          Gerencie sua clínica com{" "}
          <span className="text-[#1D9E75]">inteligência</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#8fa398] text-[14px] leading-relaxed mb-10 relative"
        >
          Agendamentos, profissionais e relatórios em um só lugar.
        </motion.p>

        {/* Features */}
        <div className="space-y-4 mb-10 relative">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.09, duration: 0.4, ease: "easeOut" as const }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1D9E75]/15 border border-[#1D9E75]/25 flex items-center justify-center flex-shrink-0">
                <f.Icon size={16} className="text-[#1D9E75]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white font-semibold text-[13px] leading-tight">{f.title}</p>
                <p className="text-[#8fa398] text-[11px]">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-auto pt-7 border-t border-white/8 grid grid-cols-3 gap-4 relative">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.09, duration: 0.4 }}
            >
              <p className="text-[22px] font-black text-[#1D9E75] leading-none">{s.value}</p>
              <p className="text-[#8fa398] text-[11px] mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 bg-gradient-to-br from-[#0e1a14] via-[#142a1e] to-[#0e1a14] lg:bg-[#f8faf9] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Mobile orbs */}
        <div className="absolute inset-0 pointer-events-none lg:hidden" aria-hidden="true">
          <div className="absolute w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(29,158,117,0.2) 0%, transparent 70%)", top: "-10%", right: "-10%" }} />
          <div className="absolute w-[200px] h-[200px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%)", bottom: "10%", left: "-5%" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" as const }}
          className="w-full max-w-[400px] relative"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-10 h-10 bg-[#1D9E75] rounded-xl flex items-center justify-center text-white font-bold text-xl">+</span>
              <div className="text-left">
                <div className="font-bold text-xl leading-none">
                  <span className="text-[#FFB800]">SMART</span>
                  <span className="text-white"> Consulta</span>
                </div>
                <div className="text-[#8fa398] text-[12px]">Portal da Clínica</div>
              </div>
            </div>
            <h1 className="text-[22px] font-bold text-white mb-1">Acesso para Clínicas</h1>
            <p className="text-[#8fa398] text-[13px]">Entre para gerenciar seus agendamentos</p>
          </div>

          {/* Desktop heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block mb-7"
          >
            <h1 className="text-[28px] font-bold text-[#0e1a14] mb-1">Bem-vindo de volta</h1>
            <p className="text-[#6b7c72] text-[14px]">Entre para acessar o painel da sua clínica</p>
          </motion.div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-7 shadow-2xl lg:shadow-md border-0 lg:border lg:border-[#e8ede9]">
            {/* Demo hint */}
            <div className="bg-[#E1F5EE] border border-[#1D9E75]/30 rounded-xl p-3 mb-5 flex items-start gap-2.5">
              <Building2 size={15} className="text-[#1D9E75] flex-shrink-0 mt-0.5" />
              <div className="text-[12px] text-[#0F6E56]">
                <strong>Conta demo:</strong><br />
                clinica@smartconsulta.com / admin123
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  role="alert"
                  className="bg-[#FCEBEB] text-[#791F1F] rounded-lg px-3 py-2.5 text-[13px] overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mb-4"
              >
                <label htmlFor="cl-email" className="block text-[12px] font-medium text-[#2a3d33] mb-1.5">E-mail</label>
                <input id="cl-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="clinica@email.com" className={input} autoComplete="email" required />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="mb-6"
              >
                <label htmlFor="cl-pass" className="block text-[12px] font-medium text-[#2a3d33] mb-1.5">Senha</label>
                <div className="relative">
                  <input id="cl-pass" type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className={input + " pr-11"} autoComplete="current-password" required />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer"
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-60 text-white rounded-xl py-3 text-[15px] font-semibold transition-colors cursor-pointer"
              >
                {loading ? "Entrando..." : "Acessar painel"}
              </motion.button>
            </form>

            <p className="text-center text-[13px] text-[#6b7c72] mt-5">
              É paciente?{" "}
              <a href="/" className="text-[#1D9E75] hover:underline font-medium cursor-pointer">
                Acessar site principal
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
