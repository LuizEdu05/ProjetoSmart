"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useBooking } from "@/context/booking-context"

const DOCTORS = [
  {
    initials: "FM",
    name: "Dr. Felipe Moura",
    specialty: "Clínica Geral",
    rating: "4.9",
    bg: "#E1F5EE",
    color: "#0F6E56",
    clinic: "Clínica Saúde & Vida",
    price: "R$ 150,00",
  },
  {
    initials: "AR",
    name: "Dra. Ana Ribeiro",
    specialty: "Cardiologia",
    rating: "4.8",
    bg: "#FBEAF0",
    color: "#993556",
    clinic: "Centro Médico Pleno",
    price: "R$ 120,00",
  },
  {
    initials: "LP",
    name: "Dr. Lucas Peixoto",
    specialty: "Ortopedia",
    rating: "4.6",
    bg: "#E6F1FB",
    color: "#185FA5",
    clinic: "OrthoMax",
    price: "R$ 180,00",
  },
  {
    initials: "CN",
    name: "Dra. Camila Nunes",
    specialty: "Dermatologia",
    rating: "4.9",
    bg: "#FAEEDA",
    color: "#633806",
    clinic: "Cardio Excelência",
    price: "R$ 200,00",
  },
]

export function DoctorsSection() {
  const { openBooking } = useBooking()

  return (
    <section
      className="relative py-20 px-5 md:px-10 overflow-hidden"
      id="medicos"
      aria-labelledby="doctors-heading"
    >
      {/* Very subtle radial wash so the aurora behind stays diffuse */}
      <div
        className="absolute inset-x-0 top-0 h-[220px] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.1em] uppercase mb-2">
          Especialistas
        </p>
        <h2
          id="doctors-heading"
          className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] mb-9"
        >
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
              whileHover={{ y: -3, boxShadow: "0 4px 24px rgba(14,26,20,0.08)" }}
              className="bg-white border border-[#d9e3dd] rounded-[18px] p-5 text-center transition-all duration-200 cursor-pointer hover:border-[#1D9E75] group"
              onClick={() =>
                openBooking(doc.clinic, doc.name, doc.specialty, doc.price)
              }
              aria-label={`Agendar com ${doc.name}`}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-[22px] font-bold"
                style={{ background: doc.bg, color: doc.color }}
                aria-hidden="true"
              >
                {doc.initials}
              </div>
              <h3 className="text-[15px] font-bold text-[#0e1a14] mb-0.5">
                {doc.name}
              </h3>
              <p className="text-[12px] text-[#6b7c72] mb-2">{doc.specialty}</p>
              <div className="flex items-center justify-center gap-1 text-[12px] mb-3">
                <Star
                  size={12}
                  className="text-[#EF9F27] fill-[#EF9F27]"
                  aria-hidden="true"
                />
                <span className="font-medium text-[#0e1a14]">{doc.rating}</span>
              </div>
              <button
                className="w-full bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#1D9E75] hover:text-white rounded-lg py-2 text-[12px] font-medium transition-all duration-200 cursor-pointer"
                tabIndex={-1}
                aria-hidden="true"
              >
                Agendar
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
