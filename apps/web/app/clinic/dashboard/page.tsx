"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useClinicAuth } from "@/context/clinic-auth-context"
import { getAllAppointments, type GlobalAppointment } from "@/lib/global-appointments"
import { getProfessionals } from "@/lib/clinic-store"
import { STATUS_STYLE } from "@/lib/status-config"

function StatCard({
  title, value, sub, Icon, color, delay = 0,
}: {
  title: string; value: number | string; sub?: string; Icon: React.ElementType; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" as const }}
      className="bg-white rounded-2xl p-5 border border-[#e8ede9] hover:border-[#1D9E75]/30 hover:shadow-sm transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[13px] text-[#6b7c72] font-medium">{title}</p>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.18, type: "spring", stiffness: 220, damping: 14 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          style={{ background: color + "18" }}
        >
          <Icon size={18} style={{ color }} aria-hidden="true" />
        </motion.div>
      </div>
      <p className="text-[32px] font-bold text-[#0e1a14] leading-none mb-1">{value}</p>
      {sub && <p className="text-[12px] text-[#6b7c72]">{sub}</p>}
    </motion.div>
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

  const todayISO  = new Date().toISOString().slice(0, 10)
  const todayAppts = appointments.filter(a => a.dateISO === todayISO)
  const upcoming   = appointments.filter(a => a.status === "scheduled" || a.status === "confirmed")
  const completed  = appointments.filter(a => a.status === "completed")
  const cancelled  = appointments.filter(a => a.status === "cancelled")

  const revenue = appointments
    .filter(a => a.status === "completed")
    .reduce((sum, a) => sum + (parseFloat(a.price.replace(/[^0-9,]/g, "").replace(",", ".")) || 0), 0)

  const now      = new Date()
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite"
  const weekday  = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"][now.getDay()]!

  const pct = appointments.length === 0 ? 0 : Math.round((completed.length / Math.max(appointments.length, 1)) * 100)
  const pendingToday = todayAppts.filter(a => a.status === "scheduled")

  return (
    <div className="p-7">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" as const }}
        className="mb-7"
      >
        <p className="text-[#6b7c72] text-[14px] mb-0.5">{greeting}, {clinic.ownerName.split(" ")[0]} — {weekday}</p>
        <h1 className="text-[28px] font-bold text-[#0e1a14]">{clinic.clinicName}</h1>
      </motion.div>

      {/* Pending alert */}
      <AnimatePresence>
        {pendingToday.length > 0 && (
          <motion.div
            key="pending-alert"
            initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-[#FEF3E2] border border-[#F6C86E] rounded-2xl px-5 py-3.5 flex items-center gap-3 overflow-hidden"
          >
            <AlertCircle size={18} className="text-[#EF9F27] flex-shrink-0" />
            <p className="text-[13px] text-[#633806] flex-1">
              {pendingToday.length} consulta{pendingToday.length > 1 ? "s" : ""} aguardando confirmação hoje
            </p>
            <Link href="/clinic/appointments" className="text-[12px] text-[#EF9F27] hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer">
              Ver <ArrowRight size={12} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard title="Hoje"          value={todayAppts.length}                                  sub="consultas marcadas"     Icon={Calendar}    color="#1D9E75" delay={0.05} />
        <StatCard title="Próximas"      value={upcoming.length}                                    sub="aguardando atendimento" Icon={Clock}        color="#378ADD" delay={0.12} />
        <StatCard title="Profissionais" value={profCount}                                          sub="ativos na clínica"      Icon={Users}        color="#EF9F27" delay={0.19} />
        <StatCard title="Faturamento"   value={`R$ ${revenue.toFixed(2).replace(".", ",")}`}       sub="consultas realizadas"   Icon={TrendingUp}   color="#1D9E75" delay={0.26} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Today's appointments */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" as const }}
          className="xl:col-span-2 bg-white rounded-2xl border border-[#e8ede9] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f5f3]">
            <div className="flex items-center gap-2.5">
              <h2 className="font-semibold text-[#0e1a14] text-[15px]">Agendamentos de hoje</h2>
              {todayAppts.length > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D9E75]" />
                </span>
              )}
            </div>
            <Link href="/clinic/appointments" className="text-[12px] text-[#1D9E75] hover:underline flex items-center gap-1 cursor-pointer">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {todayAppts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-10 text-[#6b7c72]"
            >
              <Calendar size={36} className="mx-auto mb-2 text-[#d9e3dd]" />
              <p className="text-[14px]">Nenhum agendamento para hoje.</p>
            </motion.div>
          ) : (
            <div className="divide-y divide-[#f2f5f3]">
              {todayAppts.map((appt, i) => {
                const s = STATUS_STYLE[appt.status]
                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05, duration: 0.3, ease: "easeOut" as const }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafcfb] transition-colors"
                  >
                    <div className="text-[14px] font-bold text-[#0e1a14] w-14 flex-shrink-0">{appt.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] text-[#0e1a14] truncate">{appt.patientName}</p>
                      <p className="text-[12px] text-[#6b7c72] truncate">{appt.doctorName} · {appt.specialty}</p>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg flex-shrink-0" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Side panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" as const }}
          className="space-y-4"
        >
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-[#e8ede9] p-5">
            <h2 className="font-semibold text-[#0e1a14] text-[15px] mb-4">Resumo geral</h2>
            <div className="space-y-3">
              {[
                { label: "Confirmados", count: appointments.filter(a => a.status === "confirmed").length,  Icon: CheckCircle, color: "#1D9E75" },
                { label: "Cancelados",  count: cancelled.length,                                            Icon: XCircle,     color: "#E24B4A" },
                { label: "Aguardando",  count: appointments.filter(a => a.status === "scheduled").length,  Icon: AlertCircle, color: "#EF9F27" },
                { label: "Realizados",  count: completed.length,                                            Icon: CheckCircle, color: "#6b7c72" },
              ].map(({ label, count, Icon, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.07, duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-[13px] text-[#6b7c72]">
                    <Icon size={14} style={{ color }} aria-hidden="true" />
                    {label}
                  </div>
                  <span className="text-[14px] font-semibold text-[#0e1a14]">{count}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Occupation rate */}
          <div className="bg-[#0e1a14] rounded-2xl p-5 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(29,158,117,0.15) 0%, transparent 70%)", top: "-30%", right: "-10%" }} />

            <h2 className="font-semibold text-white text-[14px] mb-1 relative">Taxa de ocupação</h2>
            <p className="text-[#8fa398] text-[12px] mb-4 relative">Baseada em todas as consultas</p>

            <div className="flex items-end gap-2 mb-3 relative">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-[40px] font-bold text-white leading-none"
              >
                {pct}%
              </motion.span>
              <span className="text-[#1D9E75] text-[13px] mb-1">↑ vs. semana ant.</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.7, duration: 1.0, ease: "easeOut" as const }}
                className="h-full bg-[#1D9E75] rounded-full"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
