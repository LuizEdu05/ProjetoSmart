"use client"

import { getProfessionals, type Professional, type WeekSchedule } from "@/lib/clinic-store"
import { getAllAppointments } from "@/lib/global-appointments"

// ── Public clinic profile ─────────────────────────────────────────────────────
export interface ClinicPublicProfile {
  clinicId: string
  clinicName: string
  city: string
  state: string
  rating: number
  reviewCount: number
  specialties: string[]
  gradient: [string, string]
  emoji: string
  description: string
}

// ── Extended professional data ────────────────────────────────────────────────
interface ProfessionalExtended {
  id: string
  bio: string
  rating: number
  reviewCount: number
  experienceYears: number
  price: string
}

export type ProfFull = Professional & ProfessionalExtended

// ── Storage keys ──────────────────────────────────────────────────────────────
const PUBLIC_CLINICS_KEY = "sc_public_clinics"
const PROF_EXTENDED_KEY  = "sc_prof_extended"
const DATA_VERSION_KEY   = "sc_data_version"
const DATA_VERSION       = "v3" // bump when DEMO_CLINICS or DEMO_PROFESSIONALS change

// ── Demo clinic data ──────────────────────────────────────────────────────────
const DEMO_CLINICS: ClinicPublicProfile[] = [
  {
    clinicId: "c1",
    clinicName: "Clínica Saúde & Vida",
    city: "Jaraguá do Sul",
    state: "SC",
    rating: 4.8,
    reviewCount: 312,
    specialties: ["Clínica Geral", "Cardiologia", "Ortopedia", "Dermatologia"],
    gradient: ["#1D9E75", "#0F6E56"],
    emoji: "🏥",
    description: "Centro médico completo com especialistas renomados e atendimento humanizado. Mais de 15 anos cuidando da saúde de Jaraguá do Sul.",
  },
  {
    clinicId: "c2",
    clinicName: "CardioCenter Jaraguá do Sul",
    city: "Jaraguá do Sul",
    state: "SC",
    rating: 4.9,
    reviewCount: 547,
    specialties: ["Cardiologia", "Medicina Interna", "Clínica Geral"],
    gradient: ["#E24B4A", "#993556"],
    emoji: "❤️",
    description: "Especialistas em saúde cardiovascular com equipamentos de última geração. Referência em cardiologia no norte de Santa Catarina.",
  },
  {
    clinicId: "c3",
    clinicName: "Clínica Infantil Crescer",
    city: "Guaramirim",
    state: "SC",
    rating: 4.7,
    reviewCount: 228,
    specialties: ["Pediatria", "Neonatologia", "Clínica Geral"],
    gradient: ["#EF9F27", "#e67e22"],
    emoji: "👶",
    description: "Cuidado especial para os pequenos com médicos pediatras experientes. Ambiente acolhedor e pensado para o conforto das crianças e famílias de Guaramirim.",
  },
  {
    clinicId: "c4",
    clinicName: "OdontoMais Guaramirim",
    city: "Guaramirim",
    state: "SC",
    rating: 4.6,
    reviewCount: 183,
    specialties: ["Odontologia", "Ortodontia"],
    gradient: ["#378ADD", "#185FA5"],
    emoji: "🦷",
    description: "Clínica odontológica completa oferecendo desde tratamentos preventivos até implantes. Tecnologia digital e atendimento personalizado em Guaramirim.",
  },
  {
    clinicId: "c5",
    clinicName: "Espaço NutriMente",
    city: "Schroeder",
    state: "SC",
    rating: 4.5,
    reviewCount: 97,
    specialties: ["Nutrição", "Psicologia"],
    gradient: ["#7F77DD", "#4C3B8C"],
    emoji: "🌿",
    description: "Clínica integrada de saúde mental e nutrição. Abordagem multidisciplinar para o bem-estar completo do paciente em Schroeder.",
  },
  {
    clinicId: "c6",
    clinicName: "FisioMovimento Schroeder",
    city: "Schroeder",
    state: "SC",
    rating: 4.7,
    reviewCount: 142,
    specialties: ["Fisioterapia", "Ortopedia"],
    gradient: ["#0F6E56", "#1D9E75"],
    emoji: "🏃",
    description: "Centro de fisioterapia e reabilitação com fisioterapeutas especializados em ortopedia, neurologia e esportiva em Schroeder.",
  },
]

