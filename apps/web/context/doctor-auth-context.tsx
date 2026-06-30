"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
  DoctorSession,
  getDoctorSession,
  saveDoctorSession,
  clearDoctorSession,
  loginDoctor,
  seedDoctorPasswords,
} from "@/lib/doctor-store"
import { seedDemoMedicalRecords } from "@/lib/medical-records-store"

interface DoctorAuthContextValue {
  doctor: DoctorSession | null
  isLoading: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

const DoctorAuthContext = createContext<DoctorAuthContextValue | null>(null)

export function DoctorAuthProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor]       = useState<DoctorSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    seedDoctorPasswords()
    const session = getDoctorSession()
    if (session) {
      seedDemoMedicalRecords(session.clinicId)
      setDoctor(session)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const s = loginDoctor(email, password)
    saveDoctorSession(s)
    seedDemoMedicalRecords(s.clinicId)
    setDoctor(s)
  }, [])

  const logout = useCallback(() => {
    clearDoctorSession()
    setDoctor(null)
  }, [])

  return (
    <DoctorAuthContext.Provider value={{ doctor, isLoading, login, logout }}>
      {children}
    </DoctorAuthContext.Provider>
  )
}

export function useDoctorAuth() {
  const ctx = useContext(DoctorAuthContext)
  if (!ctx) throw new Error("useDoctorAuth must be used inside DoctorAuthProvider")
  return ctx
}
