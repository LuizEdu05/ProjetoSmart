"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Stethoscope, Heart, HeartPulse, Smile, Baby, Bone, Brain, Eye } from "lucide-react"
import { useBooking } from "@/context/booking-context"

interface Clinic {
  name: string
  Icon: React.ElementType
  gradient: string
  iconColor: string
  distance: string
  rating: string
  reviews: number
  specialty: string
  price: string
  available: "Hoje" | "Amanhã" | string
  featured?: string
  doctor: string
}

const CLINICS: Clinic[] = [
  {
    name: "Clínica Saúde & Vida",
    Icon: Stethoscope,
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #3DBE8C 100%)",
    iconColor: "#0F6E56",
    distance: "2,3 km",
    rating: "4.9",
    reviews: 312,
    specialty: "Clínica Geral",
    price: "R$ 150",
    available: "Hoje",
    featured: "Destaque",
    doctor: "Dr. Felipe Moura",
  },
  {
    name: "Centro Médico Pleno",
    Icon: HeartPulse,
    gradient: "linear-gradient(135deg, #BAD7F8 0%, #4191E0 100%)",
    iconColor: "#185FA5",
    distance: "4,1 km",
    rating: "4.6",
    reviews: 189,
    specialty: "Cardiologia",
    price: "R$ 120",
    available: "Amanhã",
    doctor: "Dra. Ana Ribeiro",
  },
  {
    name: "Cardio Excelência",
    Icon: Heart,
    gradient: "linear-gradient(135deg, #F9C0D2 0%, #D4537E 100%)",
    iconColor: "#7D1C40",
    distance: "5,8 km",
    rating: "4.8",
    reviews: 94,
    specialty: "Cardiologia",
    price: "R$ 220",
    available: "Hoje",
    featured: "Top avaliado",
    doctor: "Dra. Cíntia Moraes",
  },
  {
    name: "OdontoSorriso",
    Icon: Smile,
    gradient: "linear-gradient(135deg, #FAD49B 0%, #F0A030 100%)",
    iconColor: "#633806",
    distance: "1,9 km",
    rating: "4.7",
    reviews: 201,
    specialty: "Odontologia",
    price: "R$ 80",
    available: "Hoje",
    doctor: "Dr. Bruno Faria",
  },
  {
    name: "PediaCare",
    Icon: Baby,
    gradient: "linear-gradient(135deg, #C8E6A0 0%, #6EB332 100%)",
    iconColor: "#3A6B0F",
    distance: "3,4 km",
    rating: "5.0",
    reviews: 67,
    specialty: "Pediatria",
    price: "R$ 130",
    available: "Hoje",
    doctor: "Dra. Renata Luz",
  },
  {
    name: "OrthoMax",
    Icon: Bone,
    gradient: "linear-gradient(135deg, #D4D0F8 0%, #7F77DD 100%)",
    iconColor: "#37319E",
    distance: "6,2 km",
    rating: "4.5",
    reviews: 143,
    specialty: "Ortopedia",
    price: "R$ 180",
    available: "Quinta-feira",
    doctor: "Dr. Lucas Peixoto",
  },
]

export function ClinicsSection() {
  const { openBooking } = useBooking()

  return (
    <section
      className="relative py-[80px] px-5 md:px-10 max-w-[1200px] mx-auto"
      id="clinicas"
      aria-labelledby="clinics-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.12em] uppercase mb-2">
          Clínicas parceiras
        </p>
        <h2
          id="clinics-heading"
          className="text-[clamp(26px,4vw,42px)] font-black text-[#0e1a14] mb-2"
        >
          As melhores clínicas perto de você
        </h2>
        <p className="text-[15px] text-[#6b7c72] mb-10">
          Todas verificadas, avaliadas e com horários em tempo real.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CLINICS.map((clinic, i) => (
          <motion.article
            key={clinic.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            whileHover={{ y: -6, boxShadow: "0 20px 56px rgba(14,26,20,0.13)" }}
            onClick={() =>
              openBooking(
                clinic.name,
                clinic.doctor,
                clinic.specialty,
                clinic.price + ",00"
              )
            }
            className="bg-white border border-[#d9e3dd] rounded-[22px] overflow-hidden cursor-pointer transition-all duration-250 hover:border-[#1D9E75]/60 group"
            aria-label={`Agendar na ${clinic.name}`}
          >
            {/* Gradient header with animated icon */}
            <div
              className="h-[152px] flex items-center justify-center relative overflow-hidden"
              style={{ background: clinic.gradient }}
              aria-hidden="true"
            >
              {/* Subtle grid overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Background blob */}
              <div
                className="absolute w-24 h-24 rounded-full opacity-25"
                style={{ background: "white", filter: "blur(20px)", top: "10%", left: "30%" }}
              />

              {/* Animated icon */}
              <motion.div
                whileHover={{ scale: 1.12, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-lg"
              >
                <clinic.Icon
                  size={32}
                  style={{ color: clinic.iconColor }}
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Featured badge */}
              {clinic.featured && (
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[11px] font-bold text-[#0F6E56] shadow-sm">
                  {clinic.featured}
                </span>
              )}

              {/* Available today pulse indicator */}
              {clinic.available === "Hoje" && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-pulse-ring" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <span className="text-[10px] font-semibold text-white">Disponível</span>
                </div>
              )}
            </div>

            {/* Card body */}
            <div className="p-4">
              <h3 className="text-[16px] font-bold text-[#0e1a14] mb-1.5 group-hover:text-[#1D9E75] transition-colors">
                {clinic.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[12px] text-[#6b7c72] mb-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={11} aria-hidden="true" />
                  {clinic.distance}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c5c2bc]" aria-hidden="true" />
                <span className="flex items-center gap-0.5">
                  <Star size={11} className="text-[#EF9F27] fill-[#EF9F27]" aria-hidden="true" />
                  {clinic.rating}
                  <span className="text-[11px]">({clinic.reviews})</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c5c2bc]" aria-hidden="true" />
                <span>{clinic.specialty}</span>
              </div>

              <div className="flex justify-between items-center border-t border-[#f2f5f3] pt-3">
                <div>
                  <span className="text-[11px] text-[#6b7c72] block">A partir de</span>
                  <span className="text-[20px] font-black text-[#1D9E75] leading-tight">
                    {clinic.price}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                    clinic.available === "Hoje"
                      ? "bg-[#E1F5EE] text-[#0F6E56]"
                      : "bg-[#FEF3E2] text-[#854F0B]"
                  }`}
                >
                  {clinic.available === "Hoje" ? "Disponível hoje" : clinic.available}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
