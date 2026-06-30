"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  BarChart2,
  Settings,
  LogOut,
  Building2,
  MessageSquare,
} from "lucide-react"
import { ClinicAuthProvider, useClinicAuth } from "@/context/clinic-auth-context"

const NAV = [
  { href: "/clinic/dashboard",     label: "Dashboard",      Icon: LayoutDashboard },
  { href: "/clinic/appointments",  label: "Agendamentos",   Icon: Calendar },
  { href: "/clinic/professionals", label: "Profissionais",  Icon: Users },
  { href: "/clinic/schedule",      label: "Agenda",         Icon: Clock },
  { href: "/clinic/analytics",     label: "Relatórios",     Icon: BarChart2 },
  { href: "/clinic/settings",      label: "Configurações",  Icon: Settings },
]

function ClinicShell({ children }: { children: React.ReactNode }) {
  const { clinic, isLoading, logout } = useClinicAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !clinic && pathname !== "/clinic/login") {
      router.replace("/clinic/login")
    }
  }, [clinic, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!clinic) return <>{children}</>

  return (
    <div className="min-h-screen flex bg-[#f8faf9]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0e1a14] flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/8">
          <Link href="/clinic/dashboard" className="flex items-center gap-2 cursor-pointer">
            <span className="w-7 h-7 bg-[#1D9E75] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              +
            </span>
            <span className="font-bold text-[15px] leading-none">
              <span className="text-[#FFB800]">SMART</span>
              <span className="text-white"> Clínica</span>
            </span>
          </Link>
        </div>

        {/* Clinic info */}
        <div className="px-4 py-3.5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center flex-shrink-0">
              <Building2 size={15} className="text-[#1D9E75]" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white truncate leading-tight">
                {clinic.clinicName}
              </p>
              <p className="text-[11px] text-[#8fa398] truncate">
                {clinic.specialty}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto" aria-label="Navegação da clínica">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-[#1D9E75] text-white"
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
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#8fa398] hover:text-white hover:bg-white/6 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" as const }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClinicAuthProvider>
      <ClinicShell>{children}</ClinicShell>
    </ClinicAuthProvider>
  )
}