// ── Default extended data per professional ────────────────────────────────────
const DEFAULT_EXTENDED: Record<string, Omit<ProfessionalExtended, "id">> = {
  // c1 professionals (dr1-dr4 seeded by clinic-store)
  dr1: { bio: "Clínico geral com 18 anos de experiência, especialista em medicina preventiva e atenção primária.",                               rating: 4.9, reviewCount: 203, experienceYears: 18, price: "R$ 180,00" },
  dr2: { bio: "Cardiologista com foco em arritmias e insuficiência cardíaca. Mestre em cardiologia pela USP.",                                    rating: 4.8, reviewCount: 167, experienceYears: 14, price: "R$ 280,00" },
  dr3: { bio: "Ortopedista especializado em cirurgia do joelho e ombro. Médico do esporte com experiência em atletas profissionais.",              rating: 4.7, reviewCount: 134, experienceYears: 11, price: "R$ 250,00" },
  dr4: { bio: "Dermatologista com expertise em dermatologia estética e oncológica. Doutoranda em melanoma pela UNIFESP.",                          rating: 4.6, reviewCount: 89,  experienceYears: 8,  price: "R$ 220,00" },
  // c2 professionals
  c2dr1: { bio: "Cardiologista intervencionista, referência em cateterismo e angioplastia coronária no Estado de SP.",                            rating: 5.0, reviewCount: 312, experienceYears: 22, price: "R$ 400,00" },
  c2dr2: { bio: "Especialista em medicina interna e cardiologia clínica. Professora na Faculdade de Medicina da USP.",                            rating: 4.9, reviewCount: 245, experienceYears: 19, price: "R$ 350,00" },
  c2dr3: { bio: "Clínico geral integrado à equipe cardio para triagem e acompanhamento de risco cardiovascular.",                                  rating: 4.7, reviewCount: 178, experienceYears: 12, price: "R$ 200,00" },
  // c3 professionals
  c3dr1: { bio: "Pediatra com especialização em desenvolvimento infantil e nutrologia pediátrica. Linguagem simples e acolhedora.",                rating: 4.8, reviewCount: 156, experienceYears: 15, price: "R$ 220,00" },
  c3dr2: { bio: "Neonatologista com UTI neonatal. Referência em prematuridade e cuidados intensivos do recém-nascido.",                           rating: 4.7, reviewCount: 98,  experienceYears: 10, price: "R$ 280,00" },
  // c4 professionals
  c4dr1: { bio: "Cirurgião dentista especializado em implantodontia e prótese sobre implante. Mais de 2000 implantes realizados com sucesso.",     rating: 4.8, reviewCount: 112, experienceYears: 16, price: "R$ 200,00" },
  c4dr2: { bio: "Ortodontista com especialização em aparelho autoligado e alinhadores invisíveis. Transforme seu sorriso!",                       rating: 4.5, reviewCount: 87,  experienceYears: 9,  price: "R$ 180,00" },
  // c5 professionals
  c5dr1: { bio: "Nutricionista clínica especializada em reeducação alimentar, emagrecimento sustentável e nutrição esportiva.",                    rating: 4.6, reviewCount: 73,  experienceYears: 7,  price: "R$ 160,00" },
  c5dr2: { bio: "Psicólogo cognitivo-comportamental especializado em ansiedade, depressão e autoconhecimento.",                                    rating: 4.5, reviewCount: 62,  experienceYears: 8,  price: "R$ 180,00" },
  // c6 professionals
  c6dr1: { bio: "Fisioterapeuta ortopédica e esportiva. Especialista em reabilitação pós-cirúrgica e lesões esportivas de alta performance.",      rating: 4.7, reviewCount: 94,  experienceYears: 10, price: "R$ 150,00" },
  c6dr2: { bio: "Fisioterapeuta com especialização em fisioterapia neurológica e reabilitação de AVC e lesões medulares.",                         rating: 4.6, reviewCount: 68,  experienceYears: 8,  price: "R$ 140,00" },
}

// ── Demo professionals for c2-c6 (c1 is seeded by clinic-store) ───────────────
const BASE_SCHEDULE = {
  seg: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  ter: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  qua: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  qui: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  sex: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  sab: { active: false, start: "08:00", end: "12:00", interval: 30 },
  dom: { active: false, start: "08:00", end: "12:00", interval: 30 },
} satisfies WeekSchedule

