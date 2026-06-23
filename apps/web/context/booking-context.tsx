"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface BookingState {
  isOpen: boolean
  clinic: string
  clinicId: string
  doctor: string
  doctorId: string
  specialty: string
  price: string
}

interface BookingContextValue {
  booking: BookingState
  openBooking: (clinic?: string, doctor?: string, specialty?: string, price?: string, clinicId?: string, doctorId?: string) => void
  closeBooking: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

const DEFAULT: BookingState = {
  isOpen: false, clinic: "", clinicId: "c1", doctor: "", doctorId: "dr1", specialty: "", price: "",
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(DEFAULT)

  const openBooking = useCallback((
    clinic = "Smart Consulta",
    doctor = "",
    specialty = "Clínica Geral",
    price = "R$ 150,00",
    clinicId = "c1",
    doctorId = "dr1",
  ) => {
    setBooking({ isOpen: true, clinic, clinicId, doctor, doctorId, specialty, price })
  }, [])

  const closeBooking = useCallback(() => setBooking(DEFAULT), [])

  return (
    <BookingContext.Provider value={{ booking, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}
