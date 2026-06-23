"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, MapPin, Phone, Mail, Stethoscope, Check } from "lucide-react"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { getClinicSession, saveClinicSession, type ClinicAdmin } from "@/lib/clinic-store"

export default function ClinicSettingsPage() {
  const { clinic, logout } = useClinicAuth()
  const router = useRouter()
  const [form, setForm] = useState<Partial<ClinicAdmin>>({})
  const [saved, setSaved] = useState(false)
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" })
  const [pwdError, setPwdError] = useState("")
  const [pwdSaved, setPwdSaved] = useState(false)

  useEffect(() => {
    if (!clinic) { router.replace("/clinic/login"); return }
    setForm({
      clinicName: clinic.clinicName,
      ownerName:  clinic.ownerName,
      email:      clinic.email,
      phone:      clinic.phone,
      address:    clinic.address,
      specialty:  clinic.specialty,
    })
  }, [clinic, router])

  if (!clinic) return null

  function set(k: keyof ClinicAdmin, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
    setSaved(false)
  }

  function saveInfo() {
    const session = getClinicSession()
    if (!session) return
    const updated: ClinicAdmin = { ...session, ...form } as ClinicAdmin
    saveClinicSession(updated)
    // Also update the admins list in localStorage
    try {
      const admins = JSON.parse(localStorage.getItem("sc_clinic_admins") || "[]")
      const next = admins.map((a: ClinicAdmin) => a.id === session.id ? { ...a, ...form } : a)
      localStorage.setItem("sc_clinic_admins", JSON.stringify(next))
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function changePwd() {
    setPwdError("")
    const session = getClinicSession()
    if (!session) return
    if (pwd.current !== session.password) { setPwdError("Senha atual incorreta."); return }
    if (pwd.next.length < 6) { setPwdError("Nova senha deve ter ao menos 6 caracteres."); return }
    if (pwd.next !== pwd.confirm) { setPwdError("Senhas não conferem."); return }
    try {
      const admins = JSON.parse(localStorage.getItem("sc_clinic_admins") || "[]")
      const next = admins.map((a: ClinicAdmin) => a.id === session.id ? { ...a, password: pwd.next } : a)
      localStorage.setItem("sc_clinic_admins", JSON.stringify(next))
      saveClinicSession({ ...session, password: pwd.next })
    } catch {}
    setPwd({ current: "", next: "", confirm: "" })
    setPwdSaved(true)
    setTimeout(() => setPwdSaved(false), 2000)
  }

  const inp = "w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-4 py-3 text-[14px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors bg-white"

  return (
    <div className="p-7 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0e1a14]">Configurações</h1>
        <p className="text-[14px] text-[#6b7c72]">Gerencie as informações da sua clínica</p>
      </div>

      {/* Clinic info card */}
      <div className="bg-white rounded-2xl border border-[#e8ede9] p-6 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={16} className="text-[#1D9E75]" />
          <h2 className="font-semibold text-[16px] text-[#0e1a14]">Informações da clínica</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            ["clinicName", "Nome da clínica",   Building2,    "Clínica Saúde & Vida"],
            ["specialty",  "Especialidade",      Stethoscope,  "Clínica Geral"],
            ["ownerName",  "Responsável",        Mail,         "Dr. Nome Sobrenome"],
            ["email",      "E-mail",             Mail,         "contato@clinica.com"],
            ["phone",      "Telefone",           Phone,        "(47) 3322-1111"],
            ["address",    "Endereço",           MapPin,       "Rua das Flores, 123 — Joinville, SC"],
          ] as const).map(([k, label, Icon, ph]) => (
            <div key={k} className={k === "address" || k === "clinicName" ? "sm:col-span-2" : ""}>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">
                <span className="flex items-center gap-1">
                  <Icon size={11} /> {label}
                </span>
              </label>
              <input type="text" value={(form[k] as string) || ""} onChange={e => set(k, e.target.value)}
                placeholder={ph} className={inp} />
            </div>
          ))}
        </div>

        <button onClick={saveInfo}
          className={`mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            saved ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-[#1D9E75] hover:bg-[#0F6E56] text-white"
          }`}>
          {saved ? <><Check size={14} /> Salvo!</> : "Salvar informações"}
        </button>
      </div>

      {/* Password card */}
      <div className="bg-white rounded-2xl border border-[#e8ede9] p-6 mb-5">
        <h2 className="font-semibold text-[16px] text-[#0e1a14] mb-5">Alterar senha</h2>
        {pwdError && <div className="bg-[#FCEBEB] text-[#791F1F] rounded-lg px-3 py-2.5 text-[13px] mb-4">{pwdError}</div>}
        <div className="space-y-3">
          {([
            ["current", "Senha atual",   pwd.current],
            ["next",    "Nova senha",    pwd.next],
            ["confirm", "Confirmar nova senha", pwd.confirm],
          ] as const).map(([k, label, val]) => (
            <div key={k}>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">{label}</label>
              <input type="password" value={val} onChange={e => setPwd(p => ({ ...p, [k]: e.target.value }))}
                placeholder="••••••••" className={inp} />
            </div>
          ))}
        </div>
        <button onClick={changePwd}
          className={`mt-4 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            pwdSaved ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-[#0e1a14] hover:bg-[#142a1e] text-white"
          }`}>
          {pwdSaved ? "Senha alterada!" : "Alterar senha"}
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-[#FCEBEB] p-6">
        <h2 className="font-semibold text-[16px] text-[#0e1a14] mb-1">Sair do painel</h2>
        <p className="text-[13px] text-[#6b7c72] mb-4">Encerrar sua sessão atual na clínica.</p>
        <button onClick={() => { logout(); router.replace("/clinic/login") }}
          className="px-5 py-2.5 rounded-xl bg-[#FCEBEB] hover:bg-[#E24B4A] text-[#791F1F] hover:text-white text-[13px] font-semibold transition-colors cursor-pointer">
          Sair da conta
        </button>
      </div>
    </div>
  )
}