const DEMO_PROFESSIONALS: Professional[] = [
  // c2 – CardioCenter Jaraguá do Sul
  { id:"c2dr1", clinicId:"c2", name:"Dr. Roberto Almeida",  specialty:"Cardiologia",       crm:"CRM/SC 98765", email:"roberto@cardiocenter.com", phone:"(47) 99100-1111", initials:"RA", color:"#791F1F", avatarBg:"#FCEBEB", active:true, schedule: BASE_SCHEDULE },
  { id:"c2dr2", clinicId:"c2", name:"Dra. Patrícia Lemos",  specialty:"Medicina Interna",  crm:"CRM/SC 87654", email:"patricia@cardiocenter.com", phone:"(47) 99100-2222", initials:"PL", color:"#993556", avatarBg:"#FBEAF0", active:true, schedule: BASE_SCHEDULE },
  { id:"c2dr3", clinicId:"c2", name:"Dr. André Souza",      specialty:"Clínica Geral",     crm:"CRM/SC 76543", email:"andre@cardiocenter.com",    phone:"(47) 99100-3333", initials:"AS", color:"#0F6E56", avatarBg:"#E1F5EE", active:true, schedule: BASE_SCHEDULE },
  // c3 – Infantil Crescer Guaramirim
  { id:"c3dr1", clinicId:"c3", name:"Dra. Marina Costa",    specialty:"Pediatria",         crm:"CRM/SC 55443", email:"marina@crescer.com",        phone:"(47) 99200-1111", initials:"MC", color:"#633806", avatarBg:"#FAEEDA", active:true, schedule: BASE_SCHEDULE },
  { id:"c3dr2", clinicId:"c3", name:"Dr. Paulo Henrique",   specialty:"Neonatologia",      crm:"CRM/SC 44332", email:"paulo@crescer.com",         phone:"(47) 99200-2222", initials:"PH", color:"#185FA5", avatarBg:"#E6F1FB", active:true, schedule: { ...BASE_SCHEDULE, seg: { active: true, start: "09:00", end: "16:00", interval: 45 } } },
  // c4 – OdontoMais Guaramirim
  { id:"c4dr1", clinicId:"c4", name:"Dr. Gustavo Ferreira", specialty:"Odontologia",       crm:"CRO/SC 11223", email:"gustavo@odontomais.com",    phone:"(47) 99300-1111", initials:"GF", color:"#185FA5", avatarBg:"#E6F1FB", active:true, schedule: BASE_SCHEDULE },
  { id:"c4dr2", clinicId:"c4", name:"Dra. Letícia Rocha",   specialty:"Ortodontia",        crm:"CRO/SC 22334", email:"leticia@odontomais.com",    phone:"(47) 99300-2222", initials:"LR", color:"#4C3B8C", avatarBg:"#EEEAFA", active:true, schedule: { ...BASE_SCHEDULE, sab: { active: true, start: "08:00", end: "12:00", interval: 60 } } },
  // c5 – Espaço NutriMente Schroeder
  { id:"c5dr1", clinicId:"c5", name:"Dra. Beatriz Santos",  specialty:"Nutrição",          crm:"CRN/SC 33445", email:"beatriz@nutrimente.com",    phone:"(47) 99400-1111", initials:"BS", color:"#7F77DD", avatarBg:"#EEEAFA", active:true, schedule: BASE_SCHEDULE },
  { id:"c5dr2", clinicId:"c5", name:"Dr. Thiago Marques",   specialty:"Psicologia",        crm:"CRP/SC 44556", email:"thiago@nutrimente.com",     phone:"(47) 99400-2222", initials:"TM", color:"#4C3B8C", avatarBg:"#EEEAFA", active:true, schedule: { ...BASE_SCHEDULE, qua: { active: false, start: "08:00", end: "17:00", interval: 50 } } },
  // c6 – FisioMovimento Schroeder
  { id:"c6dr1", clinicId:"c6", name:"Dra. Juliana Pereira", specialty:"Fisioterapia",      crm:"CREFITO/SC 55667", email:"juliana@fisiomov.com", phone:"(47) 99500-1111", initials:"JP", color:"#0F6E56", avatarBg:"#E1F5EE", active:true, schedule: BASE_SCHEDULE },
  { id:"c6dr2", clinicId:"c6", name:"Dr. Renato Oliveira",  specialty:"Fisioterapia",      crm:"CREFITO/SC 66778", email:"renato@fisiomov.com",  phone:"(47) 99500-2222", initials:"RO", color:"#185FA5", avatarBg:"#E6F1FB", active:true, schedule: { ...BASE_SCHEDULE, ter: { active: true, start: "10:00", end: "18:00", interval: 40 } } },
]

