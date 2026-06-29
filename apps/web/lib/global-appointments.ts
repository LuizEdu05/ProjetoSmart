"use client"

// Shared appointment store — patients, clinic and doctor portals all read/write here.

export type ApptStatus =
  | "pending"       // patient booked, awaiting clinic confirmation
  | "scheduled"     // clinic accepted / confirmed by clinic
  | "confirmed"     // doctor confirmed attendance
  | "rescheduled"   // appointment was rescheduled
  | "in-progress"   // doctor is currently attending
  | "completed"     // appointment finished
  | "cancelled"     // cancelled by any party
  | "no-show"       // patient didn't show up

export interface GlobalAppointment {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  clinicId: string
  clinicName: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string        // "Sex, 14 Mar"
  dateISO: string     // "2026-03-14"
  time: string        // "10:00"
  price: string       // "R$ 150,00"
  payment: string
  status: ApptStatus
  notes: string       // clinic internal notes
  doctorNotes: string // doctor notes (visible to doctor + clinic)
  createdAt: string
  updatedAt?: string
}

export interface WaitingEntry {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  clinicId: string
  doctorId: string
  specialty: string
  preferredDateISO: string
  createdAt: string
}

const KEY = "sc_global_appointments"
const WAITING_KEY = "sc_waiting_list"

