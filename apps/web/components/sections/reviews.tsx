"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const REVIEWS = [
  {
    text: '"Incrível! Encontrei um cardiologista em menos de 2 minutos e o agendamento foi super simples. O lembrete automático salvou minha consulta!"',
    initials: "ML",
    name: "Maria Lima",
    date: "há 3 dias",
    bg: "#E1F5EE",
    color: "#0F6E56",
  },
  {
    text: '"Plataforma excelente. Transparência total nos preços e avaliações. Nunca mais vou agendar consulta de outro jeito."',
    initials: "RS",
    name: "Roberto Santos",
    date: "há 1 semana",
    bg: "#E6F1FB",
    color: "#185FA5",
  },
  {
    text: '"O sistema de notificação é perfeito. Recebi aviso 1 dia antes e 2 horas antes. Médico super atencioso e pontual."',
    initials: "JP",
    name: "Julia Pereira",
    date: "há 2 semanas",
    bg: "#FBEAF0",
    color: "#993556",
  },
]

export function ReviewsSection() {
  return (
    <section
      className="relative overflow-hidden py-20 px-5 md:px-10"
      aria-labelledby="reviews-heading"
      style={{
        background:
          "linear-gradient(180deg, rgba(242,245,243,0.9) 0%, rgba(238,248,243,0.88) 60%, rgba(242,245,243,0.9) 100%)",
      }}
    >
      {/* Top border line */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent 5%, rgba(29,158,117,0.15) 40%, rgba(55,138,221,0.1) 60%, transparent 95%)",
        }}
        aria-hidden="true"
      />
      {/* Soft radial glow center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(29,158,117,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.1em] uppercase mb-2">
          Depoimentos
        </p>
        <h2
          id="reviews-heading"
          className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] mb-9"
        >
          O que os pacientes dizem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-white border border-[#d9e3dd] rounded-[18px] p-5"
            >
              <div className="flex gap-0.5 mb-3" aria-label="5 estrelas">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-[#EF9F27] fill-[#EF9F27]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-[14px] text-[#2a3d33] leading-[1.65] mb-4">
                {r.text}
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-semibold text-[12px] flex-shrink-0"
                  style={{ background: r.bg, color: r.color }}
                  aria-hidden="true"
                >
                  {r.initials}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#0e1a14]">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-[#6b7c72]">{r.date}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
