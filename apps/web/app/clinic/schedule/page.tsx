"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { getProfessionals, updateProfessional, type Professional, type DaySlot } from "@/lib/clinic-store"

const DAYS: { key: keyof Professional["schedule"]; label: string }[] = [
  { key: "seg", label: "Segunda" },
  { key: "ter", label: "Terça" },
  { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" },
  { key: "sex", label: "Sexta" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
]

const INTERVALS = [15, 20, 30, 45, 60]

function DayEditor({ slot, onChange }: { slot: DaySlot; onChange: (s: DaySlot) => void }) {
  const inp = "border border-[#d9e3dd] rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#1D9E75] bg-white transition-colors w-[90px]"
  return (
    <div className={`flex items-center gap-3 flex-wrap ${!slot.active ? "opacity-50" : ""}`}>
      <button onClick={() => onChange({ ...slot, active: !slot.active })}
        className={`relative inline-flex w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${slot.active ? "bg-[#1D9E75]" : "bg-[#d9e3dd]"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${slot.active ? "translate-x-4" : ""}`} />
      </button>
      <div className="flex items-center gap-1.5">
        <input type="time" value={slot.start} onChange={e => onChange({ ...slot, start: e.target.value })}
          disabled={!slot.active} className={inp} />
        <span className="text-[12px] text-[#6b7c72]">até</span>
        <input type="time" value={slot.end} onChange={e => onChange({ ...slot, end: e.target.value })}
          disabled={!slot.active} className={inp} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[12px] text-[#6b7c72]">Intervalo:</span>
        <select value={slot.interval} disabled={!slot.active}
          onChange={e => onChange({ ...slot, interval: Number(e.target.value) })}
          className={inp + " w-auto cursor-pointer"}>
          {INTERVALS.map(i => <option key={i} value={i}>{i} min</option>)}
        </select>
      </div>
    </div>
  )
}

export default function ClinicSchedulePage() {
  const { clinic } = useClinicAuth()
  const router = useRouter()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<Professional | null>(null)
  const [saved, setSaved] = useState(false)

  const load = useCallback(() => {
    if (!clinic) return
    const profs = getProfessionals(clinic.clinicId).filter(p => p.active)
    setProfessionals(profs)
    const first = profs[0]
    if (!selected && first) { setSelected(first.id); setDraft(first) }
  }, [clinic, selected])

  useEffect(() => {
    if (!clinic) { router.replace("/clinic/login"); return }
    load()
  }, [clinic, router, load])

  function selectProf(id: string) {
    const p = professionals.find(p => p.id === id)
    if (p) { setSelected(id); setDraft({ ...p, schedule: { ...p.schedule } }); setSaved(false) }
  }

  function updateDay(key: keyof Professional["schedule"], slot: DaySlot) {
    if (!draft) return
    setDraft({ ...draft, schedule: { ...draft.schedule, [key]: slot } })
    setSaved(false)
  }

  function save() {
    if (!draft) return
    updateProfessional(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!clinic) return null

  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0e1a14]">Agenda</h1>
        <p className="text-[14px] text-[#6b7c72]">Configure os horários de atendimento de cada profissional</p>
      </div>

      {professionals.length === 0 ? (
        <div className="text-center py-14 text-[#6b7c72]">
          <p className="text-[14px]">Nenhum profissional ativo. Cadastre profissionais primeiro.</p>
        </div>
      ) : (
        <div className="flex gap-5">
          {/* Sidebar selector */}
          <div className="w-48 flex-shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7c72] mb-2">Profissional</p>
            <div className="space-y-1">
              {professionals.map(p => (
                <button key={p.id} onClick={() => selectProf(p.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    selected === p.id ? "bg-[#1D9E75] text-white" : "bg-white border border-[#e8ede9] text-[#0e1a14] hover:border-[#1D9E75]"
                  }`}>
                  <p className="truncate">{p.name.replace(/^Dr[a]?\. /, "")}</p>
                  <p className={`text-[11px] truncate ${selected === p.id ? "text-white/70" : "text-[#6b7c72]"}`}>{p.specialty}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule editor */}
          {draft && (
            <div className="flex-1 bg-white rounded-2xl border border-[#e8ede9] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f2f5f3]">
                <div>
                  <h2 className="font-semibold text-[15px] text-[#0e1a14]">{draft.name}</h2>
                  <p className="text-[12px] text-[#6b7c72]">{draft.specialty}</p>
                </div>
                <button onClick={save}
                  className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                    saved ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-[#1D9E75] hover:bg-[#0F6E56] text-white"
                  }`}>
                  {saved ? "Salvo!" : "Salvar horários"}
                </button>
              </div>
              <div className="divide-y divide-[#f2f5f3]">
                {DAYS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-4 px-6 py-4 flex-wrap">
                    <span className="text-[13px] font-medium text-[#0e1a14] w-20 flex-shrink-0">{label}</span>
                    <DayEditor slot={draft.schedule[key]} onChange={s => updateDay(key, s)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
