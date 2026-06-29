"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, X, FileText, Pill, FlaskConical, ChevronDown, ChevronUp, Users } from "lucide-react"
import { useDoctorAuth } from "@/context/doctor-auth-context"
import { getAppointmentsByDoctor, type GlobalAppointment } from "@/lib/global-appointments"
import { getStatusStyle } from "@/lib/status-config"
import {
  getRecordsByDoctor,
  getPrescriptionsByDoctor,
  getExamsByDoctor,
  addMedicalRecord,
  addPrescription,
  addExamRequest,
  type MedicalRecord,
  type Prescription,
  type ExamRequest,
  type MedicationItem,
} from "@/lib/medical-records-store"

// ── Patient summary derived from appointments ─────────────────────────────────
interface PatientSummary {
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  appointmentCount: number
  lastDate: string
  appointments: GlobalAppointment[]
}

// ── Prontuário form ───────────────────────────────────────────────────────────
const EMPTY_RECORD = { chiefComplaint: "", history: "", physicalExam: "", diagnosis: "", treatment: "", observations: "" }

function RecordForm({ onSave, onCancel }: { onSave: (d: typeof EMPTY_RECORD) => void; onCancel: () => void }) {
  const [d, setD] = useState(EMPTY_RECORD)
  const set = (k: keyof typeof EMPTY_RECORD, v: string) => setD(prev => ({ ...prev, [k]: v }))

  const ta = "w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#378ADD] resize-none transition-colors"

  return (
    <div className="space-y-3 pt-1">
      {([
        ["chiefComplaint", "Queixa principal", 2],
        ["history",        "História da moléstia atual", 3],
        ["physicalExam",   "Exame físico", 3],
        ["diagnosis",      "Diagnóstico (CID opcional)", 2],
        ["treatment",      "Conduta / Tratamento", 3],
        ["observations",   "Observações gerais", 2],
      ] as const).map(([k, label, rows]) => (
        <div key={k}>
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1">{label}</label>
          <textarea value={d[k]} onChange={e => set(k, e.target.value)} rows={rows} className={ta} placeholder={label + "..."} />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(d)} className="flex-1 bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors cursor-pointer">
          Salvar prontuário
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border border-[#d9e3dd] rounded-xl text-[#6b7c72] text-[13px] transition-colors hover:border-[#378ADD] cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ── Prescription form ─────────────────────────────────────────────────────────
const EMPTY_MED: MedicationItem = { name: "", dosage: "", frequency: "", duration: "", notes: "" }

function PrescriptionForm({ onSave, onCancel }: { onSave: (meds: MedicationItem[], obs: string) => void; onCancel: () => void }) {
  const [meds, setMeds] = useState<MedicationItem[]>([{ ...EMPTY_MED }])
  const [obs, setObs]   = useState("")

  const inp = "w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-3 py-2 text-[12px] text-[#0e1a14] outline-none focus:border-[#378ADD] transition-colors"

  function updateMed(i: number, k: keyof MedicationItem, v: string) {
    setMeds(prev => prev.map((m, idx) => idx === i ? { ...m, [k]: v } : m))
  }

  return (
    <div className="space-y-3 pt-1">
      {meds.map((med, i) => (
        <div key={i} className="bg-[#f8faf9] rounded-xl p-3 relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-[#0e1a14]">Medicamento {i + 1}</p>
            {meds.length > 1 && (
              <button onClick={() => setMeds(prev => prev.filter((_, idx) => idx !== i))} className="text-[#E24B4A] text-[11px] cursor-pointer">
                Remover
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-1">Medicamento</label>
              <input value={med.name} onChange={e => updateMed(i, "name", e.target.value)} placeholder="Nimesulida 100mg" className={inp} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-1">Dosagem</label>
              <input value={med.dosage} onChange={e => updateMed(i, "dosage", e.target.value)} placeholder="1 comprimido" className={inp} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-1">Frequência</label>
              <input value={med.frequency} onChange={e => updateMed(i, "frequency", e.target.value)} placeholder="2x ao dia" className={inp} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-1">Duração</label>
              <input value={med.duration} onChange={e => updateMed(i, "duration", e.target.value)} placeholder="5 dias" className={inp} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-1">Observações</label>
              <input value={med.notes} onChange={e => updateMed(i, "notes", e.target.value)} placeholder="Tomar após refeição" className={inp} />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => setMeds(prev => [...prev, { ...EMPTY_MED }])}
        className="w-full py-2 border border-dashed border-[#d9e3dd] rounded-xl text-[12px] text-[#6b7c72] hover:border-[#378ADD] hover:text-[#378ADD] transition-colors cursor-pointer"
      >
        + Adicionar medicamento
      </button>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1">Observações gerais</label>
        <textarea value={obs} onChange={e => setObs(e.target.value)} rows={2}
          className="w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#378ADD] resize-none transition-colors"
          placeholder="Instruções adicionais..." />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(meds, obs)} className="flex-1 bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors cursor-pointer">
          Salvar receita
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border border-[#d9e3dd] rounded-xl text-[#6b7c72] text-[13px] transition-colors hover:border-[#378ADD] cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ── Exam form ─────────────────────────────────────────────────────────────────
function ExamForm({ onSave, onCancel }: { onSave: (exams: string[], urgency: "routine" | "urgent", indication: string) => void; onCancel: () => void }) {
  const [exams,      setExams]      = useState([""])
  const [urgency,    setUrgency]    = useState<"routine" | "urgent">("routine")
  const [indication, setIndication] = useState("")

  return (
    <div className="space-y-3 pt-1">
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">Exames solicitados</label>
        {exams.map((ex, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={ex}
              onChange={e => setExams(prev => prev.map((x, idx) => idx === i ? e.target.value : x))}
              placeholder="Hemograma completo"
              className="flex-1 border-[1.5px] border-[#d9e3dd] rounded-xl px-3.5 py-2 text-[13px] text-[#0e1a14] outline-none focus:border-[#378ADD] transition-colors"
            />
            {exams.length > 1 && (
              <button onClick={() => setExams(prev => prev.filter((_, idx) => idx !== i))} className="text-[#E24B4A] text-[11px] px-2 cursor-pointer">✕</button>
            )}
          </div>
        ))}
        <button
          onClick={() => setExams(prev => [...prev, ""])}
          className="text-[12px] text-[#378ADD] hover:underline cursor-pointer"
        >
          + Adicionar exame
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">Urgência</label>
        <div className="flex gap-2">
          {(["routine","urgent"] as const).map(u => (
            <button
              key={u}
              onClick={() => setUrgency(u)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-medium border-[1.5px] transition-colors cursor-pointer ${
                urgency === u
                  ? u === "urgent" ? "bg-[#FCEBEB] border-[#E24B4A] text-[#791F1F]" : "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56]"
                  : "bg-white border-[#d9e3dd] text-[#6b7c72]"
              }`}
            >
              {u === "routine" ? "Rotina" : "Urgente"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1">Indicação clínica</label>
        <textarea value={indication} onChange={e => setIndication(e.target.value)} rows={2}
          className="w-full border-[1.5px] border-[#d9e3dd] rounded-xl px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#378ADD] resize-none transition-colors"
          placeholder="Indicação clínica para os exames..." />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(exams.filter(Boolean), urgency, indication)} className="flex-1 bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors cursor-pointer">
          Salvar pedido
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border border-[#d9e3dd] rounded-xl text-[#6b7c72] text-[13px] hover:border-[#378ADD] transition-colors cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ── Patient detail panel ──────────────────────────────────────────────────────
function PatientDetail({
  patient,
  records,
  prescriptions,
  exams,
  onClose,
  onNewRecord,
  onNewPrescription,
  onNewExam,
}: {
  patient: PatientSummary
  records: MedicalRecord[]
  prescriptions: Prescription[]
  exams: ExamRequest[]
  onClose: () => void
  onNewRecord: (d: typeof EMPTY_RECORD) => void
  onNewPrescription: (meds: MedicationItem[], obs: string) => void
  onNewExam: (exams: string[], urgency: "routine" | "urgent", indication: string) => void
}) {
  type Tab = "records" | "prescriptions" | "exams" | "history"
  const [tab, setTab]               = useState<Tab>("records")
  const [addRecord, setAddRecord]   = useState(false)
  const [addRx, setAddRx]           = useState(false)
  const [addExam, setAddExam]       = useState(false)
  const [expandedRec, setExpandedRec] = useState<string | null>(null)

  const TABS = [
    { id: "records"       as Tab, label: "Prontuário",  Icon: FileText,    count: records.length },
    { id: "prescriptions" as Tab, label: "Receitas",    Icon: Pill,        count: prescriptions.length },
    { id: "exams"         as Tab, label: "Exames",      Icon: FlaskConical, count: exams.length },
    { id: "history"       as Tab, label: "Histórico",   Icon: Search,      count: patient.appointmentCount },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[680px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#f2f5f3] flex-shrink-0">
          <div>
            <h2 className="font-bold text-[18px] text-[#0e1a14]">{patient.patientName}</h2>
            <p className="text-[13px] text-[#6b7c72]">{patient.patientEmail} · {patient.patientPhone}</p>
            <p className="text-[12px] text-[#6b7c72] mt-0.5">{patient.appointmentCount} consulta{patient.appointmentCount > 1 ? "s" : ""} · Última: {patient.lastDate}</p>
          </div>
          <button onClick={onClose} className="text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer text-xl mt-0.5">✕</button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#f2f5f3] flex-shrink-0 overflow-x-auto">
          {TABS.map(({ id, label, Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                tab === id ? "border-[#378ADD] text-[#378ADD]" : "border-transparent text-[#6b7c72] hover:text-[#0e1a14]"
              }`}>
              <Icon size={14} />
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === id ? "bg-[#E6F1FB] text-[#378ADD]" : "bg-[#f2f5f3] text-[#6b7c72]"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── Prontuário tab ── */}
          {tab === "records" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#0e1a14]">Prontuário eletrônico</h3>
                <button
                  onClick={() => { setAddRecord(v => !v); setAddRx(false); setAddExam(false) }}
                  className="flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Nova entrada
                </button>
              </div>

              {addRecord && (
                <div className="bg-[#f8faf9] rounded-xl border border-[#d9e3dd] p-4">
                  <RecordForm
                    onSave={d => { onNewRecord(d); setAddRecord(false) }}
                    onCancel={() => setAddRecord(false)}
                  />
                </div>
              )}

              {records.length === 0 && !addRecord && (
                <div className="text-center py-10 text-[#6b7c72]">
                  <FileText size={32} className="mx-auto mb-2 text-[#d9e3dd]" />
                  <p className="text-[13px]">Nenhum prontuário registrado.</p>
                </div>
              )}

              {records.map(r => (
                <div key={r.id} className="bg-white border border-[#e8ede9] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedRec(expandedRec === r.id ? null : r.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#fafcfb] transition-colors cursor-pointer"
                  >
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-[#0e1a14]">{new Date(r.dateISO).toLocaleDateString("pt-BR")}</p>
                      <p className="text-[12px] text-[#6b7c72] truncate max-w-[300px]">{r.chiefComplaint || "Sem queixa registrada"}</p>
                    </div>
                    {expandedRec === r.id ? <ChevronUp size={16} className="text-[#6b7c72]" /> : <ChevronDown size={16} className="text-[#6b7c72]" />}
                  </button>
                  {expandedRec === r.id && (
                    <div className="border-t border-[#f2f5f3] px-4 py-4 space-y-3 text-[13px]">
                      {[
                        ["Queixa principal",            r.chiefComplaint],
                        ["História da moléstia",        r.history],
                        ["Exame físico",                r.physicalExam],
                        ["Diagnóstico",                 r.diagnosis],
                        ["Conduta / Tratamento",        r.treatment],
                        ["Observações",                 r.observations],
                      ].filter(([, v]) => v).map(([l, v]) => (
                        <div key={l}>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7c72] mb-0.5">{l}</p>
                          <p className="text-[#0e1a14] whitespace-pre-wrap">{v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Prescriptions tab ── */}
          {tab === "prescriptions" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#0e1a14]">Receitas médicas</h3>
                <button
                  onClick={() => { setAddRx(v => !v); setAddRecord(false); setAddExam(false) }}
                  className="flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Nova receita
                </button>
              </div>

              {addRx && (
                <div className="bg-[#f8faf9] rounded-xl border border-[#d9e3dd] p-4">
                  <PrescriptionForm
                    onSave={(meds, obs) => { onNewPrescription(meds, obs); setAddRx(false) }}
                    onCancel={() => setAddRx(false)}
                  />
                </div>
              )}

              {prescriptions.length === 0 && !addRx && (
                <div className="text-center py-10 text-[#6b7c72]">
                  <Pill size={32} className="mx-auto mb-2 text-[#d9e3dd]" />
                  <p className="text-[13px]">Nenhuma receita emitida.</p>
                </div>
              )}

              {prescriptions.map(rx => (
                <div key={rx.id} className="bg-white border border-[#e8ede9] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-semibold text-[#0e1a14]">{new Date(rx.dateISO).toLocaleDateString("pt-BR")}</p>
                    <span className="text-[11px] bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-full font-medium">{rx.medications.length} medicamento{rx.medications.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="space-y-2">
                    {rx.medications.map((m, i) => (
                      <div key={i} className="bg-[#f8faf9] rounded-lg p-2.5 text-[12px]">
                        <p className="font-semibold text-[#0e1a14]">{m.name}</p>
                        <p className="text-[#6b7c72]">{m.dosage} · {m.frequency} · {m.duration}</p>
                        {m.notes && <p className="text-[#6b7c72] italic">{m.notes}</p>}
                      </div>
                    ))}
                  </div>
                  {rx.observations && <p className="text-[12px] text-[#6b7c72] mt-2 italic">{rx.observations}</p>}
                </div>
              ))}
            </div>
          )}

          {/* ── Exams tab ── */}
          {tab === "exams" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#0e1a14]">Pedidos de exame</h3>
                <button
                  onClick={() => { setAddExam(v => !v); setAddRecord(false); setAddRx(false) }}
                  className="flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#2a6db3] text-white rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Novo pedido
                </button>
              </div>

              {addExam && (
                <div className="bg-[#f8faf9] rounded-xl border border-[#d9e3dd] p-4">
                  <ExamForm
                    onSave={(exms, urgency, indication) => { onNewExam(exms, urgency, indication); setAddExam(false) }}
                    onCancel={() => setAddExam(false)}
                  />
                </div>
              )}

              {exams.length === 0 && !addExam && (
                <div className="text-center py-10 text-[#6b7c72]">
                  <FlaskConical size={32} className="mx-auto mb-2 text-[#d9e3dd]" />
                  <p className="text-[13px]">Nenhum pedido de exame.</p>
                </div>
              )}

              {exams.map(ex => (
                <div key={ex.id} className="bg-white border border-[#e8ede9] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-semibold text-[#0e1a14]">{new Date(ex.dateISO).toLocaleDateString("pt-BR")}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${ex.urgency === "urgent" ? "bg-[#FCEBEB] text-[#791F1F]" : "bg-[#e8ede9] text-[#6b7c72]"}`}>
                      {ex.urgency === "urgent" ? "Urgente" : "Rotina"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {ex.exams.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-[#0e1a14]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#378ADD] flex-shrink-0" />
                        {e}
                      </div>
                    ))}
                  </div>
                  {ex.clinicalIndication && (
                    <p className="text-[12px] text-[#6b7c72] mt-2 italic">Indicação: {ex.clinicalIndication}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── History tab ── */}
          {tab === "history" && (
            <div className="space-y-2">
              <h3 className="text-[14px] font-semibold text-[#0e1a14] mb-3">Histórico de consultas</h3>
              {patient.appointments.map(appt => {
                const s = getStatusStyle(appt.status)
                return (
                  <div key={appt.id} className="flex items-center gap-3 bg-white border border-[#e8ede9] rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#0e1a14]">{appt.date} às {appt.time}</p>
                      <p className="text-[12px] text-[#6b7c72]">{appt.specialty} · {appt.price}</p>
                      {appt.doctorNotes && <p className="text-[12px] text-[#6b7c72] italic mt-0.5 truncate">{appt.doctorNotes}</p>}
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg flex-shrink-0" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DoctorPatientsPage() {
  const { doctor } = useDoctorAuth()
  const router     = useRouter()
  const [search, setSearch]           = useState("")
  const [patients, setPatients]       = useState<PatientSummary[]>([])
  const [records, setRecords]         = useState<MedicalRecord[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [exams, setExams]             = useState<ExamRequest[]>([])
  const [selected, setSelected]       = useState<PatientSummary | null>(null)

  const load = useCallback(() => {
    if (!doctor) return
    const appts = getAppointmentsByDoctor(doctor.professionalId)

    // Build patient summaries from appointments
    const map: Record<string, PatientSummary> = {}
    for (const a of appts) {
      if (!map[a.patientId]) {
        map[a.patientId] = {
          patientId:        a.patientId,
          patientName:      a.patientName,
          patientEmail:     a.patientEmail,
          patientPhone:     a.patientPhone,
          appointmentCount: 0,
          lastDate:         "",
          appointments:     [],
        }
      }
      map[a.patientId]!.appointmentCount++
      map[a.patientId]!.appointments.push(a)
      if (!map[a.patientId]!.lastDate || a.dateISO > map[a.patientId]!.lastDate) {
        map[a.patientId]!.lastDate = a.date
      }
    }
    setPatients(Object.values(map).sort((a, b) => b.lastDate.localeCompare(a.lastDate)))
    setRecords(getRecordsByDoctor(doctor.professionalId))
    setPrescriptions(getPrescriptionsByDoctor(doctor.professionalId))
    setExams(getExamsByDoctor(doctor.professionalId))
  }, [doctor])

  useEffect(() => {
    if (!doctor) { router.replace("/doctor/login"); return }
    load()
  }, [doctor, router, load])

  if (!doctor) return null

  const filtered = patients.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.patientName.toLowerCase().includes(q) || p.patientEmail.toLowerCase().includes(q)
  })

  function handleNewRecord(patientId: string, data: typeof EMPTY_RECORD) {
    const patient = patients.find(p => p.patientId === patientId)
    if (!patient) return
    addMedicalRecord({
      patientId,
      patientName:  patient.patientName,
      doctorId:     doctor!.professionalId,
      doctorName:   doctor!.name,
      clinicId:     doctor!.clinicId,
      clinicName:   "",
      dateISO:      new Date().toISOString().slice(0, 10),
      ...data,
    })
    load()
  }

  function handleNewPrescription(patientId: string, meds: MedicationItem[], obs: string) {
    const patient = patients.find(p => p.patientId === patientId)
    if (!patient) return
    addPrescription({
      patientId,
      patientName:  patient.patientName,
      doctorId:     doctor!.professionalId,
      doctorName:   doctor!.name,
      doctorCrm:    doctor!.crm,
      clinicId:     doctor!.clinicId,
      clinicName:   "",
      dateISO:      new Date().toISOString().slice(0, 10),
      medications:  meds,
      observations: obs,
    })
    load()
  }

  function handleNewExam(patientId: string, exms: string[], urgency: "routine" | "urgent", indication: string) {
    const patient = patients.find(p => p.patientId === patientId)
    if (!patient) return
    addExamRequest({
      patientId,
      patientName:       patient.patientName,
      doctorId:          doctor!.professionalId,
      doctorName:        doctor!.name,
      doctorCrm:         doctor!.crm,
      clinicId:          doctor!.clinicId,
      dateISO:           new Date().toISOString().slice(0, 10),
      exams:             exms,
      urgency,
      clinicalIndication: indication,
    })
    load()
  }

  const selectedRecords      = selected ? records.filter(r => r.patientId === selected.patientId) : []
  const selectedPrescriptions = selected ? prescriptions.filter(p => p.patientId === selected.patientId) : []
  const selectedExams         = selected ? exams.filter(e => e.patientId === selected.patientId) : []

  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0e1a14]">Meus Pacientes</h1>
        <p className="text-[14px] text-[#6b7c72]">{patients.length} paciente{patients.length !== 1 ? "s" : ""} atendido{patients.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7c72]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          type="search"
          placeholder="Buscar paciente..."
          className="w-full pl-9 pr-4 py-2.5 border border-[#d9e3dd] rounded-xl text-[13px] outline-none focus:border-[#378ADD] bg-white transition-colors"
        />
      </div>

      {/* Patient list */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 text-[#6b7c72]">
          <Users size={36} className="mx-auto mb-2 text-[#d9e3dd]" />
          <p className="text-[14px]">Nenhum paciente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(p => {
            const patientRecords  = records.filter(r => r.patientId === p.patientId)
            const patientRx       = prescriptions.filter(rx => rx.patientId === p.patientId)
            const patientExams    = exams.filter(e => e.patientId === p.patientId)
            return (
              <button
                key={p.patientId}
                onClick={() => setSelected(p)}
                className="bg-white border border-[#e8ede9] rounded-2xl p-4 text-left hover:border-[#378ADD] hover:shadow-[0_4px_20px_rgba(55,138,221,0.1)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F1FB] flex items-center justify-center text-[14px] font-bold text-[#378ADD] flex-shrink-0">
                    {p.patientName.split(" ").slice(0, 2).map(w => w[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[14px] text-[#0e1a14] truncate">{p.patientName}</p>
                    <p className="text-[12px] text-[#6b7c72] truncate">{p.patientEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#6b7c72]">
                  <span className="flex items-center gap-1"><Search size={10} /> {p.appointmentCount} consulta{p.appointmentCount > 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><FileText size={10} /> {patientRecords.length} prontuário{patientRecords.length !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Pill size={10} /> {patientRx.length} receita{patientRx.length !== 1 ? "s" : ""}</span>
                </div>
                <p className="text-[11px] text-[#6b7c72] mt-1.5">Última consulta: {p.lastDate || "—"}</p>
              </button>
            )
          })}
        </div>
      )}

      {/* Patient detail modal */}
      {selected && (
        <PatientDetail
          patient={selected}
          records={selectedRecords}
          prescriptions={selectedPrescriptions}
          exams={selectedExams}
          onClose={() => setSelected(null)}
          onNewRecord={d => handleNewRecord(selected.patientId, d)}
          onNewPrescription={(meds, obs) => handleNewPrescription(selected.patientId, meds, obs)}
          onNewExam={(exms, urgency, indication) => handleNewExam(selected.patientId, exms, urgency, indication)}
        />
      )}
    </div>
  )
}

