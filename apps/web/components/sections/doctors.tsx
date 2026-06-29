"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

const DOCTORS = [
  {
    initials: "FM",
    name: "Dr. Felipe Moura",
    specialty: "Clínica Geral",
    rating: "4.9",
    bg: "#E1F5EE",
    color: "#0F6E56",
    clinic: "Clínica Saúde & Vida",
    clinicId: "c1",
    price: "R$ 150,00",
  },
  {
    initials: "RA",
    name: "Dr. Roberto Almeida",
    specialty: "Cardiologia",
    rating: "4.9",
    bg: "#E6F1FB",
    color: "#185FA5",
    clinic: "CardioCenter SP",
    clinicId: "c2",
    price: "R$ 200,00",
  },
  {
    initials: "JP",
    name: "Dra. Juliana Pereira",
    specialty: "Fisioterapia",
    rating: "4.7",
    bg: "#D4D0F8",
    color: "#37319E",
    clinic: "FisioMovimento",
    clinicId: "c6",
    price: "R$ 140,00",
  },
  {
    initials: "MC",
    name: "Dra. Marina Costa",
    specialty: "Pediatria",
    rating: "4.7",
    bg: "#FAD49B",
    color: "#633806",
    clinic: "Clínica Infantil Crescer",
    clinicId: "c3",
    price: "R$ 220,00",
  },
]

export function DoctorsSection() {
  const router = useRouter()

  return (
    <section className="relative py-20 px-5 md:px-10 bg-[#f8faf9] dark:bg-[#060d09]" id="medicos" aria-labelledby="doctors-heading">
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-mono font-bold text-[#1D9E75] tracking-[0.15em] uppercase mb-2">
          Especialistas
        </p>
        <h2 id="doctors-heading" className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] dark:text-white mb-9">
          Médicos em destaque
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DOCTORS.map((doc, i) => (
            <motion.article
              key={doc.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              onClick={() => router.push("/buscar?c=" + doc.clinicId)}
              className="bg-white dark:bg-[#0a1209] border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] rounded-[18px] p-5 text-center transition-[border-color,box-shadow] duration-200 cursor-pointer hover:border-[#1D9E75] dark:hover:border-[rgba(29,158,117,0.5)] hover:shadow-[0_4px_20px_rgba(14,26,20,0.07)] dark:hover:shadow-[0_0_28px_rgba(29,158,117,0.12)] group"
              aria-label={`Ver ${doc.name} em ${doc.clinic}`}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-[22px] font-bold"
                style={{ background: doc.bg, color: doc.color }}
                aria-hidden="true"
              >
                {doc.initials}
              </div>
              <h3 className="text-[15px] font-bold text-[#0e1a14] dark:text-white mb-0.5 group-hover:text-[#1D9E75] transition-colors">
                {doc.name}
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#6b7c72] dark:text-white/40 mb-3">{doc.specialty}</p>
              <div className="flex items-center justify-center gap-1 text-[12px] mb-4">
                <Star size={12} className="text-[#EF9F27] fill-[#EF9F27]" aria-hidden="true" />
                <span className="font-medium text-white">{doc.rating}</span>
              </div>
              <div className="border-t border-[#e8ede9] dark:border-[rgba(29,158,117,0.1)] pt-3">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#6b7c72] dark:text-white/30 mb-0.5">A partir de</p>
                <p className="text-[15px] font-bold text-[#1D9E75]">{doc.price}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
