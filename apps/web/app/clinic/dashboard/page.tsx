"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { getAllAppointments, type GlobalAppointment, type ApptStatus } from "@/lib/global-appointments"
import { getProfessionals } from "@/lib/clinic-store"
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

export default function ClinicDashboard() {
  const { clinic } = useClinicAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<GlobalAppointment[]>([])
  const [profCount, setProfCount] = useState(0)

  useEffect(() => {
    if (!clinic) { router.replace("/clinic/login"); return }
    const all = getAllAppointments().filter(a => a.clinicId === clinic.clinicId)
    setAppointments(all)
    setProfCount(getProfessionals(clinic.clinicId).filter(p => p.active).length)
  }, [clinic, router])

  if (!clinic) return null

  const todayISO = new Date().toISOString().slice(0, 10)
  const todayAppts = appointments.filter(a => a.dateISO === todayISO)
  const upcoming   = appointments.filter(a => a.status === "scheduled" || a.status === "confirmed")
  const completed  = appointments.filter(a => a.status === "completed")
  const cancelled  = appointments.filter(a => a.status === "cancelled")

  const revenue = appointments
    .filter(a => a.status === "completed")
    .reduce((sum, a) => sum + (parseFloat(a.price.replace(/[^0-9,]/g, "").replace(",", ".")) || 0), 0)

  const recentAppts = [...appointments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  const now = new Date()
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite"
  const weekday = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"][now.getDay()]!

  return (
    <div className="p-7">
      {/* Header */}
      <div className="mb-7">
        <p className="text-[#6b7c72] text-[14px] mb-0.5">{greeting}, {clinic.ownerName.split(" ")[0]} — {weekday}</p>
        <h1 className="text-[28px] font-bold text-[#0e1a14]">{clinic.clinicName}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard title="Hoje" value={todayAppts.length} sub="consultas marcadas" Icon={Calendar} color="#1D9E75" />
        <StatCard title="Próximas" value={upcoming.length} sub="aguardando atendimento" Icon={Clock} color="#378ADD" />
        <StatCard title="Profissionais" value={profCount} sub="ativos na clínica" Icon={Users} color="#EF9F27" />
        <StatCard title="Faturamento" value={`R$ ${revenue.toFixed(2).replace(".", ",")}`} sub="consultas realizadas" Icon={TrendingUp} color="#1D9E75" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Today's appointments */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e8ede9] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f5f3]">
            <h2 className="font-semibold text-[#0e1a14] text-[15px]">Agendamentos de hoje</h2>
            <Link href="/clinic/appointments" className="text-[12px] text-[#1D9E75] hover:underline flex items-center gap-1 cursor-pointer">
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
                      <p className="text-[12px] text-[#6b7c72] truncate">{appt.doctorName} · {appt.specialty}</p>
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

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e8ede9] p-5">
            <h2 className="font-semibold text-[#0e1a14] text-[15px] mb-4">Resumo geral</h2>
            <div className="space-y-3">
              {[
                { label: "Confirmados", count: appointments.filter(a => a.status === "confirmed").length, Icon: CheckCircle, color: "#1D9E75" },
                { label: "Cancelados", count: cancelled.length, Icon: XCircle, color: "#E24B4A" },
                { label: "Aguardando", count: appointments.filter(a => a.status === "scheduled").length, Icon: AlertCircle, color: "#EF9F27" },
                { label: "Realizados", count: completed.length, Icon: CheckCircle, color: "#6b7c72" },
              ].map(({ label, count, Icon, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#6b7c72]">
                    <Icon size={14} style={{ color }} aria-hidden="true" />
                    {label}
                  </div>
                  <span className="text-[14px] font-semibold text-[#0e1a14]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0e1a14] rounded-2xl p-5">
            <h2 className="font-semibold text-white text-[14px] mb-1">Taxa de ocupação</h2>
            <p className="text-[#8fa398] text-[12px] mb-4">Baseada nos últimos 7 dias</p>
            {(() => {
              const total = appointments.length
              const pct = total === 0 ? 0 : Math.round((completed.length / Math.max(total, 1)) * 100)
              return (
                <>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-[40px] font-bold text-white leading-none">{pct}%</span>
                    <span className="text-[#1D9E75] text-[13px] mb-1">↑ vs. semana ant.</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1D9E75] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
