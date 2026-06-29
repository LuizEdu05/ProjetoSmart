"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, CheckCircle, XCircle, Clock, Play, Eye } from "lucide-react"
import { useDoctorAuth } from "@/context/doctor-auth-context"
import {
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  updateAppointmentDoctorNotes,
  type GlobalAppointment,
  type ApptStatus,
} from "@/lib/global-appointments"
import { STATUS_STYLE } from "@/lib/status-config"

const FILTERS: { id: ApptStatus | "all"; label: string }[] = [
  { id: "all",          label: "Todos" },
  { id: "pending",      label: "Pendentes" },
  { id: "scheduled",    label: "Agendados" },
  { id: "confirmed",    label: "Confirmados" },
  { id: "in-progress",  label: "Em atend." },
  { id: "completed",    label: "Realizados" },
  { id: "cancelled",    label: "Cancelados" },
]

function DetailModal({
  appt,
  onClose,
  onStatusChange,
  onNotesSave,
}: {
  appt: GlobalAppointment
  onClose: () => void
  onStatusChange: (id: string, s: ApptStatus) => void
  onNotesSave: (id: string, notes: string) => void
}) {
  const [notes, setNotes] = useState(appt.doctorNotes || "")
  const s = STATUS_STYLE[appt.status]
  const canAct = !["completed","cancelled","no-show"].includes(appt.status)

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[520px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f2f5f3]">
          <h2 className="font-bold text-[17px] text-[#0e1a14]">Detalhes da consulta</h2>
          <button onClick={onClose} className="text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer text-lg">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Patient info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[18px] font-bold text-[#0e1a14]">{appt.patientName}</p>
              <p className="text-[13px] text-[#6b7c72]">{appt.patientEmail} · {appt.patientPhone}</p>
            </div>
            <span className="text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ color: s.color, background: s.bg }}>
              {s.label}
            </span>
          </div>

          {/* Appointment details */}
          <div className="bg-[#f8faf9] rounded-xl p-4 grid grid-cols-2 gap-3 text-[13px]">
            {[
              ["Data",        appt.date],
              ["Horário",     appt.time],
              ["Especialidade", appt.specialty],
              ["Pagamento",   appt.payment],
              ["Valor",       appt.price],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[#6b7c72] text-[11px] uppercase tracking-wide">{l}</p>
                <p className="font-medium text-[#0e1a14]">{v}</p>
              </div>
            ))}
          </div>

          {/* Clinic notes (read-only) */}
          {appt.notes && (
            <div className="bg-[#FEF3E2] rounded-xl p-3 text-[13px] text-[#633806]">
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-1">Obs. da clínica</p>
              {appt.notes}
            </div>
          )}

          {/* Doctor notes */}
          <div>
            <label className="block text-[12px] font-medium text-[#2a3d33] mb-1.5">Minhas anotações</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#378ADD] resize-none transition-colors"
              placeholder="Anotações sobre este atendimento..."
            />
            <button
              onClick={() => onNotesSave(appt.id, notes)}
              className="mt-1.5 text-[12px] text-[#378ADD] hover:underline cursor-pointer"
            >
              Salvar anotações
            </button>
          </div>

          {/* Actions */}
          {canAct && (
            <div className="flex flex-wrap gap-2 pt-1">
              {appt.status === "pending" && (
                <button
                  onClick={() => { onStatusChange(appt.id, "confirmed"); onClose() }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#E1F5EE] hover:bg-[#1D9E75] text-[#0F6E56] hover:text-white rounded-xl py-2.5 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  <CheckCircle size={15} /> Aceitar
                </button>
              )}
              {["scheduled","confirmed"].includes(appt.status) && (
                <button
                  onClick={() => { onStatusChange(appt.id, "confirmed"); onClose() }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#E1F5EE] hover:bg-[#1D9E75] text-[#0F6E56] hover:text-white rounded-xl py-2.5 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  <CheckCircle size={15} /> Confirmar
                </button>
              )}
              {["confirmed","scheduled"].includes(appt.status) && (
                <button
                  onClick={() => { onStatusChange(appt.id, "in-progress"); onClose() }}
                  className="flex items-center gap-1.5 bg-[#E3F4FA] hover:bg-[#378ADD] text-[#1D6A84] hover:text-white rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  <Play size={13} /> Iniciar
                </button>
              )}
              {["in-progress","confirmed","scheduled"].includes(appt.status) && (
                <button
                  onClick={() => { onStatusChange(appt.id, "completed"); onClose() }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-2.5 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  <CheckCircle size={15} /> Finalizar
                </button>
              )}
              {appt.status !== "completed" && appt.status !== "cancelled" && (
                <>
                  <button
                    onClick={() => { onStatusChange(appt.id, "no-show"); onClose() }}
                    className="flex items-center gap-1 bg-[#FEF3E2] hover:bg-[#EF9F27] text-[#854F0B] hover:text-white rounded-xl px-3 py-2.5 text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    <Clock size={13} /> Faltou
                  </button>
                  <button
                    onClick={() => { onStatusChange(appt.id, "cancelled"); onClose() }}
                    className="flex items-center gap-1 bg-[#FCEBEB] hover:bg-[#E24B4A] text-[#791F1F] hover:text-white rounded-xl px-3 py-2.5 text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    <XCircle size={13} /> Cancelar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DoctorAgendaPage() {
  const { doctor } = useDoctorAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<GlobalAppointment[]>([])
  const [filter, setFilter]     = useState<ApptStatus | "all">("all")
  const [search, setSearch]     = useState("")
  const [detail, setDetail]     = useState<GlobalAppointment | null>(null)

  const load = useCallback(() => {
    if (!doctor) return
    setAppointments(getAppointmentsByDoctor(doctor.professionalId))
  }, [doctor])

  useEffect(() => {
    if (!doctor) { router.replace("/doctor/login"); return }
    load()
  }, [doctor, router, load])

  function handleStatus(id: string, status: ApptStatus) {
    updateAppointmentStatus(id, status)
    load()
  }

  function handleNotes(id: string, notes: string) {
    updateAppointmentDoctorNotes(id, notes)
    load()
    // refresh detail
    setDetail(prev => prev && prev.id === id ? { ...prev, doctorNotes: notes } : prev)
  }

  const filtered = appointments.filter(a => {
    if (filter !== "all" && a.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return a.patientName.toLowerCase().includes(q) || a.specialty.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => `${a.dateISO}${a.time}`.localeCompare(`${b.dateISO}${b.time}`))

  if (!doctor) return null

  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0e1a14]">Minha Agenda</h1>
        <p className="text-[14px] text-[#6b7c72]">Gerencie suas consultas — {appointments.length} no total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7c72]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar paciente..."
            type="search"
            className="w-full pl-9 pr-4 py-2.5 border border-[#d9e3dd] rounded-xl text-[13px] outline-none focus:border-[#378ADD] bg-white transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as ApptStatus | "all")}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all cursor-pointer border ${
                filter === f.id
                  ? "bg-[#378ADD] text-white border-[#378ADD]"
                  : "bg-white text-[#6b7c72] border-[#d9e3dd] hover:border-[#378ADD] hover:text-[#378ADD]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8ede9] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-[#6b7c72]">
            <Search size={36} className="mx-auto mb-2 text-[#d9e3dd]" />
            <p className="text-[14px]">Nenhuma consulta encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f2f5f3] bg-[#f8faf9]">
                  {["Data/Hora","Paciente","Especialidade","Valor","Status","Ações"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b7c72] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(appt => {
                  const s = STATUS_STYLE[appt.status]
                  const canConfirm  = appt.status === "pending" || appt.status === "scheduled"
                  const canStart    = appt.status === "confirmed" || appt.status === "scheduled"
                  const canComplete = ["in-progress","confirmed","scheduled"].includes(appt.status)
                  return (
                    <tr key={appt.id} className="border-b border-[#f2f5f3] last:border-0 hover:bg-[#fafcfb] transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-[13px] font-semibold text-[#0e1a14]">{appt.time}</p>
                        <p className="text-[11px] text-[#6b7c72]">{appt.date}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[13px] font-medium text-[#0e1a14]">{appt.patientName}</p>
                        <p className="text-[11px] text-[#6b7c72]">{appt.patientEmail}</p>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-[#6b7c72]">{appt.specialty}</td>
                      <td className="py-3 px-4 text-[13px] font-semibold text-[#1D9E75]">{appt.price}</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDetail(appt)}
                            className="p-1.5 rounded-lg text-[#6b7c72] hover:text-[#378ADD] hover:bg-[#E6F1FB] transition-colors cursor-pointer"
                            aria-label="Ver detalhes"
                          >
                            <Eye size={14} />
                          </button>
                          {canConfirm && (
                            <button
                              onClick={() => handleStatus(appt.id, "confirmed")}
                              className="p-1.5 rounded-lg text-[#6b7c72] hover:text-[#1D9E75] hover:bg-[#E1F5EE] transition-colors cursor-pointer"
                              aria-label="Confirmar"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {canStart && (
                            <button
                              onClick={() => handleStatus(appt.id, "in-progress")}
                              className="p-1.5 rounded-lg text-[#6b7c72] hover:text-[#1D6A84] hover:bg-[#E3F4FA] transition-colors cursor-pointer"
                              aria-label="Iniciar atendimento"
                            >
                              <Play size={14} />
                            </button>
                          )}
                          {canComplete && (
                            <button
                              onClick={() => handleStatus(appt.id, "completed")}
                              className="p-1.5 rounded-lg text-[#6b7c72] hover:text-[#0F6E56] hover:bg-[#E1F5EE] transition-colors cursor-pointer"
                              aria-label="Finalizar"
                            >
                              ✓
                            </button>
                          )}
                          {!["completed","cancelled","no-show"].includes(appt.status) && (
                            <button
                              onClick={() => handleStatus(appt.id, "cancelled")}
                              className="p-1.5 rounded-lg text-[#6b7c72] hover:text-[#E24B4A] hover:bg-[#FCEBEB] transition-colors cursor-pointer"
                              aria-label="Cancelar"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <DetailModal
          appt={detail}
          onClose={() => setDetail(null)}
          onStatusChange={(id, s) => { handleStatus(id, s); setDetail(null) }}
          onNotesSave={handleNotes}
        />
      )}
    </div>
  )
}
