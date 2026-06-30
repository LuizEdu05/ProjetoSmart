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
      className="relative overflow-hidden py-20 px-5 md:px-10 bg-[#f2f5f3] dark:bg-[#060d09]"
      aria-labelledby="reviews-heading"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center top, rgba(29,158,117,0.08) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-mono font-bold text-[#1D9E75] tracking-[0.15em] uppercase mb-2">
          Depoimentos
        </p>
        <h2 id="reviews-heading" className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] dark:text-white mb-9">
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
              className="bg-white dark:bg-[#0a1209] border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] rounded-[18px] p-5 hover:border-[#1D9E75] dark:hover:border-[rgba(29,158,117,0.35)] hover:shadow-[0_4px_20px_rgba(14,26,20,0.07)] dark:hover:shadow-none transition-[border-color,box-shadow] duration-200"
            >
              <div className="flex gap-0.5 mb-3" aria-label="5 estrelas">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-[#EF9F27] fill-[#EF9F27]" aria-hidden="true" />
                ))}
              </div>
              <p className="text-[14px] text-[#2a3d33] dark:text-white/70 leading-[1.65] mb-4">{r.text}</p>
              <div className="flex items-center gap-2.5 border-t border-[#e8ede9] dark:border-[rgba(29,158,117,0.1)] pt-4">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-semibold text-[12px] flex-shrink-0"
                  style={{ background: r.bg, color: r.color }}
                  aria-hidden="true"
                >
                  {r.initials}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#0e1a14] dark:text-white">{r.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6b7c72] dark:text-white/35">{r.date}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
