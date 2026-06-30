"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { SearchSection } from "@/components/sections/search"
import { ClinicsSection } from "@/components/sections/clinics"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { BookingSection } from "@/components/sections/booking-section"
import { DoctorsSection } from "@/components/sections/doctors"
import { ReviewsSection } from "@/components/sections/reviews"
import { PolicySection } from "@/components/sections/policy"
import { Footer } from "@/components/sections/footer"
import { BookingModal } from "@/components/modals/booking-modal"
import { useAuth } from "@/context/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()

  function handleProfileClick() {
    if (user) {
      router.push("/profile")
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      <Navbar
        onProfileClick={handleProfileClick}
        currentPage="home"
      />

      <main id="main-content">
        <HeroSection />
        <SearchSection />
        <ClinicsSection />
        <HowItWorksSection />
        <BookingSection />
        <DoctorsSection />
        <ReviewsSection />
        <PolicySection />
      </main>

      <Footer />

      <BookingModal />
    </>
  )
}
