"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Building2 } from "lucide-react"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { seedClinicAdmins } from "@/lib/clinic-store"

export default function ClinicLoginPage() {
  const { login, clinic } = useClinicAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a14] via-[#142a1e] to-[#0e1a14] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
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
          <p className="text-[#8fa398] text-[14px]">Entre para gerenciar seus agendamentos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          {/* Demo hint */}
          <div className="bg-[#E1F5EE] border border-[#1D9E75]/30 rounded-xl p-3 mb-5 flex items-start gap-2.5">
            <Building2 size={15} className="text-[#1D9E75] flex-shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#0F6E56]">
              <strong>Conta demo:</strong><br />
              clinica@smartconsulta.com / admin123
            </div>
          </div>

          {error && (
            <div role="alert" className="bg-[#FCEBEB] text-[#791F1F] rounded-lg px-3 py-2.5 text-[13px] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="cl-email" className="block text-[12px] font-medium text-[#2a3d33] mb-1.5">E-mail</label>
              <input id="cl-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="clinica@email.com" className={input} autoComplete="email" required />
            </div>
            <div className="mb-6">
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
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-60 text-white rounded-xl py-3 text-[15px] font-semibold transition-colors cursor-pointer">
              {loading ? "Entrando..." : "Acessar painel"}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#6b7c72] mt-5">
            É paciente?{" "}
            <a href="/" className="text-[#1D9E75] hover:underline font-medium cursor-pointer">
              Acessar site principal
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
