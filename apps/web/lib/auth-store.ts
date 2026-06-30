"use client"

export interface Appointment {
  id: string
  clinic: string
  doctor: string
  specialty: string
  price: string
  date: string
  time: string
  payment: string
  status: "upcoming" | "done" | "cancelled"
  createdAt: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  cpf: string
  healthPlan: string
  color: string
  avatarColor: string
  password: string
  appointments: Appointment[]
}

const USERS_KEY = "sc_users"
const SESSION_KEY = "sc_session"
export const LOCAL_TOKEN = "local-session"

const LOCAL_COLORS = [
  "#1D9E75",
  "#378ADD",
  "#D4537E",
  "#EF9F27",
  "#7F77DD",
  "#E24B4A",
]

function randomColor(): string {
  return LOCAL_COLORS[Math.floor(Math.random() * LOCAL_COLORS.length)] ?? "#1D9E75"
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): User | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null")
  } catch {
    return null
  }
}

export function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

function normalize(user: Partial<User>): User {
  const color = user.color || user.avatarColor || randomColor()
  return {
    id: user.id || "u" + Date.now(),
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    cpf: user.cpf || "",
    healthPlan: user.healthPlan || "",
    color,
    avatarColor: user.avatarColor || color,
    password: user.password || "",
    appointments: Array.isArray(user.appointments) ? user.appointments : [],
  }
}

export function loginLocal(email: string, password: string): User {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
  if (!user || user.password !== password)
    throw new Error("E-mail ou senha inválidos.")
  return normalize(user)
}

export function registerLocal(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
): User {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error("Este e-mail já está cadastrado.")
  const user = normalize({ id: crypto.randomUUID(), firstName, lastName, email, phone, password })
  users.push(user)
  saveUsers(users)
  return user
}

export function persistUser(user: User) {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === user.id || u.email === user.email)
  if (idx >= 0) users[idx] = user
  else users.push(user)
  saveUsers(users)
  saveSession(user)
}

export function addAppointment(user: User, appt: Appointment): User {
  const updated = { ...user, appointments: [appt, ...user.appointments] }
  persistUser(updated)
  return updated
}

export function rescheduleAppointment(user: User, apptId: string, date: string, time: string): User {
  const updated = {
    ...user,
    appointments: user.appointments.map(a =>
      a.id === apptId ? { ...a, date, time, status: "upcoming" as const } : a
    ),
  }
  persistUser(updated)
  return updated
}

export function cancelAppointment(user: User, apptId: string): User {
  const updated = {
    ...user,
    appointments: user.appointments.map((a) =>
      a.id === apptId ? { ...a, status: "cancelled" as const } : a
    ),
  }
  persistUser(updated)
  return updated
}
