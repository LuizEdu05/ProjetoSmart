"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Users, CheckCircle, Clock, ArrowRight, AlertCircle } from "lucide-react"
import { useDoctorAuth } from "@/context/doctor-auth-context"
import { getAppointmentsByDoctor, type GlobalAppointment, type ApptStatus } from "@/lib/global-appointments"
import { getRecordsByDoctor } from "@/lib/medical-records-store"
import { STATUS_STYLE } from "@/lib/status-config"

function StatCard({ title, value, sub, Icon, color }: { title: string; value: number | string; sub?: string; Icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e8ede9]">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[13px] text-[#6b7c72] font-medium">{title}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "18" }}>
          <Icon size={18} style={{ color }} aria-hidden="true" />
        </div>
      </div>
      <p className="text-[32px] font-bold text-[#0e1a14] leading-none mb-1">{value}</p>
      {sub && <p className="text-[12px] text-[#6b7c72]">{sub}</p>}
    </div>
  )
}

export default function DoctorDashboard() {
  const { doctor } = useDoctorAuth()
  const router     = useRouter()
  const [appointments, setAppointments] = useState<GlobalAppointment[]>([])
  const [recordCount, setRecordCount]   = useState(0)

  useEffect(() => {
    if (!doctor) { router.replace("/doctor/login"); return }
    setAppointments(getAppointmentsByDoctor(doctor.professionalId))
    setRecordCount(getRecordsByDoctor(doctor.professionalId).length)
  }, [doctor, router])

  if (!doctor) return null

  const todayISO    = new Date().toISOString().slice(0, 10)
  const todayAppts  = appointments.filter(a => a.dateISO === todayISO)
  const upcoming    = appointments.filter(a => ["pending","scheduled","confirmed"].includes(a.status))
  const pending     = appointments.filter(a => a.status === "pending")
  const completed   = appointments.filter(a => a.status === "completed")

  // Unique patients
  const patientIds = [...new Set(appointments.map(a => a.patientId))]

  const now      = new Date()
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite"
  const weekday  = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"][now.getDay()]!

  return (
    <div className="p-7">
      {/* Header */}
      <div className="mb-7">
        <p className="text-[#6b7c72] text-[14px] mb-0.5">{greeting} — {weekday}</p>
        <h1 className="text-[28px] font-bold text-[#0e1a14]">{doctor.name}</h1>
        <p className="text-[14px] text-[#6b7c72]">{doctor.specialty} · {doctor.crm}</p>
      </div>

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className="bg-[#FEF3E2] border border-[#F6C86E] rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <AlertCircle size={20} className="text-[#EF9F27] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#633806]">
              {pending.length} consulta{pending.length > 1 ? "s" : ""} aguardando confirmação
            </p>
            <p className="text-[12px] text-[#854F0B]">Acesse Minha Agenda para confirmar ou recusar.</p>
          </div>
          <Link href="/doctor/agenda" className="text-[12px] text-[#EF9F27] hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0">
            Ver <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard title="Hoje"        value={todayAppts.length} sub="consultas marcadas"   Icon={Calendar}      color="#378ADD" />
        <StatCard title="Próximas"    value={upcoming.length}   sub="aguardando atend."    Icon={Clock}         color="#1D9E75" />
        <StatCard title="Pacientes"   value={patientIds.length} sub="pacientes atendidos"  Icon={Users}         color="#EF9F27" />
        <StatCard title="Prontuários" value={recordCount}       sub="registros criados"    Icon={CheckCircle}   color="#993556" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Today's appointments */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e8ede9] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f5f3]">
            <h2 className="font-semibold text-[#0e1a14] text-[15px]">Agenda de hoje</h2>
            <Link href="/doctor/agenda" className="text-[12px] text-[#378ADD] hover:underline flex items-center gap-1 cursor-pointer">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {todayAppts.length === 0 ? (
            <div className="text-center py-10 text-[#6b7c72]">
              <Calendar size={36} className="mx-auto mb-2 text-[#d9e3dd]" />
              <p className="text-[14px]">Nenhum agendamento para hoje.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f2f5f3]">
              {todayAppts.map(appt => {
                const s = STATUS_STYLE[appt.status]
                return (
                  <div key={appt.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafcfb] transition-colors">
                    <div className="text-[14px] font-bold text-[#0e1a14] w-14 flex-shrink-0">{appt.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] text-[#0e1a14] truncate">{appt.patientName}</p>
                      <p className="text-[12px] text-[#6b7c72]">{appt.specialty} · {appt.payment}</p>
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

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e8ede9] p-5">
            <h2 className="font-semibold text-[#0e1a14] text-[15px] mb-4">Resumo geral</h2>
            <div className="space-y-3">
              {[
                { label: "Pendentes",   count: pending.length,   color: "#EF9F27" },
                { label: "Confirmados", count: appointments.filter(a => a.status === "confirmed").length, color: "#1D9E75" },
                { label: "Realizados",  count: completed.length, color: "#6b7c72" },
                { label: "Cancelados",  count: appointments.filter(a => a.status === "cancelled").length, color: "#E24B4A" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6b7c72] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    {label}
                  </span>
                  <span className="text-[14px] font-semibold text-[#0e1a14]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0e1a14] rounded-2xl p-5">
            <h2 className="font-semibold text-white text-[14px] mb-1">Ações rápidas</h2>
            <p className="text-[#8fa398] text-[12px] mb-4">Acesse as áreas principais</p>
            <div className="space-y-2">
              <Link href="/doctor/agenda" className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/8 hover:bg-white/14 text-white text-[13px] transition-colors cursor-pointer">
                <span className="flex items-center gap-2"><Calendar size={14} /> Minha agenda</span>
                <ArrowRight size={12} />
              </Link>
              <Link href="/doctor/patients" className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/8 hover:bg-white/14 text-white text-[13px] transition-colors cursor-pointer">
                <span className="flex items-center gap-2"><Users size={14} /> Meus pacientes</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
