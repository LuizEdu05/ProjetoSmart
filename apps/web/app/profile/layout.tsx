"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LoginModal } from "@/components/modals/login-modal"
import { RegisterModal } from "@/components/modals/register-modal"
import { BookingModal } from "@/components/modals/booking-modal"
import { useAuth } from "@/context/auth-context"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  return (
    <>
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => setRegisterOpen(true)}
        onProfileClick={() => {
          if (!user) setLoginOpen(true)
        }}
        currentPage="profile"
      />

      <div id="main-content">{children}</div>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false)
          setRegisterOpen(true)
        }}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false)
          setLoginOpen(true)
        }}
      />
      <BookingModal />
    </>
  )
}
