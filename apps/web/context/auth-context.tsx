"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import {
  User,
  Appointment,
  getSession,
  clearSession,
  persistUser,
  loginLocal,
  registerLocal,
  addAppointment,
  cancelAppointment,
  rescheduleAppointment,
  LOCAL_TOKEN,
} from "@/lib/auth-store"
import { apiFetch } from "@/lib/api"
import { updateAppointmentStatus, rescheduleGlobalAppointment } from "@/lib/global-appointments"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  bookAppointment: (appt: Omit<Appointment, "createdAt">) => void
  cancelAppt: (apptId: string) => void
  rescheduleAppt: (apptId: string, date: string, dateISO: string, time: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) setUser(session)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    let loggedUser: User
    try {
      const data = await apiFetch<{ token: string; user: User }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      )
      localStorage.setItem("sc_token", data.token)
      loggedUser = data.user
    } catch {
      loggedUser = loginLocal(email, password)
      localStorage.setItem("sc_token", LOCAL_TOKEN)
    }
    persistUser(loggedUser)
    setUser(loggedUser)
  }, [])

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      phone: string,
      password: string
    ) => {
      let newUser: User
      try {
        const data = await apiFetch<{ token: string; user: User }>(
          "/auth/register",
          {
            method: "POST",
            body: JSON.stringify({ firstName, lastName, email, phone, password }),
          }
        )
        localStorage.setItem("sc_token", data.token)
        newUser = data.user
      } catch {
        newUser = registerLocal(firstName, lastName, email, phone, password)
        localStorage.setItem("sc_token", LOCAL_TOKEN)
      }
      persistUser(newUser)
      setUser(newUser)
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem("sc_token")
    clearSession()
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      persistUser(updated)
      return updated
    })
  }, [])

  const bookAppointment = useCallback(
    (appt: Omit<Appointment, "createdAt">) => {
      setUser((prev) => {
        if (!prev) return prev
        const full: Appointment = {
          ...appt,
          createdAt: new Date().toISOString(),
        }
        return addAppointment(prev, full)
      })
    },
    []
  )

  const cancelAppt = useCallback((apptId: string) => {
    updateAppointmentStatus(apptId, "cancelled")
    setUser((prev) => {
      if (!prev) return prev
      return cancelAppointment(prev, apptId)
    })
  }, [])

  const rescheduleAppt = useCallback((apptId: string, date: string, dateISO: string, time: string) => {
    rescheduleGlobalAppointment(apptId, date, dateISO, time)
    setUser((prev) => {
      if (!prev) return prev
      return rescheduleAppointment(prev, apptId, date, time)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateUser, bookAppointment, cancelAppt, rescheduleAppt }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
