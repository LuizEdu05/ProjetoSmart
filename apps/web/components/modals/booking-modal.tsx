"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, CreditCard, Smartphone, FileText, Bell } from "lucide-react"
import { useBooking } from "@/context/booking-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"
import {
  addGlobalAppointment,
  getBookedSlots,
  type GlobalAppointment,
} from "@/lib/global-appointments"

// ── helpers ───────────────────────────────────────────────────────────────────

/** Parse Brazilian currency string: "R$ 1.500,50" → 1500.50 */
function parseBRLPrice(price: string): number {
  const cleaned = price
    .replace("R$", "")
    .trim()
    .replace(/\./g, "")   // remove thousand separators (dot in BR format)
    .replace(",", ".")    // decimal comma → dot
  return parseFloat(cleaned) || 150
}

function buildDays() {
  const days: { label: string; day: string; date: string; iso: string }[] = []
  const weekdays: string[] = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const months: string[] = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  const now = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const wd = weekdays[d.getDay()] ?? "?"
    const mo = months[d.getMonth()] ?? "?"
    days.push({
      label: wd,
      day: String(d.getDate()),
      date: `${wd}, ${d.getDate()} ${mo}`,
      iso: d.toISOString().slice(0, 10),
    })
  }
  return days
}

const ALL_TIMES = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00",
]

const PAYMENT_METHODS = [
  { id: "Cartão", label: "Cartão", Icon: CreditCard },
  { id: "Pix",    label: "Pix",    Icon: Smartphone },
  { id: "Boleto", label: "Boleto", Icon: FileText },
]

