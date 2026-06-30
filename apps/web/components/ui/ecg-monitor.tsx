"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HeartPulse, Droplets, Thermometer, Star, CalendarCheck } from "lucide-react"

// ── ECG path data ────────────────────────────────────────────
// One cardiac cycle = 80px wide, midline y=50, viewBox height=80
const CYCLE: [number, number][] = [
  [0, 50], [10, 50], [13, 46], [16, 38], [19, 46],
  [22, 50], [25, 50], [28, 54], [30, 5],  [32, 62],
  [35, 50], [40, 50], [44, 40], [48, 35], [52, 44],
  [55, 50], [80, 50],
]

function buildCycle(offsetX: number): string {
  return CYCLE.map(([x, y], i) =>
    `${i === 0 ? "M" : "L"} ${x + offsetX},${y}`
  ).join(" ")
}

// 8 cycles = 640px total; viewBox = 400px; animate translateX 0 → -80 (one cycle)
const ECG_PATHS = Array.from({ length: 8 }, (_, i) => buildCycle(i * 80))

// BPM values to cycle through (simulates live reading)
const BPM_SEQ = [72, 73, 72, 74, 71, 73, 72, 74, 73, 72]

const CLINICS = [
  { name: "Clínica Saúde & Vida", spec: "Clínica Geral",  rating: "4.9", available: true,  bg: "#E1F5EE", color: "#0F6E56" },
  { name: "Centro Médico Pleno",  spec: "Cardiologia",    rating: "4.6", available: false, bg: "#E6F1FB", color: "#185FA5" },
  { name: "Cardio Excelência",    spec: "Cardiologia",    rating: "4.8", available: true,  bg: "#FBEAF0", color: "#993556" },
  { name: "OdontoSorriso",        spec: "Odontologia",    rating: "4.7", available: true,  bg: "#FAEEDA", color: "#633806" },
]

function getNextWeekday(): string {
  const WD = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]
  const MO = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return `${WD[d.getDay()]}, ${d.getDate()} ${MO[d.getMonth()]}`
}

export function EcgMonitor() {
  const [bpmIdx, setBpmIdx] = useState(0)
  const bpm = BPM_SEQ[bpmIdx] ?? 72
  const nextApptDate = getNextWeekday()

  useEffect(() => {
    const id = setInterval(() => {
      setBpmIdx(i => (i + 1) % BPM_SEQ.length)
    }, 850)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-white border border-[#d9e3dd] rounded-[22px] overflow-hidden shadow-[0_8px_40px_rgba(14,26,20,0.12)]">

      {/* ── ECG monitor header ─────────────────────────── */}
      <div className="relative bg-[#061410] overflow-hidden" style={{ height: 112 }}>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: [
              "linear-gradient(rgba(29,158,117,0.6) 1px, transparent 1px)",
              "linear-gradient(90deg, rgba(29,158,117,0.6) 1px, transparent 1px)",
            ].join(","),
            backgroundSize: "20px 20px",
          }}
        />

        {/* Green glow bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(29,158,117,0.18) 0%, transparent 100%)",
          }}
        />

        {/* LIVE badge */}
        <div className="absolute top-2.5 left-4 flex items-center gap-1.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse-dot" aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-widest text-[#1D9E75] uppercase">Live</span>
        </div>

        {/* BPM readout */}
        <div className="absolute top-2 right-4 text-right z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={bpm}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="text-[22px] font-black text-[#1D9E75] leading-none tabular-nums"
            >
              {bpm}
            </motion.div>
          </AnimatePresence>
          <div className="text-[9px] text-[#4a7060] font-semibold tracking-widest uppercase">BPM</div>
        </div>

        {/* Scrolling ECG line */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: 80,
            maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <svg
            width="100%"
            height="80"
            viewBox="0 0 400 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Shadow glow pass */}
            <g className="animate-ecg-scroll">
              {ECG_PATHS.map((d, i) => (
                <path
                  key={`glow-${i}`}
                  d={d}
                  stroke="#1D9E75"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.2"
                  strokeLinecap="round"
                />
              ))}
            </g>
            {/* Main line */}
            <g className="animate-ecg-scroll">
              {ECG_PATHS.map((d, i) => (
                <path
                  key={`line-${i}`}
                  d={d}
                  stroke="#1D9E75"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* ── Vital signs row ──────────────────────────────── */}
      <div className="grid grid-cols-3 border-b border-[#f2f5f3]">
        {([
          { Icon: HeartPulse, label: "Freq. Card.",  value: `${bpm}`,  unit: "bpm", color: "#E24B4A", live: true },
          { Icon: Droplets,   label: "Saturação",    value: "98",      unit: "%",   color: "#378ADD", live: false },
          { Icon: Thermometer,label: "Temperatura",  value: "36.5",    unit: "°C",  color: "#EF9F27", live: false },
        ] as const).map(({ Icon, label, value, unit, color, live }) => (
          <div
            key={label}
            className="flex flex-col items-center py-3 px-2 border-r border-[#f2f5f3] last:border-r-0"
          >
            <Icon size={13} style={{ color }} aria-hidden="true" />
            <div className="flex items-baseline gap-0.5 mt-1">
              <AnimatePresence mode="wait">
                {live ? (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[16px] font-black text-[#0e1a14] tabular-nums"
                  >
                    {value}
                  </motion.span>
                ) : (
                  <span className="text-[16px] font-black text-[#0e1a14]">{value}</span>
                )}
              </AnimatePresence>
              <span className="text-[10px] text-[#6b7c72] font-medium">{unit}</span>
            </div>
            <span className="text-[9px] text-[#6b7c72] uppercase tracking-wide mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Clinic availability list ─────────────────────── */}
      <div className="px-5 pt-3.5 pb-1">
        <p className="text-[10px] font-bold text-[#6b7c72] uppercase tracking-widest mb-2.5">
          Disponíveis agora
        </p>
        {CLINICS.map((c, i) => (
          <div
            key={c.name}
            className={`flex items-center gap-3 py-2.5 ${i < CLINICS.length - 1 ? "border-b border-[#f7f9f8]" : ""}`}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
              style={{ background: c.bg, color: c.color }}
            >
              {c.name.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#0e1a14] truncate">{c.name}</p>
              <div className="flex items-center gap-1 text-[11px] text-[#6b7c72]">
                <Star size={9} className="text-[#EF9F27] fill-[#EF9F27]" aria-hidden="true" />
                {c.rating} · {c.spec}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {c.available && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-60 animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D9E75]" />
                </span>
              )}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  c.available
                    ? "bg-[#E1F5EE] text-[#0F6E56]"
                    : "bg-[#FEF3E2] text-[#854F0B]"
                }`}
              >
                {c.available ? "Hoje" : "Amanhã"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom confirmed badge ───────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-t border-[#f2f5f3] bg-[#fafcfb]">
        <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
          <CalendarCheck size={13} className="text-[#1D9E75]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-[#0e1a14]">Dra. Ana Ribeiro · {nextApptDate}</p>
          <p className="text-[11px] text-[#6b7c72]">Consulta confirmada · 14:30</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-md">
          Confirmada
        </span>
      </div>
    </div>
  )
}
