"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

const INCLUDED = [
  "Agendamento online 24 horas por dia",
  "Notificações automáticas de lembrete",
  "Pagamento seguro via Cartão, Pix ou Boleto",
  "Avaliações verificadas de pacientes reais",
  "Localização e contato de cada clínica",
  "Suporte por WhatsApp e chat",
  "Histórico completo de consultas no perfil",
]

const FEES = [
  { when: "Mais de 48 horas", fee: "Sem taxa", color: "#0F6E56", bg: "#E1F5EE" },
  { when: "Entre 24–48 horas", fee: "10% do valor", color: "#854F0B", bg: "#FEF3E2" },
  { when: "Menos de 24 horas", fee: "30% do valor", color: "#E24B4A", bg: "#FCEBEB" },
  { when: "No mesmo dia", fee: "50% do valor", color: "#E24B4A", bg: "#FCEBEB" },
]

export function PolicySection() {
  return (
    <section
      className="py-20 px-5 md:px-10 max-w-[1100px] mx-auto"
      aria-labelledby="policy-heading"
    >
      <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.1em] uppercase mb-2">
        Transparência
      </p>
      <h2
        id="policy-heading"
        className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] mb-9"
      >
        Regras claras para todos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* Included */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="bg-[#1D9E75] rounded-[20px] p-7"
          aria-labelledby="included-heading"
        >
          <h3
            id="included-heading"
            className="text-[20px] font-bold text-white mb-5"
          >
            O que está incluído
          </h3>
          <ul className="flex flex-col gap-3">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[13px] text-white/85"
              >
                <Check
                  size={15}
                  className="text-white/60 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Cancellation fees */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="border border-[#d9e3dd] rounded-[20px] p-7"
          aria-labelledby="fees-heading"
        >
          <h3
            id="fees-heading"
            className="text-[20px] font-bold text-[#0e1a14] mb-2"
          >
            Taxa de cancelamento
          </h3>
          <p className="text-[13px] text-[#6b7c72] mb-5">
            Para garantir aproveitamento dos horários:
          </p>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="text-left py-2 px-2.5 bg-[#f2f5f3] text-[#6b7c72] font-medium rounded-tl-lg">
                  Antecedência
                </th>
                <th className="text-left py-2 px-2.5 bg-[#f2f5f3] text-[#6b7c72] font-medium rounded-tr-lg">
                  Taxa
                </th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((row) => (
                <tr
                  key={row.when}
                  className="border-b border-[#f2f5f3] last:border-0"
                >
                  <td className="py-2.5 px-2.5 text-[#2a3d33]">{row.when}</td>
                  <td className="py-2.5 px-2.5">
                    <span
                      className="font-medium px-2 py-0.5 rounded-md text-[12px]"
                      style={{ color: row.color, background: row.bg }}
                    >
                      {row.fee}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
