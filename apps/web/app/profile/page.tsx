"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  X,
  FileText,
  Pill,
  FlaskConical,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"
import { useRouter } from "next/navigation"
import type { Appointment } from "@/lib/auth-store"
import { getAppointmentById, getAllAppointments } from "@/lib/global-appointments"
import { getProfessionals } from "@/lib/clinic-store"
import {
  getRecordsByPatient,
  getPrescriptionsByPatient,
  getExamsByPatient,
  type MedicalRecord,
  type Prescription,
  type ExamRequest,
} from "@/lib/medical-records-store"

type Tab = "dashboard" | "appointments" | "prontuario" | "settings" | "notifications"

const TABS = [
  { id: "dashboard"    as Tab, label: "Painel",       Icon: LayoutDashboard },
  { id: "appointments" as Tab, label: "Consultas",    Icon: Calendar },
  { id: "prontuario"   as Tab, label: "Prontuário",   Icon: FileText },
  { id: "settings"     as Tab, label: "Dados",        Icon: Settings },
  { id: "notifications"as Tab, label: "Notificações", Icon: Bell },
]

const APPT_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "upcoming", label: "Próximas" },
  { id: "done", label: "Realizadas" },
  { id: "cancelled", label: "Canceladas" },
]

// ── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1D9E75] ${
        checked ? "bg-[#1D9E75]" : "bg-[#d9e3dd]"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

