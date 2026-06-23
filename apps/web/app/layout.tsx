import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ToastProvider } from "@/context/toast-context"
import { BookingProvider } from "@/context/booking-context"
import { EnvBanner } from "@/components/env-banner"
import { AuroraBg } from "@/components/ui/aurora-bg"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Smart Consulta — Revolucionando Agendamentos Médicos",
  description:
    "Encontre clínicas e médicos de qualidade, agende sua consulta em minutos e receba lembretes automáticos. Simples, rápido e confiável.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="font-sans antialiased text-[#0e1a14]">
        <AuroraBg />
        <ThemeProvider defaultTheme="light" disableTransitionOnChange>
          <EnvBanner />
          <AuthProvider>
            <ToastProvider>
              <BookingProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[500] focus:bg-[#1D9E75] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
                >
                  Pular para o conteúdo
                </a>
                {children}
              </BookingProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
