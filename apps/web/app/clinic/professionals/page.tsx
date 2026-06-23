"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, UserCheck, UserX, Edit2, X, Check } from "lucide-react"
import { useClinicAuth } from "@/context/clinic-auth-context"
import {
  getProfessionals,
  addProfessional,
  updateProfessional,
  type Professional,
  type WeekSchedule,
} from "@/lib/clinic-store"

const DEFAULT_SCHEDULE: WeekSchedule = {
  seg: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  ter: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  qua: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  qui: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  sex: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  sab: { active: false, start: "08:00", end: "12:00", interval: 30 },
  dom: { active: false, start: "08:00", end: "12:00", interval: 30 },
}

const COLORS = [
  { color: "#0F6E56", bg: "#E1F5EE" },
  { color: "#185FA5", bg: "#E6F1FB" },
  { color: "#993556", bg: "#FBEAF0" },
  { color: "#633806", bg: "#FAEEDA" },
  { color: "#4C3B8C", bg: "#EEEAFA" },
  { color: "#1D6A84", bg: "#E3F4FA" },
]

type FormData = {
  name: string; specialty: string; crm: string
  email: string; phone: string; active: boolean
}

const EMPTY_FORM: FormData = { name: "", specialty: "", crm: "", email: "", phone: "", active: true }

function ProfForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<FormData>
  onSave: (d: FormData) => void
  onCancel: () => void
}) {
  const [d, setD] = useState<FormData>({ ...EMPTY_FORM, ...initial })
  const set = (k: keyof FormData, v: string | boolean) => setD(prev => ({ ...prev, [k]: v }))

  const inp = "w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-4 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors bg-white"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      {([
        ["name",      "Nome completo",  "text",  "Dr. Nome Sobrenome"],
        ["specialty", "Especialidade",  "text",  "Cardiologia"],
        ["crm",       "CRM",            "text",  "CRM/SC 12345"],
        ["email",     "E-mail",         "email", "medico@clinica.com"],
        ["phone",     "Telefone",       "tel",   "(47) 99999-9999"],
      ] as const).map(([k, label, type, ph]) => (
        <div key={k} className={k === "name" || k === "specialty" ? "sm:col-span-2" : ""}>
          <label className="block text-[11px] font-semibold text-[#2a3d33] mb-1.5 uppercase tracking-wide">{label}</label>
          <input type={type} value={d[k] as string} onChange={e => set(k, e.target.value)} placeholder={ph} className={inp} />
        </div>
      ))}
      <div className="sm:col-span-2 flex items-center gap-2">
        <button type="button" onClick={() => set("active", !d.active)}
          className={`relative inline-flex w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${d.active ? "bg-[#1D9E75]" : "bg-[#d9e3dd]"}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${d.active ? "translate-x-4" : ""}`} />
        </button>
        <span className="text-[13px] text-[#0e1a14]">{d.active ? "Ativo" : "Inativo"}</span>
      </div>
      <div className="sm:col-span-2 flex gap-2 pt-1">
        <button onClick={() => onSave(d)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors cursor-pointer">
          <Check size={14} /> Salvar
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[#d9e3dd] text-[#6b7c72] hover:text-[#0e1a14] text-[13px] transition-colors cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function ClinicProfessionalsPage() {
  const { clinic } = useClinicAuth()
  const router = useRouter()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [search, setSearch] = useState("")
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!clinic) return
    setProfessionals(getProfessionals(clinic.clinicId))
  }, [clinic])

  useEffect(() => {
    if (!clinic) { router.replace("/clinic/login"); return }
    load()
  }, [clinic, router, load])

  if (!clinic) return null

  function handleAdd(d: FormData) {
    if (!clinic) return
    const initials = d.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    const colorIdx = professionals.length % COLORS.length
    const c = COLORS[colorIdx] ?? COLORS[0]!
    addProfessional({ ...d, clinicId: clinic.clinicId, initials, color: c.color, avatarBg: c.bg, schedule: DEFAULT_SCHEDULE })
    setAdding(false)
    load()
  }

  function handleEdit(id: string, d: FormData) {
    const prof = professionals.find(p => p.id === id)
    if (!prof) return
    updateProfessional({ ...prof, ...d })
    setEditingId(null)
    load()
  }

  function toggleActive(prof: Professional) {
    updateProfessional({ ...prof, active: !prof.active })
    load()
  }

  const filtered = professionals.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q)
  })

  const active = filtered.filter(p => p.active)
  const inactive = filtered.filter(p => !p.active)

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#0e1a14]">Profissionais</h1>
          <p className="text-[14px] text-[#6b7c72]">{professionals.filter(p => p.active).length} ativos · {professionals.filter(p => !p.active).length} inativos</p>
        </div>
        <button onClick={() => { setAdding(true); setEditingId(null) }}
          className="flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors cursor-pointer">
          <Plus size={15} /> Novo profissional
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7c72]" />
        <input value={search} onChange={e => setSearch(e.target.value)} type="search"
          placeholder="Buscar profissional..." className="w-full pl-9 pr-4 py-2.5 border border-[#d9e3dd] rounded-xl text-[13px] outline-none focus:border-[#1D9E75] bg-white transition-colors" />
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-2xl border border-[#1D9E75]/30 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[15px] text-[#0e1a14]">Novo profissional</h2>
            <button onClick={() => setAdding(false)} className="text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer"><X size={16} /></button>
          </div>
          <ProfForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      {/* Professionals grid */}
      {[{ label: "Ativos", list: active }, { label: "Inativos", list: inactive }].map(({ label, list }) => list.length > 0 && (
        <div key={label} className="mb-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7c72] mb-3">{label}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {list.map(prof => (
              <div key={prof.id} className={`bg-white rounded-2xl border overflow-hidden ${editingId === prof.id ? "border-[#1D9E75]/40" : "border-[#e8ede9]"}`}>
                {editingId === prof.id ? (
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[15px] text-[#0e1a14]">Editar profissional</h3>
                      <button onClick={() => setEditingId(null)} className="text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer"><X size={16} /></button>
                    </div>
                    <ProfForm
                      initial={{ name: prof.name, specialty: prof.specialty, crm: prof.crm, email: prof.email, phone: prof.phone, active: prof.active }}
                      onSave={d => handleEdit(prof.id, d)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-[15px] font-bold"
                      style={{ background: prof.avatarBg, color: prof.color }}>
                      {prof.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[14px] text-[#0e1a14]">{prof.name}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${prof.active ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-[#e8ede9] text-[#6b7c72]"}`}>
                          {prof.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#6b7c72] mt-0.5">{prof.specialty} · {prof.crm}</p>
                      <p className="text-[12px] text-[#6b7c72]">{prof.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => { setEditingId(prof.id); setAdding(false) }}
                        className="p-1.5 rounded-lg text-[#6b7c72] hover:text-[#1D9E75] hover:bg-[#E1F5EE] transition-colors cursor-pointer" aria-label="Editar">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => toggleActive(prof)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${prof.active ? "text-[#6b7c72] hover:text-[#E24B4A] hover:bg-[#FCEBEB]" : "text-[#6b7c72] hover:text-[#1D9E75] hover:bg-[#E1F5EE]"}`}
                        aria-label={prof.active ? "Desativar" : "Ativar"}>
                        {prof.active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && !adding && (
        <div className="text-center py-14 text-[#6b7c72]">
          <Search size={36} className="mx-auto mb-2 text-[#d9e3dd]" />
          <p className="text-[14px]">Nenhum profissional encontrado.</p>
        </div>
      )}
    </div>
  )
}
