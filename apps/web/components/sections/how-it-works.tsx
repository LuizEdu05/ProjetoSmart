"use client"

import { motion } from "framer-motion"
import { Search, Calendar, CreditCard, Bell, ArrowRight } from "lucide-react"

const STEPS = [
  {
    n: "01",
    Icon: Search,
    title: "Busque sua clínica",
    desc: "Pesquise por especialidade, localização ou médico. Veja avaliações reais de pacientes.",
    color: "#1D9E75",
  },
  {
    n: "02",
    Icon: Calendar,
    title: "Escolha o horário",
    desc: "Disponibilidade em tempo real. Escolha a data e hora que funcione para você.",
    color: "#378ADD",
  },
  {
    n: "03",
    Icon: CreditCard,
    title: "Pague com segurança",
    desc: "Cartão, Pix ou boleto. Pagamento criptografado e confirmação instantânea.",
    color: "#EF9F27",
  },
  {
    n: "04",
    Icon: Bell,
    title: "Receba lembretes",
    desc: "Notificações automáticas 1 dia e 2 horas antes. Nunca mais perca uma consulta.",
    color: "#E24B4A",
  },
]

export function HowItWorksSection() {
  return (
    <section
      className="relative bg-[#0e1a14] py-24 px-5 md:px-10 overflow-hidden"
      id="como-funciona"
      aria-labelledby="how-heading"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 animate-orb"
          style={{ background: "radial-gradient(circle, rgba(29,158,117,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 animate-orb-alt"
          style={{ background: "radial-gradient(circle, rgba(55,138,221,0.12) 0%, transparent 70%)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.12em] uppercase mb-2">
            Simples assim
          </p>
          <h2
            id="how-heading"
            className="text-[clamp(26px,4vw,42px)] font-black text-white mb-3"
          >
            Como funciona
          </h2>
          <p className="text-[15px] text-[#8fa398] max-w-md">
            Do primeiro clique ao atendimento em 4 passos simples.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {/* Connector arrows (desktop only) */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 + 0.5 }}
              style={{ transformOrigin: "left", gridColumn: `${i + 1}` }}
              className="hidden lg:flex absolute top-[52px] items-center"
              aria-hidden="true"
            />
          ))}

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              {/* Step number ghost */}
              <div
                className="text-[64px] font-black leading-none mb-3 select-none"
                style={{ color: `${step.color}12` }}
                aria-hidden="true"
              >
                {step.n}
              </div>

              {/* Icon box */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-4 relative overflow-hidden"
                style={{ background: `${step.color}18`, border: `1px solid ${step.color}35` }}
              >
                {/* Shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                <step.Icon
                  size={24}
                  style={{ color: step.color }}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Arrow connector (desktop) */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.6 }}
                  className="hidden lg:flex absolute right-0 top-[88px] -translate-y-1/2 translate-x-1/2 items-center justify-center w-6 h-6 rounded-full z-10"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
                  aria-hidden="true"
                >
                  <ArrowRight size={12} style={{ color: step.color }} />
                </motion.div>
              )}

              <h3 className="text-[16px] font-bold text-white mb-2 group-hover:text-[#1D9E75] transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-[13px] text-[#8fa398] leading-relaxed">
                {step.desc}
              </p>

              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 + 0.4 }}
                style={{ transformOrigin: "left", background: step.color }}
                className="absolute bottom-0 left-0 h-[2px] w-10 rounded-full mt-4 opacity-40"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/8 pt-8"
        >
          <p className="text-[15px] text-[#8fa398]">
            Mais de <span className="text-white font-bold">4.800 médicos</span> prontos para te atender.
          </p>
          <a
            href="#clinicas"
            onClick={e => { e.preventDefault(); document.querySelector("#clinicas")?.scrollIntoView({ behavior: "smooth" }) }}
            className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-6 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            Ver clínicas disponíveis
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
