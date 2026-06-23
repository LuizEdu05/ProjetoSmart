"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function ClinicRoot() {
  const router = useRouter()
  useEffect(() => { router.replace("/clinic/dashboard") }, [router])
  return null
}
