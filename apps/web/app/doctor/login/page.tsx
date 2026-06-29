"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stethoscope, Eye, EyeOff } from "lucide-react"
import { useDoctorAuth } from "@/context/doctor-auth-context"

export default function DoctorLoginPage() {
  const { login, doctor } = useDoctorAuth()
  const router = useRouter()

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  if (doctor) {
    router.replace("/doctor/dashboard")
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      login(email.trim(), password)
      router.replace("/doctor/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.")
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-4 py-3 text-[14px] text-[#0e1a14] outline-none focus:border-[#378ADD] transition-colors bg-white"

  return (
    <div className="min-h-screen bg-[#f0f4f7] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#378ADD] flex items-center justify-center mx-auto mb-3">
            <Stethoscope size={26} className="text-white" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0e1a14]">Portal do Médico</h1>
          <p className="text-[13px] text-[#6b7c72] mt-1">Smart Consulta — Área profissional</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8ede9] p-7 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#0e1a14] mb-5">Entrar</h2>

          {error && (
            <div className="bg-[#FCEBEB] text-[#791F1F] rounded-lg px-3.5 py-2.5 text-[13px] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">
                E-mail profissional
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                required
                className={inp}
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={inp + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl py-3 text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 pt-4 border-t border-[#f2f5f3]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-2">
              Credenciais de demonstração
            </p>
            <div className="space-y-1.5">
              {[
                { name: "Dr. Felipe Moura (Clínica Geral)", email: "felipe@clinica.com" },
                { name: "Dra. Ana Ribeiro (Cardiologia)",   email: "ana@clinica.com" },
                { name: "Dr. Lucas Peixoto (Ortopedia)",    email: "lucas@clinica.com" },
              ].map(d => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword("medico123") }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[12px] bg-[#f8faf9] hover:bg-[#E6F1FB] border border-[#e8ede9] hover:border-[#378ADD] transition-all cursor-pointer"
                >
                  <span className="font-medium text-[#0e1a14]">{d.name}</span>
                  <br />
                  <span className="text-[#6b7c72]">{d.email} / medico123</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#6b7c72] mt-5">
          Problemas para entrar? Contate a administração da sua clínica.
        </p>
      </div>
    </div>
  )
}
