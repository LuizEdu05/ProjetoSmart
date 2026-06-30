"use client"

import { useRouter } from "next/navigation"
import { MapPin, Star, Stethoscope, Heart, HeartPulse, Smile, Baby, Bone, ArrowRight, Clock, Shield, CalendarCheck } from "lucide-react"
import { DeckCarousel, BlurRevealText } from "@/components/ui/blur-reveal-deck"

interface Clinic {
  name: string
  Icon: React.ElementType
  gradient: string
  iconColor: string
  bgColor: string
  distance: string
  rating: string
  reviews: number
  specialty: string
  price: string
  available: "Hoje" | "Amanhã" | string
  featured?: string
  doctor: string
  description: string
  clinicId: string
}

const CLINICS: Clinic[] = [
  {
    name: "Clínica Saúde & Vida",
    Icon: Stethoscope,
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #3DBE8C 60%, #0F6E56 100%)",
    iconColor: "#0F6E56",
    bgColor: "rgba(15,110,86,0.08)",
    distance: "Jaraguá do Sul",
    rating: "4.9",
    reviews: 312,
    specialty: "Clínica Geral",
    price: "R$ 150",
    available: "Hoje",
    featured: "Mais procurada",
    doctor: "Dr. Felipe Moura",
    description: "Atendimento completo com foco no cuidado preventivo e na sua saúde em longo prazo.",
    clinicId: "c1",
  },
  {
    name: "CardioCenter Jaraguá do Sul",
    Icon: HeartPulse,
    gradient: "linear-gradient(135deg, #BAD7F8 0%, #4191E0 60%, #185FA5 100%)",
    iconColor: "#185FA5",
    bgColor: "rgba(24,95,165,0.08)",
    distance: "Jaraguá do Sul",
    rating: "4.9",
    reviews: 547,
    specialty: "Cardiologia",
    price: "R$ 200",
    available: "Amanhã",
    doctor: "Dr. Roberto Almeida",
    description: "Referência em saúde cardiovascular com equipamentos de última geração e equipe especializada.",
    clinicId: "c2",
  },
  {
    name: "Clínica Infantil Crescer",
    Icon: Baby,
    gradient: "linear-gradient(135deg, #FAD49B 0%, #F0A030 60%, #B86B0A 100%)",
    iconColor: "#633806",
    bgColor: "rgba(99,56,6,0.08)",
    distance: "Guaramirim",
    rating: "4.7",
    reviews: 228,
    specialty: "Pediatria",
    price: "R$ 220",
    available: "Hoje",
    featured: "Crianças",
    doctor: "Dra. Marina Costa",
    description: "Ambiente acolhedor e lúdico para o bem-estar das crianças desde o nascimento até a adolescência.",
    clinicId: "c3",
  },
  {
    name: "OdontoMais Guaramirim",
    Icon: Smile,
    gradient: "linear-gradient(135deg, #BAD7F8 0%, #4191E0 60%, #185FA5 100%)",
    iconColor: "#185FA5",
    bgColor: "rgba(24,95,165,0.08)",
    distance: "Guaramirim",
    rating: "4.6",
    reviews: 183,
    specialty: "Odontologia",
    price: "R$ 180",
    available: "Hoje",
    doctor: "Dr. Gustavo Ferreira",
    description: "Sorrisos transformados com tecnologia digital, implantes e ortodontia sem dor.",
    clinicId: "c4",
  },
  {
    name: "Espaço NutriMente",
    Icon: Heart,
    gradient: "linear-gradient(135deg, #D4D0F8 0%, #7F77DD 60%, #4C3B8C 100%)",
    iconColor: "#4C3B8C",
    bgColor: "rgba(76,59,140,0.08)",
    distance: "Schroeder",
    rating: "4.5",
    reviews: 97,
    specialty: "Nutrição",
    price: "R$ 160",
    available: "Hoje",
    doctor: "Dra. Beatriz Santos",
    description: "Planos alimentares personalizados que respeitam seu estilo de vida e objetivos de saúde.",
    clinicId: "c5",
  },
  {
    name: "FisioMovimento Schroeder",
    Icon: Bone,
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #3DBE8C 60%, #0F6E56 100%)",
    iconColor: "#0F6E56",
    bgColor: "rgba(15,110,86,0.08)",
    distance: "Schroeder",
    rating: "4.7",
    reviews: 142,
    specialty: "Fisioterapia",
    price: "R$ 140",
    available: "Amanhã",
    doctor: "Dra. Juliana Pereira",
    description: "Reabilitação e prevenção de lesões com técnicas modernas para você voltar ao movimento.",
    clinicId: "c6",
  },
]

const STATS = [
  { icon: Shield, label: "Clínicas verificadas", value: "320+" },
  { icon: CalendarCheck, label: "Consultas agendadas", value: "48 mil" },
  { icon: Clock, label: "Disponibilidade", value: "24/7" },
  { icon: Star, label: "Satisfação dos pacientes", value: "98%" },
]

