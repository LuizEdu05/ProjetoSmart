"use client"

// Shared appointment store — both patient and clinic views read/write here.

export type ApptStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show"

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
  notes: string
  createdAt: string
}

const KEY = "sc_global_appointments"

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

export function updateAppointmentStatus(id: string, status: ApptStatus) {
  const list = getAllAppointments().map((a) =>
    a.id === id ? { ...a, status } : a
  )
  saveAllAppointments(list)
  return list
}

export function updateAppointmentNotes(id: string, notes: string) {
  const list = getAllAppointments().map((a) =>
    a.id === id ? { ...a, notes } : a
  )
  saveAllAppointments(list)
  return list
}

/** Returns booked times for a given clinicId + dateISO */
export function getBookedSlots(clinicId: string, dateISO: string): string[] {
  return getAllAppointments()
    .filter(
      (a) =>
        a.clinicId === clinicId &&
        a.dateISO === dateISO &&
        a.status !== "cancelled"
    )
    .map((a) => a.time)
}

/** Seed demo appointments for clinic view */
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
  const add = (offsetDays: number) => {
    const d = new Date(today); d.setDate(today.getDate() + offsetDays); return d
  }

  const demos: GlobalAppointment[] = [
    { id:"demo1", patientId:"p1", patientName:"Maria Lima", patientEmail:"maria@email.com", patientPhone:"(47) 99111-2222", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura", specialty:"Clínica Geral", date:label(today), dateISO:fmt(today), time:"08:00", price:"R$ 150,00", payment:"Cartão", status:"confirmed", notes:"", createdAt:new Date().toISOString() },
    { id:"demo2", patientId:"p2", patientName:"Roberto Santos", patientEmail:"roberto@email.com", patientPhone:"(47) 98222-3333", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura", specialty:"Clínica Geral", date:label(today), dateISO:fmt(today), time:"09:00", price:"R$ 150,00", payment:"Pix", status:"scheduled", notes:"", createdAt:new Date().toISOString() },
    { id:"demo3", patientId:"p3", patientName:"Julia Pereira", patientEmail:"julia@email.com", patientPhone:"(47) 97333-4444", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr2", doctorName:"Dra. Ana Ribeiro", specialty:"Cardiologia", date:label(today), dateISO:fmt(today), time:"10:00", price:"R$ 200,00", payment:"Cartão", status:"confirmed", notes:"Hipertensão leve", createdAt:new Date().toISOString() },
    { id:"demo4", patientId:"p4", patientName:"Carlos Mendes", patientEmail:"carlos@email.com", patientPhone:"(47) 96444-5555", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura", specialty:"Clínica Geral", date:label(add(1)), dateISO:fmt(add(1)), time:"08:00", price:"R$ 150,00", payment:"Cartão", status:"scheduled", notes:"", createdAt:new Date().toISOString() },
    { id:"demo5", patientId:"p5", patientName:"Fernanda Costa", patientEmail:"fernanda@email.com", patientPhone:"(47) 95555-6666", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr2", doctorName:"Dra. Ana Ribeiro", specialty:"Cardiologia", date:label(add(1)), dateISO:fmt(add(1)), time:"11:00", price:"R$ 200,00", payment:"Pix", status:"scheduled", notes:"", createdAt:new Date().toISOString() },
    { id:"demo6", patientId:"p6", patientName:"Marcos Souza", patientEmail:"marcos@email.com", patientPhone:"(47) 94666-7777", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr3", doctorName:"Dr. Lucas Peixoto", specialty:"Ortopedia", date:label(add(-1)), dateISO:fmt(add(-1)), time:"14:00", price:"R$ 180,00", payment:"Cartão", status:"completed", notes:"", createdAt:new Date().toISOString() },
    { id:"demo7", patientId:"p7", patientName:"Ana Paula", patientEmail:"anapaula@email.com", patientPhone:"(47) 93777-8888", clinicId, clinicName:"Clínica Saúde & Vida", doctorId:"dr1", doctorName:"Dr. Felipe Moura", specialty:"Clínica Geral", date:label(add(-2)), dateISO:fmt(add(-2)), time:"09:00", price:"R$ 150,00", payment:"Boleto", status:"cancelled", notes:"Paciente desmarcou", createdAt:new Date().toISOString() },
  ]
  saveAllAppointments([...existing, ...demos])
}