export function getAllAppointments(): GlobalAppointment[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function saveAllAppointments(list: GlobalAppointment[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function addGlobalAppointment(appt: GlobalAppointment) {
  const list = getAllAppointments()
  list.push(appt)
  saveAllAppointments(list)
}

export function rescheduleGlobalAppointment(
  id: string,
  date: string,
  dateISO: string,
  time: string
) {
  const list = getAllAppointments().map(a =>
    a.id === id
      ? { ...a, date, dateISO, time, status: "rescheduled" as ApptStatus, updatedAt: new Date().toISOString() }
      : a
  )
  saveAllAppointments(list)
}

export function updateAppointmentStatus(id: string, status: ApptStatus) {
  const list = getAllAppointments().map((a) =>
    a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
  )
  saveAllAppointments(list)
  return list
}

export function updateAppointmentNotes(id: string, notes: string) {
  const list = getAllAppointments().map((a) =>
    a.id === id ? { ...a, notes, updatedAt: new Date().toISOString() } : a
  )
  saveAllAppointments(list)
  return list
}

export function updateAppointmentDoctorNotes(id: string, doctorNotes: string) {
  const list = getAllAppointments().map((a) =>
    a.id === id ? { ...a, doctorNotes, updatedAt: new Date().toISOString() } : a
  )
  saveAllAppointments(list)
  return list
}

export function getAppointmentById(id: string): GlobalAppointment | undefined {
  return getAllAppointments().find(a => a.id === id)
}

export function getAppointmentsByDoctor(doctorId: string): GlobalAppointment[] {
  return getAllAppointments().filter(a => a.doctorId === doctorId)
}

export function getAppointmentsByPatient(patientId: string): GlobalAppointment[] {
  return getAllAppointments().filter(a => a.patientId === patientId)
}

/** Returns booked time slots for a specific doctor on a given date */
export function getBookedSlots(clinicId: string, dateISO: string, doctorId?: string): string[] {
  return getAllAppointments()
    .filter(
      (a) =>
        a.clinicId === clinicId &&
        a.dateISO === dateISO &&
        (doctorId ? a.doctorId === doctorId : true) &&
        a.status !== "cancelled" &&
        a.status !== "no-show"
    )
    .map((a) => a.time)
}

// ── Waiting list ──────────────────────────────────────────────────────────────
export function getWaitingList(clinicId?: string): WaitingEntry[] {
  if (typeof window === "undefined") return []
  try {
    const list: WaitingEntry[] = JSON.parse(localStorage.getItem(WAITING_KEY) || "[]")
    return clinicId ? list.filter((e) => e.clinicId === clinicId) : list
  } catch {
    return []
  }
}

export function addToWaitingList(entry: WaitingEntry) {
  const list = getWaitingList()
  list.push(entry)
  localStorage.setItem(WAITING_KEY, JSON.stringify(list))
}

export function removeFromWaitingList(id: string) {
  const list = getWaitingList().filter((e) => e.id !== id)
  localStorage.setItem(WAITING_KEY, JSON.stringify(list))
}

// ── Demo seed ─────────────────────────────────────────────────────────────────
export function seedDemoAppointments(clinicId: string) {
  const existing = getAllAppointments()
  if (existing.some((a) => a.clinicId === clinicId)) return

  const today = new Date()
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const label = (d: Date) => {
    const wd = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]!
    const mo = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][d.getMonth()]!
    return `${wd}, ${d.getDate()} ${mo}`
  }
  const add = (n: number) => { const d = new Date(today); d.setDate(today.getDate() + n); return d }

  const demos: GlobalAppointment[] = [
    { id:"demo1", patientId:"p1", patientName:"Maria Lima",     patientEmail:"maria@email.com",    patientPhone:"(47) 99111-2222", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura",   specialty:"Clínica Geral", date:label(today),  dateISO:fmt(today),  time:"08:00", price:"R$ 150,00", payment:"Cartão", status:"confirmed",   notes:"",                   doctorNotes:"",                         createdAt:new Date().toISOString() },
    { id:"demo2", patientId:"p2", patientName:"Roberto Santos", patientEmail:"roberto@email.com",  patientPhone:"(47) 98222-3333", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura",   specialty:"Clínica Geral", date:label(today),  dateISO:fmt(today),  time:"09:00", price:"R$ 150,00", payment:"Pix",    status:"pending",     notes:"",                   doctorNotes:"",                         createdAt:new Date().toISOString() },
    { id:"demo3", patientId:"p3", patientName:"Julia Pereira",  patientEmail:"julia@email.com",    patientPhone:"(47) 97333-4444", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr2", doctorName:"Dra. Ana Ribeiro",   specialty:"Cardiologia",   date:label(today),  dateISO:fmt(today),  time:"10:00", price:"R$ 200,00", payment:"Cartão", status:"confirmed",   notes:"Hipertensão leve",   doctorNotes:"",                         createdAt:new Date().toISOString() },
    { id:"demo4", patientId:"p4", patientName:"Carlos Mendes",  patientEmail:"carlos@email.com",   patientPhone:"(47) 96444-5555", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura",   specialty:"Clínica Geral", date:label(add(1)), dateISO:fmt(add(1)), time:"08:00", price:"R$ 150,00", payment:"Cartão", status:"scheduled",   notes:"",                   doctorNotes:"",                         createdAt:new Date().toISOString() },
    { id:"demo5", patientId:"p5", patientName:"Fernanda Costa", patientEmail:"fernanda@email.com", patientPhone:"(47) 95555-6666", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr2", doctorName:"Dra. Ana Ribeiro",   specialty:"Cardiologia",   date:label(add(1)), dateISO:fmt(add(1)), time:"11:00", price:"R$ 200,00", payment:"Pix",    status:"scheduled",   notes:"",                   doctorNotes:"",                         createdAt:new Date().toISOString() },
    { id:"demo6", patientId:"p6", patientName:"Marcos Souza",   patientEmail:"marcos@email.com",   patientPhone:"(47) 94666-7777", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr3", doctorName:"Dr. Lucas Peixoto", specialty:"Ortopedia",     date:label(add(-1)),dateISO:fmt(add(-1)),time:"14:00", price:"R$ 180,00", payment:"Cartão", status:"completed",   notes:"",                   doctorNotes:"Boa evolução. Retorno em 30 dias.", createdAt:new Date().toISOString() },
    { id:"demo7", patientId:"p7", patientName:"Ana Paula",      patientEmail:"anapaula@email.com", patientPhone:"(47) 93777-8888", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura",   specialty:"Clínica Geral", date:label(add(-2)),dateISO:fmt(add(-2)),time:"09:00", price:"R$ 150,00", payment:"Boleto", status:"cancelled",   notes:"Paciente desmarcou", doctorNotes:"",                         createdAt:new Date().toISOString() },
    { id:"demo8", patientId:"p2", patientName:"Roberto Santos", patientEmail:"roberto@email.com",  patientPhone:"(47) 98222-3333", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr3", doctorName:"Dr. Lucas Peixoto", specialty:"Ortopedia",     date:label(add(3)), dateISO:fmt(add(3)), time:"15:00", price:"R$ 180,00", payment:"Pix",    status:"rescheduled", notes:"Reagendado a pedido do paciente", doctorNotes:"",                   createdAt:new Date().toISOString() },
  ]
  saveAllAppointments([...existing, ...demos])
}