// ── Reschedule modal ─────────────────────────────────────────────────────────
function RescheduleModal({
  appt,
  onConfirm,
  onClose,
}: {
  appt: Appointment
  onConfirm: (date: string, dateISO: string, time: string) => void
  onClose: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])

  const globalAppt = getAppointmentById(appt.id)

  const DAYS = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toISOString().slice(0, 10)
  })

  const DAY_KEYS = ["dom","seg","ter","qua","qui","sex","sab"] as const
  const MONTHS   = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

  function fmtDay(iso: string) {
    const d = new Date(iso + "T12:00:00")
    return {
      wd:  ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]!,
      day: d.getDate(),
      mo:  MONTHS[d.getMonth()]!,
    }
  }

  function fmtLabel(iso: string) {
    const d = new Date(iso + "T12:00:00")
    return `${["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
  }

  function getSlots(iso: string): string[] {
    if (!globalAppt) return []
    const prof = getProfessionals(globalAppt.clinicId).find(p => p.id === globalAppt.doctorId)
    if (!prof) return []
    const dayKey = DAY_KEYS[new Date(iso + "T12:00:00").getDay()]!
    const slot   = prof.schedule[dayKey]
    if (!slot.active) return []
    const [sh, sm] = slot.start.split(":").map(Number)
    const [eh, em] = slot.end.split(":").map(Number)
    const allSlots: string[] = []
    for (let m = sh! * 60 + sm!; m + slot.interval <= eh! * 60 + em!; m += slot.interval) {
      allSlots.push(`${String(Math.floor(m / 60)).padStart(2,"0")}:${String(m % 60).padStart(2,"0")}`)
    }
    const booked = getAllAppointments()
      .filter(a => a.doctorId === globalAppt.doctorId && a.dateISO === iso && a.id !== appt.id && a.status !== "cancelled")
      .map(a => a.time)
    return allSlots.filter(s => !booked.includes(s))
  }

  function pickDate(iso: string) {
    setSelectedDate(iso)
    setSelectedTime(null)
    setSlots(getSlots(iso))
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-[500px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f2f5f3]">
          <h2 className="font-bold text-[17px] text-[#0e1a14]">Reagendar consulta</h2>
          <button onClick={onClose} className="text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer text-lg">✕</button>
        </div>

        <div className="p-5">
          <div className="bg-[#f8faf9] rounded-xl px-4 py-3 mb-5 text-[13px]">
            <p className="font-semibold text-[#0e1a14]">{appt.doctor} · {appt.clinic}</p>
            <p className="text-[#6b7c72]">Atual: {appt.date} às {appt.time}</p>
          </div>

          <p className="text-[13px] font-semibold text-[#2a3d33] mb-2">Escolha uma nova data</p>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
            {DAYS.map(iso => {
              const { wd, day, mo } = fmtDay(iso)
              const hasSlots = getSlots(iso).length > 0
              return (
                <button key={iso} onClick={() => hasSlots && pickDate(iso)} disabled={!hasSlots}
                  className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border-2 transition-all min-w-[60px] text-center ${
                    selectedDate === iso
                      ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                      : hasSlots
                        ? "bg-white border-[#d9e3dd] text-[#0e1a14] hover:border-[#1D9E75] cursor-pointer"
                        : "bg-[#f8faf9] border-[#f2f5f3] text-[#d9e3dd] cursor-not-allowed"
                  }`}>
                  <span className="text-[9px] font-semibold uppercase">{wd}</span>
                  <span className="text-[18px] font-bold leading-tight">{day}</span>
                  <span className="text-[9px]">{mo}</span>
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <>
              <p className="text-[13px] font-semibold text-[#2a3d33] mb-2">Horários disponíveis — {fmtLabel(selectedDate)}</p>
              {slots.length === 0 ? (
                <p className="text-[13px] text-[#6b7c72] py-2">Nenhum horário disponível nesta data.</p>
              ) : (
                <div className="grid grid-cols-5 gap-1.5 mb-5">
                  {slots.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-[13px] font-semibold border-2 transition-all cursor-pointer ${
                        selectedTime === t
                          ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                          : "bg-white border-[#d9e3dd] text-[#0e1a14] hover:border-[#1D9E75]"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-[#d9e3dd] rounded-xl text-[14px] text-[#6b7c72] hover:border-[#1D9E75] hover:text-[#0e1a14] transition-colors cursor-pointer">
              Cancelar
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => { if (selectedDate && selectedTime) onConfirm(fmtLabel(selectedDate), selectedDate, selectedTime) }}
              className="flex-1 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-[14px] font-semibold transition-colors cursor-pointer">
              Confirmar reagendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Appointment card ─────────────────────────────────────────────────────────
const GLOBAL_STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:     { label: "Pendente",     bg: "#FEF3E2", color: "#633806" },
  scheduled:   { label: "Agendada",    bg: "#E1F5EE", color: "#0F6E56" },
  confirmed:   { label: "Confirmada",  bg: "#E6F1FB", color: "#185FA5" },
  rescheduled: { label: "Reagendada",  bg: "#EEEDFE", color: "#3C3489" },
  "in-progress":{ label: "Em andamento",bg:"#FEF3E2", color: "#633806" },
  completed:   { label: "Realizada",   bg: "#e8ede9", color: "#6b7c72" },
  cancelled:   { label: "Cancelada",   bg: "#FCEBEB", color: "#791F1F" },
  "no-show":   { label: "Não compareceu",bg:"#FCEBEB",color: "#791F1F" },
  upcoming:    { label: "Próxima",     bg: "#E1F5EE", color: "#0F6E56" },
  done:        { label: "Realizada",   bg: "#e8ede9", color: "#6b7c72" },
}

function ApptCard({
  appt,
  onCancel,
  onReschedule,
}: {
  appt: Appointment
  onCancel: (id: string) => void
  onReschedule: (appt: Appointment) => void
}) {
  const globalAppt = getAppointmentById(appt.id)
  const effectiveStatus = globalAppt?.status ?? appt.status
  const s = GLOBAL_STATUS_MAP[effectiveStatus] ?? GLOBAL_STATUS_MAP["upcoming"]!
  const canAct = !["completed","cancelled","no-show","done"].includes(effectiveStatus)

  return (
    <article className="bg-white border border-[#d9e3dd] rounded-2xl px-5 py-4 mb-3 grid grid-cols-[1fr_auto] items-center gap-4 hover:border-[#0F6E56] hover:shadow-[0_4px_24px_rgba(14,26,20,0.08)] transition-all duration-200">
      <div>
        <h3 className="text-[16px] font-bold text-[#0e1a14] mb-0.5">
          {appt.clinic}
        </h3>
        <p className="text-[13px] text-[#6b7c72] mb-2">
          {appt.doctor} · {appt.specialty}
        </p>
        <div className="flex flex-wrap gap-2">
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
            style={{ background: s.bg, color: s.color }}
          >
            {s.label}
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#f2f5f3] text-[#6b7c72]">
            {appt.date} · {appt.time}
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#f2f5f3] text-[#6b7c72]">
            {appt.payment}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[20px] font-bold text-[#1D9E75] mb-2">
          {appt.price}
        </div>
        {canAct && (
          <div className="flex flex-col gap-1.5 items-end">
            <button
              onClick={() => onReschedule(appt)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[#d9e3dd] text-[#185FA5] bg-[#E6F1FB] hover:bg-[#185FA5] hover:text-white hover:border-[#185FA5] transition-all duration-200 cursor-pointer"
            >
              Reagendar
            </button>
            <button
              onClick={() => onCancel(appt.id)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[#F7C1C1] text-[#E24B4A] bg-[#FCEBEB] hover:bg-[#E24B4A] hover:text-white hover:border-[#E24B4A] transition-all duration-200 cursor-pointer flex items-center gap-1"
            >
              <X size={12} />
              Cancelar
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

// ── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, updateUser, cancelAppt, rescheduleAppt } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const [activeTab, setActiveTab]   = useState<Tab>("dashboard")
  const [apptFilter, setApptFilter] = useState("all")
  const [expandedRec, setExpandedRec] = useState<string | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null)

  // Medical records (read-only for patient)
  const patientRecords      = user ? getRecordsByPatient(user.id)       : []
  const patientPrescriptions = user ? getPrescriptionsByPatient(user.id) : []
  const patientExams         = user ? getExamsByPatient(user.id)         : []

  const DEFAULT_NOTIF = {
    email: true, sms: true, whatsapp: false, push: true,
    week: false, day: true, twoHours: true, thirtyMin: false,
    promos: false, reviews: true,
  }
  const [notifSettings, setNotifSettings] = useState(DEFAULT_NOTIF)

  useEffect(() => {
    if (!user) return
    try {
      const saved = localStorage.getItem(`sc_notif_${user.id}`)
      if (saved) setNotifSettings(JSON.parse(saved))
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" })
  const [pwdError, setPwdError] = useState("")
  const [pwdSaved, setPwdSaved] = useState(false)

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cpf: user?.cpf || "",
    healthPlan: user?.healthPlan || "",
  })

  if (!user) {
    return (
      <div className="min-h-screen pt-[66px] flex items-center justify-center text-[#6b7c72]">
        <div className="text-center">
          <p className="text-lg mb-2">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  const appointments = user.appointments || []
  const filtered =
    apptFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === apptFilter)

  const upcoming = appointments.filter((a) => a.status === "upcoming")
  const done = appointments.filter((a) => a.status === "done")
  const nextAppt = upcoming[0]

  function saveProfile() {
    updateUser({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone,
      cpf: profileForm.cpf,
      healthPlan: profileForm.healthPlan,
    })
    showToast("✅ Dados salvos com sucesso!")
  }

  function toggleNotif(key: keyof typeof notifSettings) {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const inputClass =
    "w-full border-[1.5px] border-[#d9e3dd] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors duration-200 bg-white"
  const labelClass =
    "block text-[12px] font-medium text-[#2a3d33] mb-1.5"

  return (
    <main className="min-h-screen pt-[66px]">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar */}
          <aside className="bg-white border border-[#d9e3dd] rounded-[20px] p-6 lg:sticky lg:top-[90px]">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[28px] font-bold mx-auto mb-3"
              style={{ background: user.color }}
              aria-hidden="true"
            >
              {(user.firstName[0] || "").toUpperCase()}
            </div>
            <h1 className="text-[18px] font-bold text-[#0e1a14] text-center mb-0.5">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-[13px] text-[#6b7c72] text-center mb-5">
              {user.email}
            </p>

            <nav
              className="flex flex-col gap-1 mb-4"
              aria-label="Menu do perfil"
            >
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 cursor-pointer w-full text-left ${
                    activeTab === id
                      ? "bg-[#E1F5EE] text-[#0F6E56]"
                      : "text-[#6b7c72] hover:bg-[#f2f5f3] hover:text-[#0e1a14]"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                  {activeTab === id && (
                    <ChevronRight size={14} className="ml-auto" aria-hidden="true" />
                  )}
                </button>
              ))}
            </nav>

            <button
              onClick={() => { logout(); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#6b7c72] hover:bg-[#f2f5f3] hover:text-[#0e1a14] transition-colors cursor-pointer"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </aside>

          {/* Main content */}
          <div>
            {/* ── Dashboard tab ── */}
            {activeTab === "dashboard" && (
              <section aria-labelledby="dashboard-heading">
                <h2
                  id="dashboard-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Olá, {user.firstName}!
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-6">
                  Bem-vindo ao seu painel de saúde.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { n: appointments.length, l: "Consultas totais" },
                    { n: upcoming.length, l: "Próximas" },
                    { n: done.length, l: "Realizadas" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="bg-white border border-[#d9e3dd] rounded-2xl p-4 text-center"
                    >
                      <div className="text-[28px] font-bold text-[#1D9E75]">
                        {s.n}
                      </div>
                      <div className="text-[12px] text-[#6b7c72] mt-0.5">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5 mb-4">
                  <h3 className="text-[15px] font-semibold text-[#0e1a14] mb-4 pb-3 border-b border-[#e8ede9]">
                    Próxima consulta
                  </h3>
                  {nextAppt ? (
                    <div>
                      <div className="text-[16px] font-bold text-[#0e1a14] mb-1">
                        {nextAppt.clinic}
                      </div>
                      <div className="text-[13px] text-[#6b7c72] mb-2">
                        {nextAppt.doctor} · {nextAppt.date} às {nextAppt.time}
                      </div>
                      {(() => {
                        const g = getAppointmentById(nextAppt.id)
                        const st = GLOBAL_STATUS_MAP[g?.status ?? nextAppt.status] ?? GLOBAL_STATUS_MAP["upcoming"]!
                        return (
                          <span
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                            style={{ background: st.bg, color: st.color }}
                          >
                            {st.label}
                          </span>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6b7c72]">
                      <Calendar
                        size={36}
                        className="mx-auto mb-2 text-[#d9e3dd]"
                      />
                      <p className="text-[14px] mb-3">
                        Nenhuma consulta agendada.
                      </p>
                      <button
                        onClick={() => router.push("/buscar")}
                        className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-4 py-2 rounded-xl text-[13px] font-medium transition-colors cursor-pointer"
                      >
                        Agendar agora
                      </button>
                    </div>
                  )}
                </div>

                {appointments.length > 0 && (
                  <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5">
                    <h3 className="text-[15px] font-semibold text-[#0e1a14] mb-4 pb-3 border-b border-[#e8ede9]">
                      Atividade recente
                    </h3>
                    {appointments.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="flex justify-between items-center py-2.5 border-b border-[#f2f5f3] last:border-0 text-[13px]"
                      >
                        <div>
                          <span className="font-medium text-[#0e1a14]">
                            {a.clinic}
                          </span>
                          <span className="text-[#6b7c72]"> · {a.date}</span>
                        </div>
                        <span className="text-[#1D9E75] font-medium">
                          {a.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Appointments tab ── */}
            {activeTab === "appointments" && (
              <section aria-labelledby="appts-heading">
                <h2
                  id="appts-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Minhas Consultas
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Histórico completo de agendamentos.
                </p>

                <div
                  className="flex gap-2 flex-wrap mb-5"
                  role="group"
                  aria-label="Filtrar consultas"
                >
                  {APPT_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setApptFilter(f.id)}
                      aria-pressed={apptFilter === f.id}
                      className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer border ${
                        apptFilter === f.id
                          ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                          : "bg-white border-[#d9e3dd] text-[#6b7c72] hover:border-[#1D9E75] hover:text-[#1D9E75]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-14 text-[#6b7c72]">
                    <Calendar
                      size={48}
                      className="mx-auto mb-3 text-[#d9e3dd]"
                    />
                    <p className="text-[15px]">Nenhuma consulta encontrada.</p>
                  </div>
                ) : (
                  filtered.map((a) => (
                    <ApptCard
                      key={a.id}
                      appt={a}
                      onCancel={(id) => {
                        cancelAppt(id)
                        showToast("Consulta cancelada.")
                      }}
                      onReschedule={(appt) => setRescheduleTarget(appt)}
                    />
                  ))
                )}
              </section>
            )}

            {/* ── Prontuário tab ── */}
            {activeTab === "prontuario" && (
              <section aria-labelledby="prontuario-heading">
                <h2 id="prontuario-heading" className="text-[24px] font-bold text-[#0e1a14] mb-0.5">
                  Meu Prontuário
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Histórico médico registrado pelos seus médicos.
                </p>

                {patientRecords.length === 0 && patientPrescriptions.length === 0 && patientExams.length === 0 ? (
                  <div className="text-center py-14 text-[#6b7c72]">
                    <FileText size={48} className="mx-auto mb-3 text-[#d9e3dd]" />
                    <p className="text-[15px]">Nenhum registro médico encontrado.</p>
                    <p className="text-[13px] mt-1">Após suas consultas, o médico registrará informações aqui.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Prontuários */}
                    {patientRecords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText size={16} className="text-[#378ADD]" />
                          <h3 className="text-[15px] font-semibold text-[#0e1a14]">Prontuários ({patientRecords.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {patientRecords.map(r => (
                            <div key={r.id} className="bg-white border border-[#d9e3dd] rounded-2xl overflow-hidden">
                              <button
                                onClick={() => setExpandedRec(expandedRec === r.id ? null : r.id)}
                                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#fafcfb] transition-colors cursor-pointer"
                              >
                                <div className="text-left">
                                  <p className="text-[13px] font-semibold text-[#0e1a14]">
                                    {new Date(r.dateISO).toLocaleDateString("pt-BR")} — {r.doctorName}
                                  </p>
                                  <p className="text-[12px] text-[#6b7c72] truncate max-w-[280px]">
                                    {r.chiefComplaint || "Consulta registrada"}
                                  </p>
                                </div>
                                {expandedRec === r.id
                                  ? <ChevronUp size={16} className="text-[#6b7c72] flex-shrink-0" />
                                  : <ChevronDown size={16} className="text-[#6b7c72] flex-shrink-0" />
                                }
                              </button>
                              {expandedRec === r.id && (
                                <div className="border-t border-[#e8ede9] px-5 py-4 space-y-3 text-[13px]">
                                  {[
                                    ["Queixa principal",      r.chiefComplaint],
                                    ["História",              r.history],
                                    ["Exame físico",          r.physicalExam],
                                    ["Diagnóstico",           r.diagnosis],
                                    ["Conduta / Tratamento",  r.treatment],
                                    ["Observações",           r.observations],
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
                      </div>
                    )}

                    {/* Receitas */}
                    {patientPrescriptions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Pill size={16} className="text-[#1D9E75]" />
                          <h3 className="text-[15px] font-semibold text-[#0e1a14]">Receitas ({patientPrescriptions.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {patientPrescriptions.map(rx => (
                            <div key={rx.id} className="bg-white border border-[#d9e3dd] rounded-2xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-[13px] font-semibold text-[#0e1a14]">{new Date(rx.dateISO).toLocaleDateString("pt-BR")}</p>
                                  <p className="text-[12px] text-[#6b7c72]">{rx.doctorName} · {rx.doctorCrm}</p>
                                </div>
                                <span className="text-[11px] bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-full font-medium">
                                  {rx.medications.length} medicamento{rx.medications.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="space-y-1.5">
                                {rx.medications.map((m, i) => (
                                  <div key={i} className="bg-[#f8faf9] rounded-lg px-3 py-2 text-[12px]">
                                    <span className="font-semibold text-[#0e1a14]">{m.name}</span>
                                    <span className="text-[#6b7c72]"> — {m.dosage}, {m.frequency}, {m.duration}</span>
                                    {m.notes && <p className="text-[#6b7c72] italic">{m.notes}</p>}
                                  </div>
                                ))}
                              </div>
                              {rx.observations && <p className="text-[12px] text-[#6b7c72] mt-2 italic">{rx.observations}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exames */}
                    {patientExams.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FlaskConical size={16} className="text-[#EF9F27]" />
                          <h3 className="text-[15px] font-semibold text-[#0e1a14]">Pedidos de exame ({patientExams.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {patientExams.map(ex => (
                            <div key={ex.id} className="bg-white border border-[#d9e3dd] rounded-2xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="text-[13px] font-semibold text-[#0e1a14]">{new Date(ex.dateISO).toLocaleDateString("pt-BR")}</p>
                                  <p className="text-[12px] text-[#6b7c72]">{ex.doctorName} · {ex.doctorCrm}</p>
                                </div>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${ex.urgency === "urgent" ? "bg-[#FCEBEB] text-[#791F1F]" : "bg-[#e8ede9] text-[#6b7c72]"}`}>
                                  {ex.urgency === "urgent" ? "Urgente" : "Rotina"}
                                </span>
                              </div>
                              <div className="space-y-1">
                                {ex.exams.map((e, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[12px] text-[#0e1a14]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF9F27] flex-shrink-0" />
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
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ── Settings tab ── */}
            {activeTab === "settings" && (
              <section aria-labelledby="settings-heading">
                <h2
                  id="settings-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Meus Dados
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Gerencie suas informações pessoais.
                </p>

                <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5 mb-4">
                  <h3 className="text-[15px] font-semibold text-[#0e1a14] pb-3 mb-4 border-b border-[#e8ede9]">
                    Informações pessoais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "pf-first", label: "Nome", key: "firstName", type: "text", auto: "given-name" },
                      { id: "pf-last", label: "Sobrenome", key: "lastName", type: "text", auto: "family-name" },
                      { id: "pf-email", label: "E-mail", key: "email", type: "email", auto: "email", disabled: true },
                      { id: "pf-phone", label: "Telefone", key: "phone", type: "tel", auto: "tel", placeholder: "(47) 99999-9999" },
                      { id: "pf-cpf", label: "CPF", key: "cpf", type: "text", placeholder: "000.000.000-00" },
                      { id: "pf-plan", label: "Convênio", key: "healthPlan", type: "text", placeholder: "Particular / Nome do plano" },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className={labelClass}>
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={(profileForm as any)[field.key]}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          placeholder={(field as any).placeholder}
                          autoComplete={(field as any).auto}
                          disabled={(field as any).disabled}
                          className={
                            inputClass +
                            ((field as any).disabled
                              ? " opacity-60 cursor-not-allowed"
                              : "")
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={saveProfile}
                    className="mt-5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
                  >
                    Salvar alterações
                  </button>
                </div>

                <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5">
                  <h3 className="text-[15px] font-semibold text-[#0e1a14] pb-3 mb-4 border-b border-[#e8ede9]">
                    Segurança
                  </h3>
                  {pwdError && (
                    <div className="bg-[#FCEBEB] text-[#791F1F] rounded-lg px-3 py-2.5 text-[13px] mb-4">
                      {pwdError}
                    </div>
                  )}
                  {([
                    ["current", "Senha atual",          pwdForm.current],
                    ["next",    "Nova senha",            pwdForm.next],
                    ["confirm", "Confirmar nova senha",  pwdForm.confirm],
                  ] as const).map(([k, lbl, val]) => (
                    <div key={k} className="mb-3">
                      <label htmlFor={`pass-${k}`} className={labelClass}>{lbl}</label>
                      <input
                        id={`pass-${k}`}
                        type="password"
                        value={val}
                        onChange={e => { setPwdForm(p => ({ ...p, [k]: e.target.value })); setPwdError("") }}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setPwdError("")
                      if (!user) return
                      if (pwdForm.current !== user.password) { setPwdError("Senha atual incorreta."); return }
                      if (pwdForm.next.length < 6) { setPwdError("Nova senha deve ter ao menos 6 caracteres."); return }
                      if (pwdForm.next !== pwdForm.confirm) { setPwdError("As senhas não conferem."); return }
                      updateUser({ password: pwdForm.next })
                      setPwdForm({ current: "", next: "", confirm: "" })
                      setPwdSaved(true)
                      setTimeout(() => setPwdSaved(false), 2500)
                      showToast("✅ Senha alterada com sucesso!")
                    }}
                    className={`px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors cursor-pointer ${
                      pwdSaved ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-[#1D9E75] hover:bg-[#0F6E56] text-white"
                    }`}
                  >
                    {pwdSaved ? "Senha alterada!" : "Alterar senha"}
                  </button>
                </div>
              </section>
            )}

            {/* ── Notifications tab ── */}
            {activeTab === "notifications" && (
              <section aria-labelledby="notif-heading">
                <h2
                  id="notif-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Notificações
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Configure como quer receber seus lembretes.
                </p>

                {[
                  {
                    title: "Canais de notificação",
                    items: [
                      { key: "email", label: "E-mail", desc: "Confirmações e lembretes por e-mail" },
                      { key: "sms", label: "SMS", desc: "Mensagem de texto no celular cadastrado" },
                      { key: "whatsapp", label: "WhatsApp", desc: "Mensagem via WhatsApp Business" },
                      { key: "push", label: "Push (navegador)", desc: "Notificações diretas no navegador" },
                    ],
                  },
                  {
                    title: "Antecedência dos lembretes",
                    items: [
                      { key: "week", label: "1 semana antes", desc: "Lembrete semanal da consulta agendada" },
                      { key: "day", label: "1 dia antes", desc: "Lembrete na véspera da consulta" },
                      { key: "twoHours", label: "2 horas antes", desc: "Lembrete de última hora" },
                      { key: "thirtyMin", label: "30 minutos antes", desc: "Aviso de que a consulta está próxima" },
                    ],
                  },
                  {
                    title: "Outras notificações",
                    items: [
                      { key: "promos", label: "Promoções e novidades", desc: "Receba ofertas de clínicas parceiras" },
                      { key: "reviews", label: "Avaliações", desc: "Lembrete para avaliar consultas realizadas" },
                    ],
                  },
                ].map((group) => (
                  <div
                    key={group.title}
                    className="bg-white border border-[#d9e3dd] rounded-2xl p-5 mb-4"
                  >
                    <h3 className="text-[15px] font-semibold text-[#0e1a14] pb-3 mb-2 border-b border-[#e8ede9]">
                      {group.title}
                    </h3>
                    {group.items.map(({ key, label, desc }) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3.5 border-b border-[#f2f5f3] last:border-0"
                      >
                        <div>
                          <label
                            htmlFor={`notif-${key}`}
                            className="text-[14px] font-medium text-[#0e1a14] block cursor-pointer"
                          >
                            {label}
                          </label>
                          <p className="text-[12px] text-[#6b7c72]">{desc}</p>
                        </div>
                        <Toggle
                          id={`notif-${key}`}
                          checked={notifSettings[key as keyof typeof notifSettings]}
                          onChange={() =>
                            toggleNotif(key as keyof typeof notifSettings)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => {
                    if (!user) return
                    try { localStorage.setItem(`sc_notif_${user.id}`, JSON.stringify(notifSettings)) } catch {}
                    showToast("✅ Preferências salvas!")
                  }}
                  className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-6 py-2.5 rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
                >
                  Salvar preferências
                </button>
              </section>
            )}
          </div>
        </div>
      </div>

      {rescheduleTarget && (
        <RescheduleModal
          appt={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onConfirm={(date, dateISO, time) => {
            rescheduleAppt(rescheduleTarget.id, date, dateISO, time)
            setRescheduleTarget(null)
            showToast("✅ Consulta reagendada com sucesso!")
          }}
        />
      )}
    </main>
  )
}