// ── Seed all public data ──────────────────────────────────────────────────────
export function seedAllPublicData() {
  if (typeof window === "undefined") return

  const stale = localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION
  if (stale) {
    localStorage.removeItem(PUBLIC_CLINICS_KEY)
    localStorage.removeItem(PROF_EXTENDED_KEY)
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION)
  }

  if (!localStorage.getItem(PUBLIC_CLINICS_KEY)) {
    localStorage.setItem(PUBLIC_CLINICS_KEY, JSON.stringify(DEMO_CLINICS))
  }

  const PROF_KEY = "sc_professionals"
  try {
    const existing: Professional[] = JSON.parse(localStorage.getItem(PROF_KEY) || "[]")
    const toAdd = DEMO_PROFESSIONALS.filter(p => !existing.some(e => e.id === p.id))
    if (toAdd.length > 0) {
      localStorage.setItem(PROF_KEY, JSON.stringify([...existing, ...toAdd]))
    }
  } catch {}

  if (!localStorage.getItem(PROF_EXTENDED_KEY)) {
    const extended: ProfessionalExtended[] = Object.entries(DEFAULT_EXTENDED).map(
      ([id, data]) => ({ id, ...data })
    )
    localStorage.setItem(PROF_EXTENDED_KEY, JSON.stringify(extended))
  }
}

// ── Read functions ────────────────────────────────────────────────────────────
export function getPublicClinics(): ClinicPublicProfile[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(PUBLIC_CLINICS_KEY) || "[]") }
  catch { return DEMO_CLINICS }
}

function getExtendedMap(): Record<string, ProfessionalExtended> {
  if (typeof window === "undefined") return {}
  try {
    const list: ProfessionalExtended[] = JSON.parse(localStorage.getItem(PROF_EXTENDED_KEY) || "[]")
    return Object.fromEntries(list.map(e => [e.id, e]))
  } catch { return {} }
}

function mergeProf(base: Professional, ext: ProfessionalExtended | undefined): ProfFull {
  return {
    ...base,
    bio:             ext?.bio             ?? "Profissional de saúde com ampla experiência clínica.",
    rating:          ext?.rating          ?? 4.5,
    reviewCount:     ext?.reviewCount     ?? 20,
    experienceYears: ext?.experienceYears ?? 5,
    price:           ext?.price           ?? "R$ 200,00",
  }
}

export function getPublicProfessionals(clinicId: string, specialty?: string): ProfFull[] {
  const base    = getProfessionals(clinicId).filter(p => p.active)
  const extMap  = getExtendedMap()
  const merged  = base.map(p => mergeProf(p, extMap[p.id]))
  return specialty ? merged.filter(p => p.specialty === specialty) : merged
}

// ── Available slots ───────────────────────────────────────────────────────────
const DAY_KEYS: (keyof WeekSchedule)[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]

export function getAvailableSlots(prof: ProfFull, dateISO: string): string[] {
  const d      = new Date(dateISO + "T12:00:00")
  const dayKey = DAY_KEYS[d.getDay()]!
  const slot   = prof.schedule[dayKey]
  if (!slot.active) return []

  const [sh, sm] = slot.start.split(":").map(Number)
  const [eh, em] = slot.end.split(":").map(Number)
  const startMin = sh! * 60 + sm!
  const endMin   = eh! * 60 + em!

  const allSlots: string[] = []
  for (let m = startMin; m + slot.interval <= endMin; m += slot.interval) {
    const h   = Math.floor(m / 60)
    const min = m % 60
    allSlots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`)
  }

  const booked = getAllAppointments()
    .filter(a => a.doctorId === prof.id && a.dateISO === dateISO && a.status !== "cancelled")
    .map(a => a.time)

  return allSlots.filter(s => !booked.includes(s))
}
