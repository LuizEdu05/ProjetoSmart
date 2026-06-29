"use client"

// Doctor authentication store.
// Doctors log in using their Professional.email + a password.
// Default password for all seeded doctors: "medico123"

import type { Professional } from "@/lib/clinic-store"

export interface DoctorSession {
  professionalId: string
  clinicId: string
  name: string
  email: string
  specialty: string
  crm: string
  initials: string
  color: string
  avatarBg: string
}

const PWD_KEY     = "sc_doctor_passwords"   // { [professionalId]: string }
const SESSION_KEY = "sc_doctor_session"
const DEFAULT_PWD = "medico123"

function getProfessionals(): Professional[] {
  try { return JSON.parse(localStorage.getItem("sc_professionals") || "[]") }
  catch { return [] }
}

function getPasswords(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(PWD_KEY) || "{}") }
  catch { return {} }
}

/** Call after seedProfessionals — ensures every professional has a password entry */
export function seedDoctorPasswords() {
  if (typeof window === "undefined") return
  const profs = getProfessionals()
  const pwds  = getPasswords()
  let changed = false
  for (const p of profs) {
    if (!pwds[p.id]) { pwds[p.id] = DEFAULT_PWD; changed = true }
  }
  if (changed) localStorage.setItem(PWD_KEY, JSON.stringify(pwds))
}

export function loginDoctor(email: string, password: string): DoctorSession {
  const profs = getProfessionals()
  const prof  = profs.find(p => p.email.toLowerCase() === email.toLowerCase())
  if (!prof) throw new Error("E-mail ou senha inválidos.")
  if (!prof.active) throw new Error("Profissional inativo. Contate a clínica.")

  const pwds      = getPasswords()
  const stored    = pwds[prof.id] ?? DEFAULT_PWD
  if (stored !== password) throw new Error("E-mail ou senha inválidos.")

  return {
    professionalId: prof.id,
    clinicId:       prof.clinicId,
    name:           prof.name,
    email:          prof.email,
    specialty:      prof.specialty,
    crm:            prof.crm,
    initials:       prof.initials,
    color:          prof.color,
    avatarBg:       prof.avatarBg,
  }
}

export function getDoctorSession(): DoctorSession | null {
  if (typeof window === "undefined") return null
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null") }
  catch { return null }
}

export function saveDoctorSession(s: DoctorSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function clearDoctorSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function changeDoctorPassword(professionalId: string, currentPwd: string, newPwd: string) {
  if (newPwd.length < 6) throw new Error("Nova senha deve ter ao menos 6 caracteres.")
  const pwds   = getPasswords()
  const stored = pwds[professionalId] ?? DEFAULT_PWD
  if (stored !== currentPwd) throw new Error("Senha atual incorreta.")
  pwds[professionalId] = newPwd
  localStorage.setItem(PWD_KEY, JSON.stringify(pwds))
}
