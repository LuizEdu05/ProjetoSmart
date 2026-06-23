"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, CreditCard, AlertTriangle, Bell } from "lucide-react"
import { useBooking } from "@/context/booking-context"
import { useToast } from "@/context/toast-context"

const SPECIALTIES = [
  "Clínica Geral",
  "Cardiologia",
  "Pediatria",
  "Dermatologia",
  "Ortopedia",
  "Odontologia",
]
const TIMES = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

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
  const { openBooking } = useBooking()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    specialty: "Clínica Geral",
    type: "Presencial",
    date: "",
    time: "08:00",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.date) {
      showToast("Por favor, preencha todos os campos.", "error")
      return
    }
    openBooking("Smart Consulta", "", form.specialty, "R$ 150,00")
    showToast("Pré-agendamento enviado! Continue para confirmar.")
  }

  const labelClass =
    "block text-[12px] font-medium text-[#2a3d33] mb-1.5"
  const inputClass =
    "w-full border-[1.5px] border-[#d9e3dd] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors duration-200 bg-white"

  return (
    <section
      className="py-20 px-5 md:px-10 bg-[#f2f5f3]"
      id="agendar"
      aria-labelledby="booking-heading"
    >
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.1em] uppercase mb-2">
          Agendamento
        </p>
        <h2
          id="booking-heading"
          className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] mb-10"
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
            <h3 className="text-[24px] font-bold text-[#0e1a14] mb-3">
              Rápido, fácil e seguro
            </h3>
            <p className="text-[14px] text-[#6b7c72] leading-[1.7] mb-6">
              Preencha o formulário e nossa equipe confirmará os detalhes da sua
              consulta.
            </p>
            <ul className="flex flex-col gap-3.5">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3 items-start">
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#E1F5EE] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.Icon
                      size={15}
                      className="text-[#1D9E75]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#0e1a14]">
                      {f.title}
                    </div>
                    <div className="text-[12px] text-[#6b7c72]">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white border border-[#d9e3dd] rounded-[20px] p-6"
          >
            <h3 className="text-[19px] font-bold text-[#0e1a14] mb-5">
              Pré-agendamento
            </h3>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="b-name" className={labelClass}>
                    Nome completo
                  </label>
                  <input
                    id="b-name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="b-phone" className={labelClass}>
                    WhatsApp
                  </label>
                  <input
                    id="b-phone"
                    name="phone"
                    type="tel"
                    placeholder="(47) 99999-9999"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="b-email" className={labelClass}>
                  E-mail
                </label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="b-spec" className={labelClass}>
                    Especialidade
                  </label>
                  <select
                    id="b-spec"
                    name="specialty"
                    value={form.specialty}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="b-type" className={labelClass}>
                    Tipo
                  </label>
                  <select
                    id="b-type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Presencial</option>
                    <option>Online</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label htmlFor="b-date" className={labelClass}>
                    Data
                  </label>
                  <input
                    id="b-date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="b-time" className={labelClass}>
                    Horário
                  </label>
                  <select
                    id="b-time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#FEF3E2] rounded-xl px-3 py-2.5 text-[12px] text-[#633806] mb-4">
                <AlertTriangle
                  size={14}
                  className="flex-shrink-0 mt-0.5 text-[#EF9F27]"
                  aria-hidden="true"
                />
                <span>
                  Cancelamentos com menos de 24h têm{" "}
                  <strong>taxa de 30%</strong>.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-3.5 text-[14px] font-medium transition-colors duration-200 cursor-pointer"
              >
                Confirmar pré-agendamento →
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
