"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { BookingModal } from "@/components/modals/booking-modal"
import { useAuth } from "@/context/auth-context"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  return (
    <>
      <Navbar
        onProfileClick={() => {}}
        currentPage="profile"
      />

      <div id="main-content">{children}</div>

      <BookingModal />
    </>
  )
}
