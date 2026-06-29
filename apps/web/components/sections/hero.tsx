"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Activity, Stethoscope, Shield, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { EcgMonitor } from "@/components/ui/ecg-monitor"

// ── Animated count-up hook ───────────────────────────────────
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return { value, ref }
}

const STATS = [
  { target: 4800, suffix: "+", label: "Médicos cadastrados" },
  { target: 320,  suffix: "+", label: "Clínicas parceiras" },
  { target: 98,   suffix: "%", label: "Satisfação" },
]

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { value, ref } = useCountUp(target)
  return (
    <div ref={ref}>
      <div className="text-[26px] font-black text-[#0e1a14] dark:text-white leading-none tabular-nums">
        {value.toLocaleString("pt-BR")}{suffix}
      </div>
      <div className="text-[12px] text-[#6b7c72] dark:text-white/50 mt-0.5">{label}</div>
    </div>
  )
}

// ── Trust pills shown below CTA ─────────────────────────────
const TRUST = [
  { Icon: Shield,      text: "Dados protegidos" },
  { Icon: Clock,       text: "Agendamento 24h" },
  { Icon: Stethoscope, text: "+50 especialidades" },
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay,
    },
  }
}

export function HeroSection() {
  const router = useRouter()

  return (
    <section
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center pt-[66px] px-5 md:px-10 pb-14 max-w-[1200px] mx-auto gap-14 overflow-hidden"
      aria-labelledby="hero-heading"
    >

      {/* ── Background animated orbs ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[580px] h-[580px] rounded-full animate-orb"
          style={{ background: "radial-gradient(circle, rgba(29,158,117,0.10) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full animate-orb-alt"
          style={{ background: "radial-gradient(circle, rgba(55,138,221,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 left-1/4 w-[320px] h-[320px] rounded-full animate-orb"
          style={{
            background: "radial-gradient(circle, rgba(239,159,39,0.06) 0%, transparent 70%)",
            animationDelay: "3s",
          }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #0e1a14 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Left column — copy ────────────────────────── */}
      <div>
        {/* Live tag */}
        <motion.div
          {...fadeUp(0.05)}
          className="inline-flex items-center gap-2 bg-[#E1F5EE] text-[#0F6E56] rounded-full px-3.5 py-1.5 text-[13px] font-semibold mb-5 border border-[#1D9E75]/20"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-60 animate-pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D9E75]" />
          </span>
          Agendamentos em tempo real
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          id="hero-heading"
          className="text-[clamp(38px,5vw,66px)] font-black leading-[1.05] mb-5 text-[#0e1a14] dark:text-white tracking-tight"
        >
          Sua saúde,{" "}
          <span className="relative inline-block">
            <em className="italic text-[#1D9E75] not-italic" style={{ fontStyle: "italic" }}>
              quando
            </em>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#1D9E75]/30 rounded-full"
            />
          </span>{" "}
          e onde precisar
        </motion.h1>

        <motion.p
          {...fadeUp(0.15)}
          className="text-[17px] text-[#6b7c72] dark:text-white/60 leading-[1.75] mb-8 max-w-[480px]"
        >
          Encontre clínicas e médicos de qualidade, agende sua consulta em
          minutos e receba lembretes automáticos. Simples, rápido e confiável.
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(0.2)} className="flex gap-3 flex-wrap mb-7">
          <button
            onClick={() => router.push("/buscar")}
            className="relative inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-7 py-4 rounded-xl text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(29,158,117,0.4)] cursor-pointer overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />
            Agendar agora
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <a
            href="#clinicas"
            onClick={e => { e.preventDefault(); document.querySelector("#clinicas")?.scrollIntoView({ behavior: "smooth" }) }}
            className="inline-flex items-center gap-2 border-[1.5px] border-[#d9e3dd] dark:border-white/20 text-[#0e1a14] dark:text-white hover:border-[#1D9E75] hover:text-[#1D9E75] px-6 py-4 rounded-xl text-[15px] font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            Ver clínicas
          </a>
        </motion.div>

        {/* Trust micro-pills */}
        <motion.div {...fadeUp(0.25)} className="flex items-center gap-3 flex-wrap mb-8">
          {TRUST.map(({ Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 text-[12px] text-[#6b7c72] dark:text-white/60 bg-[#f8faf9] dark:bg-[rgba(29,158,117,0.06)] border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] rounded-full px-3 py-1.5"
            >
              <Icon size={12} className="text-[#1D9E75]" aria-hidden="true" />
              {text}
            </div>
          ))}
        </motion.div>

        {/* Animated stats */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex gap-7 pt-7 border-t border-[#d9e3dd] dark:border-white/10"
        >
          {STATS.map(s => (
            <StatItem key={s.label} {...s} />
          ))}
        </motion.div>
      </div>

      {/* ── Right column — ECG dashboard ──────────────── */}
      <div className="hidden lg:block relative" aria-hidden="true">

        {/* Floating reminder badge */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="animate-float absolute -top-6 -left-8 z-20 flex items-center gap-2.5 bg-white dark:bg-[#0a1209] border border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] rounded-2xl px-3.5 py-2.5 shadow-[0_4px_20px_rgba(14,26,20,0.12)] dark:shadow-none"
        >
          <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
            <Activity size={13} className="text-[#1D9E75]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#0e1a14] dark:text-white">Lembrete de consulta</p>
            <p className="text-[11px] text-[#6b7c72] dark:text-white/50">Amanhã às 10:00 — Dr. Felipe</p>
          </div>
        </motion.div>

        {/* Main ECG Monitor widget */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        >
          <EcgMonitor />
        </motion.div>

        {/* Floating "Novo agendamento" badge */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="animate-float-delay absolute -bottom-4 -right-6 z-20 flex items-center gap-2 bg-[#0e1a14] text-white rounded-2xl px-4 py-3 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse-dot flex-shrink-0" />
          <div>
            <p className="text-[12px] font-semibold">1.240 agendamentos hoje</p>
            <p className="text-[11px] text-[#8fa398]">em tempo real na plataforma</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
