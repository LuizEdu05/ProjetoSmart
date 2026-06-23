"use client"

export interface Professional {
  id: string
  clinicId: string
  name: string
  specialty: string
  crm: string
  email: string
  phone: string
  initials: string
  color: string
  avatarBg: string
  active: boolean
  schedule: WeekSchedule
}

export interface WeekSchedule {
  seg: DaySlot; ter: DaySlot; qua: DaySlot; qui: DaySlot; sex: DaySlot; sab: DaySlot; dom: DaySlot
}

export interface DaySlot {
  active: boolean
  start: string
  end: string
  interval: number // minutes
}

export interface ClinicAdmin {
  id: string
  clinicId: string
  clinicName: string
  email: string
  password: string
  ownerName: string
  phone: string
  address: string
  specialty: string
}

const CLINIC_ADMINS_KEY = "sc_clinic_admins"
const CLINIC_SESSION_KEY = "sc_clinic_session"
const PROFESSIONALS_KEY = "sc_professionals"

const DEFAULT_SCHEDULE: WeekSchedule = {
  seg: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  ter: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  qua: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  qui: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  sex: { active: true,  start: "08:00", end: "17:00", interval: 30 },
  sab: { active: false, start: "08:00", end: "12:00", interval: 30 },
  dom: { active: false, start: "08:00", end: "12:00", interval: 30 },
}

// ── Seed demo clinic admins ────────────────────────────────────────────────
export function seedClinicAdmins() {
  if (typeof window === "undefined") return
  if (localStorage.getItem(CLINIC_ADMINS_KEY)) return
  const demos: ClinicAdmin[] = [
    { id:"clinic1", clinicId:"c1", clinicName:"Clínica Saúde & Vida", email:"clinica@smartconsulta.com", password:"admin123", ownerName:"Dr. Felipe Moura", phone:"(47) 3322-1111", address:"Rua das Flores, 123 — Joinville, SC", specialty:"Clínica Geral" },
  ]
  localStorage.setItem(CLINIC_ADMINS_KEY, JSON.stringify(demos))
}

export function loginClinic(email: string, password: string): ClinicAdmin {
  const list: ClinicAdmin[] = JSON.parse(localStorage.getItem(CLINIC_ADMINS_KEY) || "[]")
  const found = list.find(c => c.email.toLowerCase() === email.toLowerCase())
  if (!found || found.password !== password) throw new Error("E-mail ou senha inválidos.")
  return found
}

export function getClinicSession(): ClinicAdmin | null {
  try { return JSON.parse(localStorage.getItem(CLINIC_SESSION_KEY) || "null") }
  catch { return null }
}

export function saveClinicSession(c: ClinicAdmin) {
  localStorage.setItem(CLINIC_SESSION_KEY, JSON.stringify(c))
}

export function clearClinicSession() {
  localStorage.removeItem(CLINIC_SESSION_KEY)
}

// ── Professionals ──────────────────────────────────────────────────────────
export function getProfessionals(clinicId: string): Professional[] {
  try {
    const all: Professional[] = JSON.parse(localStorage.getItem(PROFESSIONALS_KEY) || "[]")
    return all.filter(p => p.clinicId === clinicId)
  } catch { return [] }
}

export function seedProfessionals(clinicId: string) {
  const existing: Professional[] = JSON.parse(localStorage.getItem(PROFESSIONALS_KEY) || "[]")
  if (existing.some(p => p.clinicId === clinicId)) return
  const demos: Professional[] = [
    { id:"dr1", clinicId, name:"Dr. Felipe Moura", specialty:"Clínica Geral", crm:"CRM/SC 12345", email:"felipe@clinica.com", phone:"(47) 99111-1111", initials:"FM", color:"#0F6E56", avatarBg:"#E1F5EE", active:true, schedule: DEFAULT_SCHEDULE },
    { id:"dr2", clinicId, name:"Dra. Ana Ribeiro", specialty:"Cardiologia", crm:"CRM/SC 23456", email:"ana@clinica.com", phone:"(47) 99222-2222", initials:"AR", color:"#993556", avatarBg:"#FBEAF0", active:true, schedule: DEFAULT_SCHEDULE },
    { id:"dr3", clinicId, name:"Dr. Lucas Peixoto", specialty:"Ortopedia", crm:"CRM/SC 34567", email:"lucas@clinica.com", phone:"(47) 99333-3333", initials:"LP", color:"#185FA5", avatarBg:"#E6F1FB", active:true, schedule: DEFAULT_SCHEDULE },
    { id:"dr4", clinicId, name:"Dra. Camila Nunes", specialty:"Dermatologia", crm:"CRM/SC 45678", email:"camila@clinica.com", phone:"(47) 99444-4444", initials:"CN", color:"#633806", avatarBg:"#FAEEDA", active:false, schedule: DEFAULT_SCHEDULE },
  ]
  localStorage.setItem(PROFESSIONALS_KEY, JSON.stringify([...existing, ...demos]))
}

export function saveProfessionals(clinicId: string, list: Professional[]) {
  const all: Professional[] = JSON.parse(localStorage.getItem(PROFESSIONALS_KEY) || "[]")
  const others = all.filter(p => p.clinicId !== clinicId)
  localStorage.setItem(PROFESSIONALS_KEY, JSON.stringify([...others, ...list]))
}

export function addProfessional(p: Omit<Professional, "id">): Professional {
  const all: Professional[] = JSON.parse(localStorage.getItem(PROFESSIONALS_KEY) || "[]")
  const newP = { ...p, id: "dr" + Date.now() }
  localStorage.setItem(PROFESSIONALS_KEY, JSON.stringify([...all, newP]))
  return newP
}

export function updateProfessional(updated: Professional) {
  const all: Professional[] = JSON.parse(localStorage.getItem(PROFESSIONALS_KEY) || "[]")
  const next = all.map(p => p.id === updated.id ? updated : p)
  localStorage.setItem(PROFESSIONALS_KEY, JSON.stringify(next))
}
