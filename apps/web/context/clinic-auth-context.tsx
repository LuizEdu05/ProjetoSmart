"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
  ClinicAdmin,
  getClinicSession,
  saveClinicSession,
  clearClinicSession,
  loginClinic,
  seedClinicAdmins,
  seedProfessionals,
} from "@/lib/clinic-store"
import { seedDemoAppointments } from "@/lib/global-appointments"

interface ClinicAuthContextValue {
  clinic: ClinicAdmin | null
  isLoading: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

const ClinicAuthContext = createContext<ClinicAuthContextValue | null>(null)

export function ClinicAuthProvider({ children }: { children: React.ReactNode }) {
  const [clinic, setClinic] = useState<ClinicAdmin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    seedClinicAdmins()
    const session = getClinicSession()
    if (session) {
      setClinic(session)
      seedProfessionals(session.clinicId)
      seedDemoAppointments(session.clinicId)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const c = loginClinic(email, password)
    saveClinicSession(c)
    seedProfessionals(c.clinicId)
    seedDemoAppointments(c.clinicId)
    setClinic(c)
  }, [])

  const logout = useCallback(() => {
    clearClinicSession()
    setClinic(null)
  }, [])

  return (
    <ClinicAuthContext.Provider value={{ clinic, isLoading, login, logout }}>
      {children}
    </ClinicAuthContext.Provider>
  )
}

export function useClinicAuth() {
  const ctx = useContext(ClinicAuthContext)
  if (!ctx) throw new Error("useClinicAuth must be used inside ClinicAuthProvider")
  return ctx
}
