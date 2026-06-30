"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, CreditCard, AlertTriangle, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/context/toast-context"
import { FilterDropdown } from "@/components/ui/filter-dropdown"

const SPECIALTIES = [
  "Clínica Geral",
  "Cardiologia",
  "Pediatria",
  "Dermatologia",
  "Ortopedia",
  "Odontologia",
]

const FEATURES = [
  {
    Icon: MapPin,
    title: "Localização precisa",
    desc: "Veja no mapa onde fica cada clínica.",
  },
  {
    Icon: CreditCard,
    title: "Pagamento seguro",
    desc: "Cartão, Pix ou boleto — 100% criptografado.",
  },
  {
    Icon: AlertTriangle,
    title: "Taxa de cancelamento",
    desc: "Cancelamentos com menos de 24h têm multa de 30%.",
  },
  {
    Icon: Bell,
    title: "Notificações",
    desc: "Lembretes 1 dia e 2 horas antes da consulta.",
  },
]

export function BookingSection() {
  const router = useRouter()
  const { showToast } = useToast()
  const [specialty, setSpecialty] = useState("Clínica Geral")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    showToast("Redirecionando para busca de clínicas…")
    router.push("/buscar")
  }

  const labelClass = "block text-[12px] font-medium text-[#2a3d33] dark:text-white/70 mb-1.5"

  return (
    <section
      className="py-20 px-5 md:px-10 bg-[#f2f5f3] dark:bg-[#060d09]"
      id="agendar"
      aria-labelledby="booking-heading"
    >
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.1em] uppercase mb-2">
          Agendamento
        </p>
        <h2
          id="booking-heading"
          className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] dark:text-white mb-10"
        >
          Agende sua consulta agora
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          {/* Left — features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h3 className="text-[24px] font-bold text-[#0e1a14] dark:text-white mb-3">
              Rápido, fácil e seguro
            </h3>
            <p className="text-[14px] text-[#6b7c72] dark:text-white/60 leading-[1.7] mb-6">
              Escolha a especialidade, selecione uma clínica, escolha o médico e
              confirme seu horário — tudo em poucos cliques.
            </p>
            <ul className="flex flex-col gap-3.5">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3 items-start">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#E1F5EE] dark:bg-[rgba(29,158,117,0.12)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.Icon
                      size={15}
                      className="text-[#1D9E75]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#0e1a14] dark:text-white">
                      {f.title}
                    </div>
                    <div className="text-[12px] text-[#6b7c72] dark:text-white/50">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — quick start */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white dark:bg-[#0a1209] border border-[#d9e3dd] dark:border-[rgba(29,158,117,0.15)] rounded-[20px] p-6"
          >
            <h3 className="text-[19px] font-bold text-[#0e1a14] dark:text-white mb-1">
              Buscar clínicas
            </h3>
            <p className="text-[13px] text-[#6b7c72] dark:text-white/60 mb-5">
              Selecione a especialidade desejada e encontre o melhor profissional.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="b-spec" className={labelClass}>
                  Especialidade
                </label>
                <FilterDropdown value={specialty} onChange={setSpecialty} options={SPECIALTIES} />
              </div>

              <div className="flex items-start gap-2 bg-[#E1F5EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0F6E56] mb-5">
                <span className="text-[16px] leading-none mt-0.5">✓</span>
                <span>
                  Escolha clínica → selecione médico → confirme horário disponível.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-3.5 text-[14px] font-medium transition-colors duration-200 cursor-pointer"
              >
                Ver clínicas disponíveis →
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
