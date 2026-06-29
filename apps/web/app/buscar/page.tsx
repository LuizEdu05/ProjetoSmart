"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search, MapPin, ChevronLeft, Stethoscope, Heart, Activity,
  Sun, Brain, Leaf, Smile, Baby, HeartPulse, Bone, Clock,
  CheckCircle2, X, AlertCircle, LogIn,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { LoginModal } from "@/components/modals/login-modal"
import { RegisterModal } from "@/components/modals/register-modal"
import { useAuth } from "@/context/auth-context"
import { addGlobalAppointment } from "@/lib/global-appointments"
import {
  seedAllPublicData,
  getPublicClinics,
  getPublicProfessionals,
  getAvailableSlots,
  type ClinicPublicProfile,
  type ProfFull,
} from "@/lib/public-profiles-store"
import { ClinicCardSkeleton, ProfCardSkeleton } from "@/components/ui/skeleton"
import { FilterDropdown } from "@/components/ui/filter-dropdown"

// ── Types ─────────────────────────────────────────────────────────────────────
type View = "clinics" | "specialties" | "professionals" | "schedule"

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00")
  const wd = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]!
  const mo = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][d.getMonth()]!
  return `${wd}, ${d.getDate()} ${mo}`
}

function fmtDay(iso: string) {
  const d = new Date(iso + "T12:00:00")
  return {
    wd: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]!,
    day: d.getDate(),
    mo: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][d.getMonth()]!,
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-[13px] leading-none ${i <= Math.round(rating) ? "text-[#EF9F27]" : "text-[#d9e3dd]"}`}>★</span>
      ))}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#6b7c72] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-[13px] font-medium text-[#0e1a14]">{value}</p>
    </div>
  )
}

// ── Specialty icons ───────────────────────────────────────────────────────────
const SPECIALTY_ICONS: Record<string, React.ElementType> = {
  "Clínica Geral":    Stethoscope,
  "Cardiologia":      Heart,
  "Ortopedia":        Bone,
  "Dermatologia":     Sun,
  "Psicologia":       Brain,
  "Nutrição":         Leaf,
  "Odontologia":      Smile,
  "Ortodontia":       Smile,
  "Pediatria":        Baby,
  "Neonatologia":     Baby,
  "Medicina Interna": HeartPulse,
  "Fisioterapia":     Activity,
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({
  view, clinic, specialty, professional, onBack,
}: {
  view: View
  clinic: ClinicPublicProfile | null
  specialty: string | null
  professional: ProfFull | null
  onBack: () => void
}) {
  const crumbs: string[] = ["Buscar"]
  if (clinic) crumbs.push(clinic.clinicName)
  if (specialty) crumbs.push(specialty)
  if (professional) crumbs.push(professional.name.split(" ").slice(0, 2).join(" "))

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      <button onClick={onBack}
        className="flex items-center gap-1 text-[14px] text-[#1D9E75] hover:text-[#0F6E56] font-medium cursor-pointer transition-colors">
        <ChevronLeft size={16} />Voltar
      </button>
      <span className="text-[#d9e3dd] dark:text-white/20 select-none">/</span>
      <div className="flex items-center gap-1.5 text-[13px] text-[#6b7c72] dark:text-white/50 flex-wrap">
        {crumbs.map((c, i) => (
          <span key={i} className={`flex items-center gap-1.5 ${i === crumbs.length - 1 ? "text-[#0e1a14] dark:text-white font-medium" : ""}`}>
            {i > 0 && <span className="text-[#d9e3dd] dark:text-white/20">/</span>}
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Clinic card ───────────────────────────────────────────────────────────────
function ClinicCard({ clinic, onSelect }: { clinic: ClinicPublicProfile; onSelect: () => void }) {
  const [g1, g2] = clinic.gradient
  return (
    <div onClick={onSelect}
      className="bg-white dark:bg-[#0a1209] rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] overflow-hidden hover:border-[#1D9E75] dark:hover:border-[rgba(29,158,117,0.5)] hover:shadow-[0_4px_20px_rgba(14,26,20,0.07)] dark:hover:shadow-[0_0_28px_rgba(29,158,117,0.12)] transition-[border-color,box-shadow] duration-200 cursor-pointer group">
      <div className="h-[110px] flex items-center justify-center text-[52px]"
        style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}>
        {clinic.emoji}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[16px] text-[#0e1a14] dark:text-white mb-1 group-hover:text-[#1D9E75] transition-colors">{clinic.clinicName}</h3>
        <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#6b7c72] dark:text-white/40 mb-3">
          <MapPin size={10} />{clinic.city}, {clinic.state}
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={clinic.rating} />
          <span className="text-[13px] font-semibold text-[#0e1a14] dark:text-white">{clinic.rating.toFixed(1)}</span>
          <span className="text-[11px] text-[#6b7c72] dark:text-white/40">({clinic.reviewCount})</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {clinic.specialties.slice(0, 3).map(s => (
            <span key={s} className="px-2 py-0.5 bg-[rgba(29,158,117,0.12)] text-[#1D9E75] text-[10px] font-mono uppercase tracking-wide rounded-md">{s}</span>
          ))}
          {clinic.specialties.length > 3 && (
            <span className="px-2 py-0.5 bg-[#f2f5f3] dark:bg-white/5 text-[#6b7c72] dark:text-white/40 text-[10px] font-mono rounded-md">+{clinic.specialties.length - 3}</span>
          )}
        </div>
        <button className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl text-[12px] font-mono font-semibold uppercase tracking-widest transition-colors cursor-pointer">
          Ver especialidades →
        </button>
      </div>
    </div>
  )
}

// ── Clinics view ──────────────────────────────────────────────────────────────
function ClinicsView({ clinics, onSelect, isLoading }: { clinics: ClinicPublicProfile[]; onSelect: (c: ClinicPublicProfile) => void; isLoading: boolean }) {
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [specialty, setSpecialty] = useState("")

  const cities     = useMemo(() => [...new Set(clinics.map(c => c.city))].sort(), [clinics])
  const specialties = useMemo(() => {
    const all: string[] = []
    clinics.forEach(c => all.push(...c.specialties))
    return [...new Set(all)].sort()
  }, [clinics])

  const filtered = clinics.filter(c => {
    if (city && c.city !== city) return false
    if (specialty && !c.specialties.includes(specialty)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.clinicName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.specialties.some(s => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  const hasFilters = search || city || specialty

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#E1F5EE] dark:from-[rgba(29,158,117,0.06)] to-transparent px-5 md:px-10 pt-12 pb-10">
        <div className="max-w-[680px] mx-auto text-center">
          <p className="text-[#1D9E75] font-semibold text-[12px] uppercase tracking-widest mb-3">
            {isLoading ? "Carregando clínicas…" : `${clinics.length} clínicas parceiras`}
          </p>
          <h1 className="text-[32px] md:text-[42px] font-bold text-[#0e1a14] dark:text-white mb-3 leading-tight">
            Encontre a consulta<br className="hidden sm:block" /> certa para você
          </h1>
          <p className="text-[15px] text-[#6b7c72] dark:text-white/60 mb-8">
            Busque por clínica, especialidade ou cidade. Agende em minutos.
          </p>
          <div className="relative max-w-[540px] mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7c72]" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por clínica, especialidade..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] bg-white dark:bg-[#0a1209] text-[15px] text-[#0e1a14] dark:text-white placeholder:text-[#aab5af] dark:placeholder:text-white/30 outline-none focus:border-[#1D9E75] shadow-sm dark:shadow-none transition-colors" />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <FilterDropdown value={city} onChange={setCity} options={cities} allLabel="Todas as cidades" icon={MapPin} />
          <FilterDropdown value={specialty} onChange={setSpecialty} options={specialties} allLabel="Todas as especialidades" icon={Stethoscope} />
          {hasFilters && (
            <button onClick={() => { setSearch(""); setCity(""); setSpecialty("") }}
              className="px-3.5 py-2 rounded-xl bg-[#FCEBEB] text-[#791F1F] text-[13px] font-medium hover:bg-[#E24B4A] hover:text-white transition-colors cursor-pointer">
              Limpar
            </button>
          )}
          <span className="ml-auto text-[13px] text-[#6b7c72] dark:text-white/50">
            {filtered.length} clínica{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ClinicCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={42} className="mx-auto mb-3 text-[#d9e3dd]" />
            <p className="text-[17px] font-semibold text-[#0e1a14] mb-1">Nenhuma clínica encontrada</p>
            <p className="text-[14px] text-[#6b7c72]">Tente outros termos ou remova os filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => <ClinicCard key={c.clinicId} clinic={c} onSelect={() => onSelect(c)} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Specialties view ──────────────────────────────────────────────────────────
function SpecialtiesView({ clinic, onSelect }: { clinic: ClinicPublicProfile; onSelect: (s: string) => void }) {
  const [g1, g2] = clinic.gradient
  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20">
      {/* Clinic header */}
      <div className="rounded-2xl overflow-hidden border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] mb-8">
        <div className="h-[96px] flex items-center gap-4 px-6"
          style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}>
          <span className="text-[44px] leading-none">{clinic.emoji}</span>
          <div className="flex-1">
            <h2 className="font-bold text-[20px] text-white">{clinic.clinicName}</h2>
            <div className="flex items-center gap-1 text-white/80 text-[13px]">
              <MapPin size={11} />{clinic.city}, {clinic.state}
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white font-bold text-[17px]">{clinic.rating.toFixed(1)} <span className="text-[#EF9F27]">★</span></p>
            <p className="text-white/70 text-[12px]">{clinic.reviewCount} avaliações</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a1209] px-6 py-3">
          <p className="text-[13px] text-[#6b7c72] dark:text-white/60">{clinic.description}</p>
        </div>
      </div>

      <h2 className="text-[22px] font-bold text-[#0e1a14] dark:text-white mb-1">Escolha a especialidade</h2>
      <p className="text-[14px] text-[#6b7c72] dark:text-white/60 mb-6">
        {clinic.specialties.length} especialidade{clinic.specialties.length !== 1 ? "s" : ""} disponíveis
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {clinic.specialties.map(spec => {
          const Icon = SPECIALTY_ICONS[spec] ?? Stethoscope
          return (
            <button key={spec} onClick={() => onSelect(spec)}
              className="bg-white dark:bg-[#0a1209] rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] p-5 text-center hover:border-[#1D9E75] dark:hover:border-[rgba(29,158,117,0.5)] hover:shadow-[0_4px_20px_rgba(14,26,20,0.07)] dark:hover:shadow-[0_0_20px_rgba(29,158,117,0.12)] transition-[border-color,box-shadow] duration-200 cursor-pointer group">
              <div className="w-12 h-12 bg-[rgba(29,158,117,0.1)] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1D9E75] transition-colors duration-300">
                <Icon size={22} className="text-[#1D9E75] group-hover:text-white transition-colors" />
              </div>
              <p className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#6b7c72] dark:text-white/70 group-hover:text-[#1D9E75] transition-colors">{spec}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Professional card ─────────────────────────────────────────────────────────
function ProfCard({ prof, onSelect }: { prof: ProfFull; onSelect: () => void }) {
  return (
    <div onClick={onSelect}
      className="bg-white dark:bg-[#0a1209] rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] p-5 hover:border-[#1D9E75] dark:hover:border-[rgba(29,158,117,0.5)] hover:shadow-[0_4px_20px_rgba(14,26,20,0.07)] dark:hover:shadow-[0_0_28px_rgba(29,158,117,0.12)] transition-[border-color,box-shadow] duration-200 cursor-pointer group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold flex-shrink-0"
          style={{ background: prof.avatarBg, color: prof.color }}>
          {prof.initials}
        </div>
        <div>
          <h3 className="font-bold text-[15px] text-[#0e1a14] dark:text-white group-hover:text-[#1D9E75] transition-colors">{prof.name}</h3>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#6b7c72] dark:text-white/40">{prof.crm}</p>
        </div>
      </div>
      <p className="text-[13px] text-[#6b7c72] dark:text-white/55 mb-4 line-clamp-2">{prof.bio}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <StarRating rating={prof.rating} />
          <span className="text-[11px] text-[#6b7c72] dark:text-white/40">({prof.reviewCount})</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b7c72] dark:text-white/40">{prof.experienceYears} anos exp.</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#e8ede9] dark:border-[rgba(29,158,117,0.1)]">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#6b7c72] dark:text-white/30">A partir de</p>
          <p className="text-[18px] font-bold text-[#1D9E75]">{prof.price}</p>
        </div>
        <span className="px-4 py-2 bg-[rgba(29,158,117,0.08)] dark:bg-[rgba(29,158,117,0.1)] group-hover:bg-[#1D9E75] text-[#1D9E75] group-hover:text-white rounded-xl text-[11px] font-mono font-semibold uppercase tracking-wider transition-all duration-300">
          Ver horários →
        </span>
      </div>
    </div>
  )
}

// ── Professionals view ────────────────────────────────────────────────────────
function ProfessionalsView({
  clinic, specialty, professionals, onSelect, isLoading,
}: {
  clinic: ClinicPublicProfile; specialty: string; professionals: ProfFull[]; onSelect: (p: ProfFull) => void; isLoading: boolean
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20">
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-[#0e1a14] dark:text-white">{specialty}</h2>
        <p className="text-[14px] text-[#6b7c72] dark:text-white/60">
          {clinic.clinicName} · {isLoading ? "Buscando profissionais…" : `${professionals.length} profissional${professionals.length !== 1 ? "is" : ""}`}
        </p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <ProfCardSkeleton key={i} />)}
        </div>
      ) : professionals.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle size={42} className="mx-auto mb-3 text-[#d9e3dd]" />
          <p className="text-[17px] font-semibold text-[#0e1a14] mb-1">Nenhum profissional disponível</p>
          <p className="text-[14px] text-[#6b7c72]">Não há profissionais ativos para esta especialidade.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {professionals.map(p => <ProfCard key={p.id} prof={p} onSelect={() => onSelect(p)} />)}
        </div>
      )}
    </div>
  )
}

// ── Schedule view ─────────────────────────────────────────────────────────────
function ScheduleView({
  clinic, professional, days, availableSlots, selectedDate, selectedTime, onSelectDate, onSelectTime,
}: {
  clinic: ClinicPublicProfile; professional: ProfFull; days: string[]
  availableSlots: string[]; selectedDate: string | null; selectedTime: string | null
  onSelectDate: (iso: string) => void; onSelectTime: (t: string) => void
}) {
  const daysHaveSlots = useMemo(() => {
    const result: Record<string, boolean> = {}
    for (const iso of days) {
      result[iso] = getAvailableSlots(professional, iso).length > 0
    }
    return result
  }, [professional, days])

  return (
    <div className="max-w-[860px] mx-auto px-5 md:px-10 pb-20">
      {/* Professional compact header */}
      <div className="bg-white dark:bg-[#0a1209] rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.15)] p-5 mb-6 flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold flex-shrink-0"
          style={{ background: professional.avatarBg, color: professional.color }}>
          {professional.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[16px] text-[#0e1a14] dark:text-white">{professional.name}</h3>
          <p className="text-[13px] text-[#6b7c72] dark:text-white/60">{professional.specialty} · {clinic.clinicName}</p>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-bold text-[#1D9E75]">{professional.price}</p>
          <p className="text-[11px] text-[#6b7c72]">por consulta</p>
        </div>
      </div>

      {/* Day picker */}
      <h2 className="text-[16px] font-semibold text-[#0e1a14] dark:text-white mb-3">Escolha a data</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-7" style={{ scrollbarWidth: "none" }}>
        {days.map(iso => {
          const { wd, day, mo } = fmtDay(iso)
          const hasSlots  = daysHaveSlots[iso] ?? false
          const isSel     = iso === selectedDate
          return (
            <button key={iso} onClick={() => hasSlots && onSelectDate(iso)} disabled={!hasSlots}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition-all min-w-[70px] ${
                isSel
                  ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                  : hasSlots
                    ? "bg-white dark:bg-[#0a1209] border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] text-[#0e1a14] dark:text-white hover:border-[#1D9E75] cursor-pointer"
                    : "bg-[#f8faf9] dark:bg-[#060d09] border-[#f2f5f3] dark:border-white/5 text-[#d9e3dd] dark:text-white/15 cursor-not-allowed"
              }`}>
              <span className="text-[10px] font-semibold uppercase tracking-wide">{wd}</span>
              <span className="text-[22px] font-bold leading-tight">{day}</span>
              <span className="text-[10px]">{mo}</span>
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h2 className="text-[16px] font-semibold text-[#0e1a14] dark:text-white mb-3">
            Horários — {fmtLabel(selectedDate)}
          </h2>
          {availableSlots.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-[#0a1209] rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.1)]">
              <Clock size={32} className="mx-auto mb-2 text-[#d9e3dd] dark:text-white/20" />
              <p className="text-[14px] text-[#6b7c72] dark:text-white/60">Nenhum horário disponível nesta data.</p>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-[#6b7c72] dark:text-white/60 mb-3">{availableSlots.length} horários disponíveis — selecione um</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {availableSlots.map(t => (
                  <button key={t} onClick={() => onSelectTime(t)}
                    className={`py-2.5 rounded-xl text-[14px] font-semibold border-2 transition-all cursor-pointer ${
                      selectedTime === t
                        ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                        : "bg-white dark:bg-[#0a1209] border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] text-[#0e1a14] dark:text-white hover:border-[#1D9E75] hover:text-[#1D9E75]"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-10 bg-white dark:bg-[#0a1209] rounded-2xl border border-[#e8ede9] dark:border-[rgba(29,158,117,0.1)]">
          <p className="text-[14px] text-[#6b7c72] dark:text-white/60">Selecione uma data para ver os horários disponíveis.</p>
        </div>
      )}
    </div>
  )
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({
  clinic, professional, dateISO, time,
  paymentMethod, setPaymentMethod,
  user, isLoading, onConfirm, onClose, onLogin, onRegister, confirmSuccess,
}: {
  clinic: ClinicPublicProfile; professional: ProfFull; dateISO: string; time: string
  paymentMethod: string; setPaymentMethod: (v: string) => void
  user: ReturnType<typeof useAuth>["user"]
  isLoading: boolean; onConfirm: () => void; onClose: () => void
  onLogin: () => void; onRegister: () => void; confirmSuccess: boolean
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-[460px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f2f5f3] sticky top-0 bg-white z-10">
          <h2 className="font-bold text-[17px] text-[#0e1a14]">
            {confirmSuccess ? "Consulta agendada!" : "Confirmar consulta"}
          </h2>
          <button onClick={onClose} className="text-[#6b7c72] hover:text-[#0e1a14] cursor-pointer p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {confirmSuccess ? (
          /* ── Success ── */
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-[#1D9E75]" />
            </div>
            <p className="text-[18px] font-bold text-[#0e1a14] mb-1">Tudo certo!</p>
            <p className="text-[14px] text-[#6b7c72] mb-5">Sua consulta foi agendada. Aguarde a confirmação da clínica.</p>
            <div className="bg-[#f8faf9] rounded-xl p-4 text-left grid grid-cols-2 gap-3 mb-5">
              <InfoRow label="Profissional" value={professional.name} />
              <InfoRow label="Clínica" value={clinic.clinicName} />
              <InfoRow label="Data" value={fmtLabel(dateISO)} />
              <InfoRow label="Horário" value={time} />
            </div>
            <p className="text-[12px] text-[#6b7c72] mb-4">Acompanhe em <strong>Meu Perfil → Consultas</strong></p>
            <button onClick={onClose} className="w-full py-3 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl font-semibold transition-colors cursor-pointer">
              Fechar
            </button>
          </div>
        ) : !user && !isLoading ? (
          /* ── Login required ── */
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-[#FEF3E2] rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-[#854F0B]" />
            </div>
            <p className="text-[16px] font-bold text-[#0e1a14] mb-1">Login necessário</p>
            <p className="text-[13px] text-[#6b7c72] mb-4">Faça login ou crie uma conta para confirmar a consulta.</p>
            <div className="bg-[#f8faf9] rounded-xl p-4 text-left mb-5">
              <p className="text-[13px] font-semibold text-[#0e1a14]">{professional.name}</p>
              <p className="text-[12px] text-[#6b7c72]">{fmtLabel(dateISO)} às {time} · {clinic.clinicName}</p>
              <p className="text-[13px] font-bold text-[#1D9E75] mt-1">{professional.price}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { onClose(); onLogin() }}
                className="flex-1 py-2.5 border border-[#d9e3dd] rounded-xl text-[14px] font-medium text-[#0e1a14] hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors cursor-pointer">
                Entrar
              </button>
              <button onClick={() => { onClose(); onRegister() }}
                className="flex-1 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] rounded-xl text-[14px] font-medium text-white transition-colors cursor-pointer">
                Criar conta
              </button>
            </div>
          </div>
        ) : (
          /* ── Booking form ── */
          <div className="p-6 space-y-4">
            {/* Summary card */}
            <div className="bg-[#f8faf9] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                  style={{ background: professional.avatarBg, color: professional.color }}>
                  {professional.initials}
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-[#0e1a14]">{professional.name}</p>
                  <p className="text-[12px] text-[#6b7c72]">{professional.specialty} · {clinic.clinicName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e8ede9]">
                <InfoRow label="Data" value={fmtLabel(dateISO)} />
                <InfoRow label="Horário" value={time} />
                <InfoRow label="Local" value={clinic.city + ", " + clinic.state} />
                <InfoRow label="Valor" value={professional.price} />
              </div>
            </div>

            {/* Patient info */}
            {user && (
              <div className="flex items-center gap-2 text-[13px] bg-[#E1F5EE] rounded-xl px-3 py-2.5">
                <CheckCircle2 size={14} className="text-[#1D9E75] flex-shrink-0" />
                <span className="text-[#6b7c72]">Paciente: <strong className="text-[#0e1a14]">{user.firstName} {user.lastName}</strong></span>
              </div>
            )}

            {/* Payment */}
            <div>
              <p className="text-[12px] font-semibold text-[#2a3d33] mb-2">Forma de pagamento</p>
              <div className="grid grid-cols-3 gap-2">
                {["Pix", "Cartão", "Convênio"].map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`py-2.5 rounded-xl text-[13px] font-medium border-2 transition-all cursor-pointer ${
                      paymentMethod === m
                        ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                        : "border-[#d9e3dd] text-[#6b7c72] hover:border-[#1D9E75] hover:text-[#1D9E75]"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={onConfirm}
              className="w-full py-3.5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl font-bold text-[15px] transition-colors cursor-pointer">
              Confirmar consulta
            </button>
            <p className="text-[11px] text-[#6b7c72] text-center">A clínica confirmará o agendamento em breve.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BuscarPage() {
  const router = useRouter()
  const { user, isLoading, bookAppointment } = useAuth()

  const [view,                setView]               = useState<View>("clinics")
  const [selectedClinic,      setSelectedClinic]     = useState<ClinicPublicProfile | null>(null)
  const [selectedSpecialty,   setSelectedSpecialty]  = useState<string | null>(null)
  const [selectedProfessional,setSelectedProfessional] = useState<ProfFull | null>(null)
  const [selectedDate,        setSelectedDate]       = useState<string | null>(null)
  const [selectedTime,        setSelectedTime]       = useState<string | null>(null)

  const [confirmOpen,    setConfirmOpen]    = useState(false)
  const [confirmSuccess, setConfirmSuccess] = useState(false)
  const [paymentMethod,  setPaymentMethod]  = useState("Pix")

  const [loginOpen,    setLoginOpen]    = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const [clinics,        setClinics]        = useState<ClinicPublicProfile[]>([])
  const [professionals,  setProfessionals]  = useState<ProfFull[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const [clinicsReady, setClinicsReady] = useState(false)

  const DAYS = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      return d.toISOString().slice(0, 10)
    })
  }, [])

  useEffect(() => {
    seedAllPublicData()
    const allClinics = getPublicClinics()

    const cId = new URLSearchParams(window.location.search).get("c")
    if (cId) {
      const match = allClinics.find(c => c.clinicId === cId)
      if (match) {
        setClinics(allClinics)
        setSelectedClinic(match)
        setSelectedSpecialty(null)
        setSelectedProfessional(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setView("specialties")
        setClinicsReady(true)
      }
      return
    }

    setClinics(allClinics)
    setClinicsReady(true)
  }, [])

  useEffect(() => {
    if (!selectedClinic || !selectedSpecialty) return
    setProfessionals(getPublicProfessionals(selectedClinic.clinicId, selectedSpecialty))
  }, [selectedClinic, selectedSpecialty])

  useEffect(() => {
    if (!selectedProfessional || !selectedDate) { setAvailableSlots([]); return }
    setAvailableSlots(getAvailableSlots(selectedProfessional, selectedDate))
  }, [selectedProfessional, selectedDate])

  function scrollTop() { window.scrollTo({ top: 0, behavior: "smooth" }) }

  function goToSpecialties(clinic: ClinicPublicProfile) {
    setSelectedClinic(clinic); setSelectedSpecialty(null)
    setProfessionals([]); setSelectedProfessional(null)
    setSelectedDate(null); setSelectedTime(null)
    setView("specialties"); scrollTop()
  }

  function goToProfessionals(specialty: string) {
    setSelectedSpecialty(specialty); setSelectedProfessional(null)
    setSelectedDate(null); setSelectedTime(null)
    setView("professionals"); scrollTop()
  }

  function goToSchedule(prof: ProfFull) {
    setSelectedProfessional(prof); setSelectedDate(null); setSelectedTime(null)
    setView("schedule"); scrollTop()
  }

  function goBack() {
    if (view === "specialties")   setView("clinics")
    else if (view === "professionals") { setView("specialties"); setSelectedSpecialty(null) }
    else if (view === "schedule") setView("professionals")
    scrollTop()
  }

  function handleSelectTime(time: string) {
    setSelectedTime(time); setConfirmSuccess(false); setConfirmOpen(true)
  }

  function handleConfirm() {
    if (!user || !selectedClinic || !selectedProfessional || !selectedDate || !selectedTime) return
    const sharedId  = crypto.randomUUID()
    const dateLabel = fmtLabel(selectedDate)

    addGlobalAppointment({
      id: sharedId,
      patientId:    user.id,
      patientName:  `${user.firstName} ${user.lastName}`,
      patientEmail: user.email,
      patientPhone: user.phone || "",
      clinicId:     selectedClinic.clinicId,
      clinicName:   selectedClinic.clinicName,
      doctorId:     selectedProfessional.id,
      doctorName:   selectedProfessional.name,
      specialty:    selectedProfessional.specialty,
      date:         dateLabel,
      dateISO:      selectedDate,
      time:         selectedTime,
      price:        selectedProfessional.price,
      payment:      paymentMethod,
      status:       "pending",
      notes:        "",
      doctorNotes:  "",
      createdAt:    new Date().toISOString(),
    })

    bookAppointment({
      id:        sharedId,
      clinic:    selectedClinic.clinicName,
      doctor:    selectedProfessional.name,
      specialty: selectedProfessional.specialty,
      price:     selectedProfessional.price,
      date:      dateLabel,
      time:      selectedTime,
      payment:   paymentMethod,
      status:    "upcoming",
    })

    setConfirmSuccess(true)
    setAvailableSlots(getAvailableSlots(selectedProfessional, selectedDate))
  }

  function handleProfileClick() {
    if (user) router.push("/profile")
    else setLoginOpen(true)
  }

  return (
    <>
      <Navbar
        onProfileClick={handleProfileClick}
        currentPage="buscar"
      />

      <main id="main-content" className="pt-[66px] min-h-screen bg-white dark:bg-[#060d09]">
        {view !== "clinics" && (
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-6">
            <Breadcrumb
              view={view}
              clinic={selectedClinic}
              specialty={selectedSpecialty}
              professional={selectedProfessional}
              onBack={goBack}
            />
          </div>
        )}

        {view === "clinics" && <ClinicsView clinics={clinics} onSelect={goToSpecialties} isLoading={!clinicsReady} />}

        {view === "specialties" && selectedClinic && (
          <SpecialtiesView clinic={selectedClinic} onSelect={goToProfessionals} />
        )}

        {view === "professionals" && selectedClinic && selectedSpecialty && (
          <ProfessionalsView
            clinic={selectedClinic}
            specialty={selectedSpecialty}
            professionals={professionals}
            onSelect={goToSchedule}
            isLoading={false}
          />
        )}

        {view === "schedule" && selectedClinic && selectedProfessional && (
          <ScheduleView
            clinic={selectedClinic}
            professional={selectedProfessional}
            days={DAYS}
            availableSlots={availableSlots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={handleSelectTime}
          />
        )}
      </main>

      {confirmOpen && selectedClinic && selectedProfessional && selectedDate && selectedTime && (
        <ConfirmModal
          clinic={selectedClinic}
          professional={selectedProfessional}
          dateISO={selectedDate}
          time={selectedTime}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          user={user}
          isLoading={isLoading}
          onConfirm={handleConfirm}
          onClose={() => setConfirmOpen(false)}
          onLogin={() => setLoginOpen(true)}
          onRegister={() => setRegisterOpen(true)}
          confirmSuccess={confirmSuccess}
        />
      )}

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }}
      />
    </>
  )
}
