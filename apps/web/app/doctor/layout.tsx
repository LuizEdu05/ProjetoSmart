"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Stethoscope,
  MessageSquare,
  Settings,
} from "lucide-react"
import { DoctorAuthProvider, useDoctorAuth } from "@/context/doctor-auth-context"

const NAV = [
  { href: "/doctor/dashboard", label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/doctor/agenda",    label: "Minha Agenda", Icon: Calendar },
  { href: "/doctor/patients",  label: "Pacientes",   Icon: Users },
]

function DoctorShell({ children }: { children: React.ReactNode }) {
  const { doctor, isLoading, logout } = useDoctorAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !doctor && pathname !== "/doctor/login") {
      router.replace("/doctor/login")
    }
  }, [doctor, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!doctor) return <>{children}</>

  return (
    <div className="min-h-screen flex bg-[#f0f4f7]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0e1a14] flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/8">
          <Link href="/doctor/dashboard" className="flex items-center gap-2 cursor-pointer">
            <span className="w-7 h-7 bg-[#378ADD] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              <Stethoscope size={14} />
            </span>
            <span className="font-bold text-[15px] leading-none">
              <span className="text-[#FFB800]">SMART</span>
              <span className="text-white"> Médico</span>
            </span>
          </Link>
        </div>

        {/* Doctor info */}
        <div className="px-4 py-3.5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0"
              style={{ background: doctor.avatarBg, color: doctor.color }}
            >
              {doctor.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white truncate leading-tight">
                {doctor.name.replace(/^Dr[a]?\. /, "")}
              </p>
              <p className="text-[11px] text-[#8fa398] truncate">{doctor.specialty}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto" aria-label="Navegação do médico">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-[#378ADD] text-white"
                    : "text-[#8fa398] hover:bg-white/6 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/8 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#8fa398] hover:text-white hover:bg-white/6 transition-all cursor-pointer"
          >
            <MessageSquare size={16} />
            Ver site paciente
          </Link>
          <Link
            href="/clinic/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#8fa398] hover:text-white hover:bg-white/6 transition-all cursor-pointer"
          >
            <Settings size={16} />
            Painel da clínica
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#8fa398] hover:text-white hover:bg-white/6 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DoctorAuthProvider>
      <DoctorShell>{children}</DoctorShell>
    </DoctorAuthProvider>
  )
}