// ── component ──────────────────────────────────────────────────────────────────
export function BookingModal() {
  const { booking, closeBooking } = useBooking()
  const { user, bookAppointment } = useAuth()
  const { showToast } = useToast()

  const days = useMemo(() => buildDays(), [])

  const [step, setStep]                   = useState(1)
  const [selectedDay, setSelectedDay]     = useState(days[0]!)
  const [selectedTime, setSelectedTime]   = useState("")
  const [selectedPayment, setSelectedPayment] = useState("Cartão")
  const [isSubmitting, setIsSubmitting]   = useState(false)

  // Real-time booked slots for selected clinic + date
  const bookedSlots = useMemo(() => {
    if (!booking.isOpen) return []
    return getBookedSlots(booking.clinicId || "c1", selectedDay.iso, booking.doctorId || "dr1")
  }, [booking.isOpen, booking.clinicId, selectedDay.iso])

  function reset() {
    setStep(1)
    setSelectedDay(days[0]!)
    setSelectedTime("")
    setSelectedPayment("Cartão")
    setIsSubmitting(false)
  }

  function handleClose() {
    closeBooking()
    setTimeout(reset, 300)
  }

  function handleDaySelect(d: typeof days[number]) {
    setSelectedDay(d)
    setSelectedTime("") // clear time when day changes
  }

  function handleConfirm() {
    if (!selectedTime) {
      showToast("Selecione um horário.", "error")
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)

    // Single shared ID — both stores use this so cancellation stays in sync
    const sharedId = crypto.randomUUID()

    const globalAppt: GlobalAppointment = {
      id: sharedId,
      patientId: user?.id || "guest",
      patientName: user ? `${user.firstName} ${user.lastName}` : "Convidado",
      patientEmail: user?.email || "",
      patientPhone: user?.phone || "",
      clinicId: booking.clinicId || "c1",
      clinicName: booking.clinic,
      doctorId: booking.doctorId || "dr1",
      doctorName: booking.doctor || "Médico disponível",
      specialty: booking.specialty,
      date: selectedDay.date,
      dateISO: selectedDay.iso,
      time: selectedTime,
      price: booking.price,
      payment: selectedPayment,
      status: "scheduled",
      notes: "",
      doctorNotes: "",
      createdAt: new Date().toISOString(),
    }
    addGlobalAppointment(globalAppt)

    // Save to patient profile using the SAME id so cancelAppt can find it in global store
    if (user) {
      bookAppointment({
        id: sharedId,
        clinic: booking.clinic,
        doctor: booking.doctor || "Médico disponível",
        specialty: booking.specialty,
        price: booking.price,
        date: selectedDay.date,
        time: selectedTime,
        payment: selectedPayment,
        status: "upcoming",
      })
    }
    setStep(4)
  }

  function handleDone() {
    handleClose()
    showToast("✅ Consulta agendada com sucesso!")
  }

  const totalNum = parseBRLPrice(booking.price)

  return (
    <AnimatePresence>
      {booking.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="bg-white rounded-[24px] p-7 max-w-[500px] w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f2f5f3] hover:bg-[#e8ede9] flex items-center justify-center text-[#6b7c72] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

            {/* Progress bar */}
            {step < 4 && (
              <div className="flex gap-1.5 mb-5" aria-label="Progresso">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
                      s <= step ? "bg-[#1D9E75]" : "bg-[#e8ede9]"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* ── Step 1: Date & Time ── */}
            {step === 1 && (
              <div>
                <h2 id="booking-modal-title" className="text-[22px] font-bold text-[#0e1a14] mb-0.5">
                  {booking.clinic || "Agendar consulta"}
                </h2>
                <p className="text-[13px] text-[#6b7c72] mb-4">
                  {[booking.doctor, booking.specialty].filter(Boolean).join(" · ")}
                </p>

                {/* Date picker */}
                <p className="text-[12px] font-medium text-[#2a3d33] mb-2">Selecione a data</p>
                <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none" role="group" aria-label="Data">
                  {days.map((d) => (
                    <button
                      key={d.iso}
                      onClick={() => handleDaySelect(d)}
                      aria-pressed={selectedDay.iso === d.iso}
                      aria-label={d.date}
                      className={`flex-shrink-0 rounded-xl px-3 py-2 text-center cursor-pointer transition-all duration-150 min-w-[50px] border-[1.5px] ${
                        selectedDay.iso === d.iso
                          ? "bg-[#0e1a14] text-white border-[#0e1a14]"
                          : "bg-[#f2f5f3] text-[#6b7c72] border-transparent hover:border-[#1D9E75]"
                      }`}
                    >
                      <div className="text-[17px] font-semibold leading-none">{d.day}</div>
                      <div className={`text-[10px] mt-0.5 ${selectedDay.iso === d.iso ? "text-[#9FE1CB]" : "text-[#6b7c72]"}`}>
                        {d.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Time picker — real slot availability */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-medium text-[#2a3d33]">Selecione o horário</p>
                  {bookedSlots.length > 0 && (
                    <span className="text-[11px] text-[#6b7c72]">
                      {bookedSlots.length} horário{bookedSlots.length > 1 ? "s" : ""} ocupado{bookedSlots.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mb-6" role="group" aria-label="Horário">
                  {ALL_TIMES.map((t) => {
                    const booked = bookedSlots.includes(t)
                    const selected = selectedTime === t
                    return (
                      <button
                        key={t}
                        onClick={() => !booked && setSelectedTime(t)}
                        disabled={booked}
                        aria-pressed={selected}
                        aria-label={`${t}${booked ? " — ocupado" : ""}`}
                        title={booked ? "Horário já agendado" : t}
                        className={`rounded-[9px] py-2.5 text-center text-[12px] font-medium border-[1.5px] transition-all duration-150 relative ${
                          booked
                            ? "bg-[#f7f5f0] text-[#ccc] cursor-not-allowed border-transparent line-through"
                            : selected
                            ? "bg-[#1D9E75] border-[#1D9E75] text-white cursor-pointer"
                            : "bg-[#f2f5f3] border-transparent text-[#0e1a14] hover:border-[#1D9E75] hover:bg-[#E1F5EE] cursor-pointer"
                        }`}
                      >
                        {t}
                        {booked && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-[1px] bg-[#ccc] rotate-0" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => {
                    if (!selectedTime) { showToast("Selecione um horário.", "error"); return }
                    setStep(2)
                  }}
                  className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-3 text-[14px] font-medium transition-colors duration-200 cursor-pointer"
                >
                  Continuar →
                </button>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div>
                <h2 id="booking-modal-title" className="text-[22px] font-bold text-[#0e1a14] mb-4">
                  Forma de pagamento
                </h2>

                <div className="flex gap-2 mb-5" role="group" aria-label="Pagamento">
                  {PAYMENT_METHODS.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedPayment(id)}
                      aria-pressed={selectedPayment === id}
                      className={`flex-1 rounded-xl py-3 text-[12px] font-medium transition-all duration-150 cursor-pointer border-2 flex flex-col items-center gap-1.5 ${
                        selectedPayment === id
                          ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56]"
                          : "bg-[#f2f5f3] border-transparent text-[#0e1a14] hover:border-[#d9e3dd]"
                      }`}
                    >
                      <Icon size={20} aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="border border-[#d9e3dd] rounded-xl p-4 mb-5">
                  <p className="text-[12px] font-medium text-[#6b7c72] mb-3 uppercase tracking-wide">Resumo</p>
                  {[
                    ["Clínica", booking.clinic],
                    ["Especialidade", booking.specialty],
                    ["Data", selectedDay.date],
                    ["Horário", selectedTime],
                    ["Pagamento", selectedPayment],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-[13px] py-1 text-[#2a3d33]">
                      <span className="text-[#6b7c72]">{l}</span><span>{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-[15px] border-t border-[#d9e3dd] mt-2 pt-3">
                    <span>Total</span>
                    <span className="text-[#1D9E75]">R$ {totalNum.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-[#d9e3dd] hover:border-[#1D9E75] text-[#0e1a14] rounded-xl py-3 text-[14px] font-medium transition-colors cursor-pointer">← Voltar</button>
                  <button onClick={() => setStep(3)} className="flex-[2] bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-3 text-[14px] font-medium transition-colors cursor-pointer">Revisar →</button>
                </div>
              </div>
            )}

            {/* ── Step 3: Confirm ── */}
            {step === 3 && (
              <div>
                <h2 id="booking-modal-title" className="text-[22px] font-bold text-[#0e1a14] mb-4">
                  Confirmar agendamento
                </h2>

                <div className="bg-[#f2f5f3] rounded-2xl p-4 mb-5 space-y-2">
                  {(
                    [
                      ["Clínica", booking.clinic],
                      booking.doctor ? ["Médico", booking.doctor] : null,
                      ["Especialidade", booking.specialty],
                      ["Data", selectedDay.date],
                      ["Horário", selectedTime],
                      ["Pagamento", selectedPayment],
                      ["Valor", booking.price],
                    ] as (string[] | null)[]
                  )
                    .filter((x): x is string[] => x !== null)
                    .map(([label, value]) => (
                      <div key={label} className="flex justify-between text-[13px]">
                        <span className="text-[#6b7c72]">{label}</span>
                        <span className="font-medium text-[#0e1a14]">{value}</span>
                      </div>
                    ))}
                </div>

                <div className="flex items-start gap-2 bg-[#FEF3E2] rounded-xl px-3 py-2.5 text-[12px] text-[#633806] mb-5">
                  <span className="flex-shrink-0 mt-0.5 text-[#EF9F27]">⚠</span>
                  <span>Cancelamentos com menos de 24h têm <strong>taxa de 30%</strong>.</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-[#d9e3dd] hover:border-[#1D9E75] text-[#0e1a14] rounded-xl py-3 text-[14px] font-medium transition-colors cursor-pointer">← Voltar</button>
                  <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="flex-[2] bg-[#1D9E75] hover:bg-[#0F6E56] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3 text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Agendando...
                      </>
                    ) : "Agendar ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 4: Success ── */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-[68px] h-[68px] rounded-full bg-[#E1F5EE] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-[#1D9E75]" />
                </div>
                <h2 className="text-[22px] font-bold text-[#0e1a14] mb-1.5">Consulta agendada!</h2>
                <p className="text-[13px] text-[#6b7c72] mb-3">
                  {booking.clinic} · {selectedDay.date} às {selectedTime}
                </p>
                <p className="text-[13px] text-[#6b7c72] mb-5">
                  Você receberá um e-mail de confirmação em breve.
                </p>
                <div className="flex items-center gap-2 bg-[#EEEDFE] rounded-xl px-4 py-3 text-[12px] text-[#3C3489] mb-5">
                  <Bell size={14} />
                  Lembrete automático 24h e 2h antes da consulta.
                </div>
                <button onClick={handleDone} className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-3 text-[14px] font-medium transition-colors cursor-pointer">
                  Concluir
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