function ClinicCard({ clinic, textKey, onBook }: { clinic: Clinic; textKey: number; onBook: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a1209]">
      {/* ── Gradient header ── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: 172, background: clinic.gradient }}
        aria-hidden="true"
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)", top: "-20%", left: "20%" }}
        />

        {/* Featured badge */}
        {clinic.featured && (
          <span className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold text-white tracking-[0.1em] uppercase">
            ★ {clinic.featured}
          </span>
        )}

        {/* Availability pill */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm ${
            clinic.available === "Hoje" ? "bg-black/20" : "bg-black/15"
          }`}>
            {clinic.available === "Hoje" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#5fffb4] opacity-60 animate-pulse" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5fffb4]" />
              </span>
            )}
            <span className="text-[10px] font-mono font-semibold text-white">
              {clinic.available === "Hoje" ? "Disponível hoje" : `Disponível ${clinic.available.toLowerCase()}`}
            </span>
          </div>
        </div>

        {/* Bottom row: icon + rating */}
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-4 pb-4">
          <div className="w-[52px] h-[52px] rounded-2xl bg-white/25 backdrop-blur-sm border border-white/35 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
            <clinic.Icon size={26} style={{ color: clinic.iconColor }} strokeWidth={1.6} />
          </div>
          <div className="text-right">
            <div className="text-white font-black text-[22px] leading-none drop-shadow-sm">
              ★ {clinic.rating}
            </div>
            <div className="text-white/75 text-[11px] font-mono mt-0.5">{clinic.reviews} avaliações</div>
          </div>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
        {/* Clinic name — blur-reveal */}
        <h3 className="text-[19px] font-black text-[#0e1a14] dark:text-white leading-tight mb-1">
          <BlurRevealText text={clinic.name} triggerKey={textKey} />
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#6b7c72] dark:text-white/50 leading-[1.55] mb-3 line-clamp-2">
          {clinic.description}
        </p>

        {/* Doctor + distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
              style={{ background: clinic.bgColor, color: clinic.iconColor }}
              aria-hidden="true"
            >
              {clinic.doctor.split(" ").pop()![0]}
            </div>
            <span className="text-[13px] font-medium text-[#2a3d33] dark:text-white/70 truncate max-w-[160px]">
              {clinic.doctor}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#6b7c72] dark:text-white/40 flex-shrink-0">
            <MapPin size={11} aria-hidden="true" />
            <span className="font-mono">{clinic.distance}</span>
          </div>
        </div>

        {/* Specialty tag */}
        <div className="mb-4">
          <span
            className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-[0.08em]"
            style={{ background: clinic.bgColor, color: clinic.iconColor }}
          >
            {clinic.specialty}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto border-t border-[#e8ede9] dark:border-[rgba(29,158,117,0.12)] pt-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#6b7c72] dark:text-white/35">
              A partir de
            </div>
            <div className="text-[24px] font-black text-[#1D9E75] leading-tight">{clinic.price}</div>
          </div>
          <button
            onClick={() => onBook(clinic.clinicId)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1D9E75] hover:bg-[#17875f] text-white rounded-xl text-[13px] font-semibold transition-colors duration-200 cursor-pointer flex-shrink-0 shadow-[0_4px_16px_rgba(29,158,117,0.3)]"
          >
            Agendar
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ClinicsSection() {
  const router = useRouter()

  function handleBook(clinicId: string) {
    router.push("/buscar?c=" + clinicId)
  }

  return (
    <section
      className="relative py-[80px] px-5 md:px-10 bg-white dark:bg-[#060d09]"
      id="clinicas"
      aria-labelledby="clinics-heading"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[360px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, rgba(29,158,117,0.06) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto">
        {/* ── Section header ── */}
        <div className="mb-10 lg:mb-0">
          <p className="text-[11px] font-mono font-bold text-[#1D9E75] tracking-[0.15em] uppercase mb-2">
            Parceiros verificados
          </p>
          <h2
            id="clinics-heading"
            className="text-[clamp(26px,4vw,42px)] font-black text-[#0e1a14] dark:text-white mb-2 leading-tight"
          >
            Nossas clínicas parceiras
          </h2>
          <p className="text-[15px] text-[#6b7c72] dark:text-white/40 max-w-[400px]">
            Todas verificadas, avaliadas e com horários em tempo real.
          </p>
        </div>

        {/* ── Main layout: carousel + stats ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-center mt-10">

          {/* Deck carousel */}
          <div className="w-full lg:w-[480px] flex-shrink-0" style={{ height: 500 }}>
            <DeckCarousel
              items={CLINICS}
              renderCard={(clinic, textKey) => (
                <ClinicCard clinic={clinic} textKey={textKey} onBook={handleBook} />
              )}
            />
          </div>

          {/* Stats panel */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] bg-[#f8faf9] dark:bg-[#0a1209] p-5"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(29,158,117,0.1)" }}
                >
                  <Icon size={18} className="text-[#1D9E75]" />
                </div>
                <div className="text-[28px] font-black text-[#0e1a14] dark:text-white leading-none mb-1">{value}</div>
                <div className="text-[12px] text-[#6b7c72] dark:text-white/40 font-mono uppercase tracking-wider">{label}</div>
              </div>
            ))}

            {/* CTA card */}
            <div
              className="col-span-2 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer group"
              style={{ background: "linear-gradient(135deg, rgba(29,158,117,0.12) 0%, rgba(29,158,117,0.06) 100%)", border: "1px solid rgba(29,158,117,0.2)" }}
              onClick={() => router.push("/buscar")}
              role="button"
              aria-label="Ver todas as clínicas parceiras"
            >
              <div>
                <div className="text-[15px] font-bold text-[#0e1a14] dark:text-white mb-0.5">
                  Ver todas as clínicas
                </div>
                <div className="text-[12px] text-[#6b7c72] dark:text-white/40">
                  Filtre por especialidade, localização e preço
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <ArrowRight size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
