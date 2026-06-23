"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { getAllAppointments, type GlobalAppointment } from "@/lib/global-appointments"
import { getProfessionals } from "@/lib/clinic-store"

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9,]/g, "").replace(",", ".")) || 0
}

function StatCard({ label, value, sub, color, Icon, trend }: {
  label: string; value: string | number; sub?: string
  color: string; Icon: React.ElementType; trend?: "up" | "down"
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8ede9] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[13px] text-[#6b7c72] font-medium">{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "18" }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-[32px] font-bold text-[#0e1a14] leading-none mb-1">{value}</p>
      {sub && (
        <div className="flex items-center gap-1">
          {trend === "up" && <TrendingUp size={12} className="text-[#1D9E75]" />}
          {trend === "down" && <TrendingDown size={12} className="text-[#E24B4A]" />}
          <p className="text-[12px] text-[#6b7c72]">{sub}</p>
        </div>
      )}
    </div>
  )
}

function BarChart({ title, data }: { title: string; data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="bg-white rounded-2xl border border-[#e8ede9] p-5">
      <h3 className="font-semibold text-[15px] text-[#0e1a14] mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[12px] text-[#6b7c72] w-28 flex-shrink-0 truncate">{label}</span>
            <div className="flex-1 h-2 bg-[#f2f5f3] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
            </div>
            <span className="text-[12px] font-semibold text-[#0e1a14] w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniCalendar({ appointments, clinicId }: { appointments: GlobalAppointment[]; clinicId: string }) {
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  const counts: Record<string, number> = {}
  appointments.forEach(a => {
    const m = a.dateISO.slice(0, 7)
    counts[m] = (counts[m] ?? 0) + 1
  })
  const now = new Date()
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return { key, label: `${months[d.getMonth()]} ${d.getFullYear()}`, count: counts[key] ?? 0 }
  })
  const maxCount = Math.max(...last6.map(m => m.count), 1)

  return (
    <div className="bg-white rounded-2xl border border-[#e8ede9] p-5">
      <h3 className="font-semibold text-[15px] text-[#0e1a14] mb-4">Consultas por mês</h3>
      <div className="flex items-end gap-2 h-28">
        {last6.map(({ key, label, count }) => (
          <div key={key} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full rounded-t-lg transition-all duration-700" style={{
              height: `${(count / maxCount) * 80}px`,
              background: count === 0 ? "#f2f5f3" : "#1D9E75",
              minHeight: "4px",
            }} />
            <span className="text-[9px] text-[#6b7c72] text-center leading-tight">
              {label.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-2 mt-1">
        {last6.map(({ key, count }) => (
          <div key={key} className="flex-1 text-center">
            <span className="text-[10px] font-semibold text-[#0e1a14]">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ClinicAnalyticsPage() {
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

  const completed  = appointments.filter(a => a.status === "completed")
  const cancelled  = appointments.filter(a => a.status === "cancelled")
  const scheduled  = appointments.filter(a => a.status === "scheduled" || a.status === "confirmed")
  const revenue    = completed.reduce((s, a) => s + parsePrice(a.price), 0)
  const avgTicket  = completed.length > 0 ? revenue / completed.length : 0
  const cancelRate = appointments.length > 0 ? (cancelled.length / appointments.length) * 100 : 0

  // By specialty
  const specialtyMap: Record<string, { count: number; revenue: number }> = {}
  appointments.forEach(a => {
    const s = a.specialty
    if (!specialtyMap[s]) specialtyMap[s] = { count: 0, revenue: 0 }
    specialtyMap[s]!.count++
    if (a.status === "completed") specialtyMap[s]!.revenue += parsePrice(a.price)
  })
  const bySpecialty = Object.entries(specialtyMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([label, { count }]) => ({ label, value: count, color: "#1D9E75" }))

  // By doctor
  const doctorMap: Record<string, number> = {}
  appointments.forEach(a => { doctorMap[a.doctorName] = (doctorMap[a.doctorName] ?? 0) + 1 })
  const byDoctor = Object.entries(doctorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], i) => ({
      label: label.replace(/^Dr[a]?\. /, ""),
      value,
      color: ["#1D9E75","#378ADD","#EF9F27","#993556","#185FA5"][i] ?? "#1D9E75"
    }))

  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0e1a14]">Relatórios</h1>
        <p className="text-[14px] text-[#6b7c72]">Análise de desempenho da sua clínica</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Faturamento" value={`R$ ${revenue.toFixed(2).replace(".", ",")}`} sub="consultas realizadas" color="#1D9E75" Icon={DollarSign} trend="up" />
        <StatCard label="Total de consultas" value={appointments.length} sub={`${scheduled.length} aguardando`} color="#378ADD" Icon={Users} />
        <StatCard label="Ticket médio" value={`R$ ${avgTicket.toFixed(2).replace(".", ",")}`} sub={`${completed.length} realizadas`} color="#EF9F27" Icon={TrendingUp} />
        <StatCard label="Taxa de cancelamento" value={`${cancelRate.toFixed(1)}%`} sub={`${cancelled.length} canceladas`} color={cancelRate > 20 ? "#E24B4A" : "#6b7c72"} Icon={TrendingDown} trend={cancelRate > 20 ? "down" : undefined} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <MiniCalendar appointments={appointments} clinicId={clinic.clinicId} />
        <BarChart title="Consultas por especialidade" data={bySpecialty.length ? bySpecialty : [{ label: "Sem dados", value: 0, color: "#f2f5f3" }]} />
        <BarChart title="Consultas por médico" data={byDoctor.length ? byDoctor : [{ label: "Sem dados", value: 0, color: "#f2f5f3" }]} />
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-2xl border border-[#e8ede9] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f2f5f3]">
          <h3 className="font-semibold text-[15px] text-[#0e1a14]">Resumo por status</h3>
        </div>
        <div className="divide-y divide-[#f2f5f3]">
          {[
            { label: "Agendados",  count: appointments.filter(a => a.status === "scheduled").length, color: "#185FA5", bg: "#E6F1FB" },
            { label: "Confirmados",count: appointments.filter(a => a.status === "confirmed").length, color: "#0F6E56", bg: "#E1F5EE" },
            { label: "Realizados", count: completed.length,  color: "#6b7c72", bg: "#e8ede9" },
            { label: "Cancelados", count: cancelled.length,  color: "#791F1F", bg: "#FCEBEB" },
            { label: "Faltou",     count: appointments.filter(a => a.status === "no-show").length,  color: "#854F0B", bg: "#FEF3E2" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className="flex items-center px-5 py-3.5">
              <span className="text-[12px] font-medium px-2.5 py-1 rounded-lg mr-4" style={{ color, background: bg }}>{label}</span>
              <div className="flex-1 h-1.5 bg-[#f2f5f3] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${appointments.length ? (count / appointments.length) * 100 : 0}%`, background: color }} />
              </div>
              <span className="ml-4 text-[14px] font-bold text-[#0e1a14] w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
