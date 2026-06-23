"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useAuth } from "@/context/auth-context"

interface NavbarProps {
  onLoginClick: () => void
  onRegisterClick: () => void
  onProfileClick: () => void
  currentPage: string
}

const NAV_LINKS = [
  { label: "Clínicas", href: "#clinicas" },
  { label: "Médicos", href: "#medicos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Agendar", href: "#agendar" },
]

const EXTRA_LINKS = [
  { label: "Para clínicas", href: "/clinic/login" },
  { label: "Suporte", href: "/support" },
]

export function Navbar({
  onLoginClick,
  onRegisterClick,
  onProfileClick,
  currentPage,
}: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  function scrollToSection(href: string) {
    setMobileOpen(false)
    if (currentPage !== "home") {
      router.push("/" + href)
      return
    }
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  const initials = user
    ? (user.firstName[0] || "") + (user.lastName?.[0] || "")
    : ""

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "glass border-b border-[#d9e3dd] shadow-sm"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 flex items-center justify-between h-[66px]">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Ir para início"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="inline-flex w-[30px] h-[30px] bg-[#1D9E75] rounded-[9px] text-white items-center justify-center font-bold text-base flex-shrink-0">
              +
            </span>
            <span className="font-bold text-[21px] leading-none tracking-tight">
              <span className="text-[#FFB800]">SMART</span>
              <span className="text-[#0e1a14]"> Consulta</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Navegação principal"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href)
                }}
                className="text-[14px] font-medium text-[#6b7c72] hover:text-[#1D9E75] transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Extra links */}
          <div className="hidden md:flex items-center gap-5">
            {EXTRA_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="text-[13px] font-medium text-[#6b7c72] hover:text-[#1D9E75] transition-colors duration-200 cursor-pointer">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#f2f5f3] transition-colors duration-200 cursor-pointer"
                  aria-label="Ver perfil"
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0"
                    style={{ background: user.color }}
                    aria-hidden="true"
                  >
                    {initials.toUpperCase()}
                  </span>
                  <span className="text-[14px] font-medium text-[#0e1a14]">
                    {user.firstName}
                  </span>
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-1.5 cursor-pointer border-[#d9e3dd] text-[#0e1a14] hover:border-[#1D9E75] hover:text-[#1D9E75]"
                >
                  <LogOut size={14} />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoginClick}
                  className="cursor-pointer border-[#d9e3dd] text-[#0e1a14] hover:border-[#1D9E75] hover:text-[#1D9E75]"
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  onClick={onRegisterClick}
                  className="cursor-pointer bg-[#1D9E75] hover:bg-[#0F6E56] text-white border-transparent"
                >
                  Criar conta
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#6b7c72] hover:text-[#0e1a14] hover:bg-[#f2f5f3] transition-colors cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[66px] left-0 right-0 z-[99] bg-white border-b border-[#d9e3dd] shadow-lg md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1" aria-label="Menu mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className="px-3 py-2.5 rounded-lg text-[14px] font-medium text-[#6b7c72] hover:text-[#1D9E75] hover:bg-[#f2f5f3] transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-[#d9e3dd] mt-1 pt-2">
                {EXTRA_LINKS.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-[14px] font-medium text-[#6b7c72] hover:text-[#1D9E75] hover:bg-[#f2f5f3] transition-colors cursor-pointer">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-3 mt-2 border-t border-[#d9e3dd] flex flex-col gap-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        onProfileClick()
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f2f5f3] transition-colors cursor-pointer text-left"
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                        style={{ background: user.color }}
                      >
                        {initials.toUpperCase()}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-[#0e1a14]">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-[#6b7c72]">
                          {user.email}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        logout()
                      }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#6b7c72] hover:text-[#0e1a14] hover:bg-[#f2f5f3] transition-colors cursor-pointer"
                    >
                      <LogOut size={15} /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        onLoginClick()
                      }}
                      className="w-full text-center px-4 py-2.5 rounded-xl border border-[#d9e3dd] text-sm font-medium text-[#0e1a14] hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors cursor-pointer"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        onRegisterClick()
                      }}
                      className="w-full text-center px-4 py-2.5 rounded-xl bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      Criar conta
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
