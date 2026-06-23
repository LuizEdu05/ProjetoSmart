"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"
import { useBooking } from "@/context/booking-context"
import type { Appointment } from "@/lib/auth-store"

type Tab = "dashboard" | "appointments" | "settings" | "notifications"

const TABS = [
  { id: "dashboard" as Tab, label: "Painel", Icon: LayoutDashboard },
  { id: "appointments" as Tab, label: "Consultas", Icon: Calendar },
  { id: "settings" as Tab, label: "Dados", Icon: Settings },
  { id: "notifications" as Tab, label: "Notificações", Icon: Bell },
]

const APPT_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "upcoming", label: "Próximas" },
  { id: "done", label: "Realizadas" },
  { id: "cancelled", label: "Canceladas" },
]

// ── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1D9E75] ${
        checked ? "bg-[#1D9E75]" : "bg-[#d9e3dd]"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

// ── Appointment card ─────────────────────────────────────────────────────────
function ApptCard({
  appt,
  onCancel,
}: {
  appt: Appointment
  onCancel: (id: string) => void
}) {
  const statusMap = {
    upcoming: { label: "Próxima", bg: "#E1F5EE", color: "#0F6E56" },
    done: { label: "Realizada", bg: "#e8ede9", color: "#6b7c72" },
    cancelled: { label: "Cancelada", bg: "#FCEBEB", color: "#791F1F" },
  }
  const s = statusMap[appt.status]

  return (
    <article className="bg-white border border-[#d9e3dd] rounded-2xl px-5 py-4 mb-3 grid grid-cols-[1fr_auto] items-center gap-4 hover:border-[#0F6E56] hover:shadow-[0_4px_24px_rgba(14,26,20,0.08)] transition-all duration-200">
      <div>
        <h3 className="text-[16px] font-bold text-[#0e1a14] mb-0.5">
          {appt.clinic}
        </h3>
        <p className="text-[13px] text-[#6b7c72] mb-2">
          {appt.doctor} · {appt.specialty}
        </p>
        <div className="flex flex-wrap gap-2">
          <span
            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
            style={{ background: s.bg, color: s.color }}
          >
            {s.label}
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#f2f5f3] text-[#6b7c72]">
            {appt.date} · {appt.time}
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#f2f5f3] text-[#6b7c72]">
            {appt.payment}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[20px] font-bold text-[#1D9E75] mb-1">
          {appt.price}
        </div>
        {appt.status === "upcoming" && (
          <button
            onClick={() => onCancel(appt.id)}
            className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-[#F7C1C1] text-[#E24B4A] bg-[#FCEBEB] hover:bg-[#E24B4A] hover:text-white hover:border-[#E24B4A] transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            <X size={12} />
            Cancelar
          </button>
        )}
      </div>
    </article>
  )
}

// ── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, updateUser, cancelAppt } = useAuth()
  const { showToast } = useToast()
  const { openBooking } = useBooking()

  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [apptFilter, setApptFilter] = useState("all")

  const [notifSettings, setNotifSettings] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    push: true,
    week: false,
    day: true,
    twoHours: true,
    thirtyMin: false,
    promos: false,
    reviews: true,
  })

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cpf: user?.cpf || "",
    healthPlan: user?.healthPlan || "",
  })

  if (!user) {
    return (
      <div className="min-h-screen pt-[66px] flex items-center justify-center text-[#6b7c72]">
        <div className="text-center">
          <p className="text-lg mb-2">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  const appointments = user.appointments || []
  const filtered =
    apptFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === apptFilter)

  const upcoming = appointments.filter((a) => a.status === "upcoming")
  const done = appointments.filter((a) => a.status === "done")
  const nextAppt = upcoming[0]

  function saveProfile() {
    updateUser({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone,
      cpf: profileForm.cpf,
      healthPlan: profileForm.healthPlan,
    })
    showToast("✅ Dados salvos com sucesso!")
  }

  function toggleNotif(key: keyof typeof notifSettings) {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const inputClass =
    "w-full border-[1.5px] border-[#d9e3dd] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#0e1a14] outline-none focus:border-[#1D9E75] transition-colors duration-200 bg-white"
  const labelClass =
    "block text-[12px] font-medium text-[#2a3d33] mb-1.5"

  return (
    <main className="min-h-screen pt-[66px]">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar */}
          <aside className="bg-white border border-[#d9e3dd] rounded-[20px] p-6 lg:sticky lg:top-[90px]">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[28px] font-bold mx-auto mb-3"
              style={{ background: user.color }}
              aria-hidden="true"
            >
              {(user.firstName[0] || "").toUpperCase()}
            </div>
            <h1 className="text-[18px] font-bold text-[#0e1a14] text-center mb-0.5">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-[13px] text-[#6b7c72] text-center mb-5">
              {user.email}
            </p>

            <nav
              className="flex flex-col gap-1 mb-4"
              aria-label="Menu do perfil"
            >
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 cursor-pointer w-full text-left ${
                    activeTab === id
                      ? "bg-[#E1F5EE] text-[#0F6E56]"
                      : "text-[#6b7c72] hover:bg-[#f2f5f3] hover:text-[#0e1a14]"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                  {activeTab === id && (
                    <ChevronRight size={14} className="ml-auto" aria-hidden="true" />
                  )}
                </button>
              ))}
            </nav>

            <button
              onClick={() => { logout(); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#6b7c72] hover:bg-[#f2f5f3] hover:text-[#0e1a14] transition-colors cursor-pointer"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </aside>

          {/* Main content */}
          <div>
            {/* ── Dashboard tab ── */}
            {activeTab === "dashboard" && (
              <section aria-labelledby="dashboard-heading">
                <h2
                  id="dashboard-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Olá, {user.firstName}!
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-6">
                  Bem-vindo ao seu painel de saúde.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { n: appointments.length, l: "Consultas totais" },
                    { n: upcoming.length, l: "Próximas" },
                    { n: done.length, l: "Realizadas" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="bg-white border border-[#d9e3dd] rounded-2xl p-4 text-center"
                    >
                      <div className="text-[28px] font-bold text-[#1D9E75]">
                        {s.n}
                      </div>
                      <div className="text-[12px] text-[#6b7c72] mt-0.5">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5 mb-4">
                  <h3 className="text-[15px] font-semibold text-[#0e1a14] mb-4 pb-3 border-b border-[#e8ede9]">
                    Próxima consulta
                  </h3>
                  {nextAppt ? (
                    <div>
                      <div className="text-[16px] font-bold text-[#0e1a14] mb-1">
                        {nextAppt.clinic}
                      </div>
                      <div className="text-[13px] text-[#6b7c72] mb-2">
                        {nextAppt.doctor} · {nextAppt.date} às {nextAppt.time}
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#E1F5EE] text-[#0F6E56]">
                        Confirmada
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6b7c72]">
                      <Calendar
                        size={36}
                        className="mx-auto mb-2 text-[#d9e3dd]"
                      />
                      <p className="text-[14px] mb-3">
                        Nenhuma consulta agendada.
                      </p>
                      <button
                        onClick={() => openBooking()}
                        className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-4 py-2 rounded-xl text-[13px] font-medium transition-colors cursor-pointer"
                      >
                        Agendar agora
                      </button>
                    </div>
                  )}
                </div>

                {appointments.length > 0 && (
                  <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5">
                    <h3 className="text-[15px] font-semibold text-[#0e1a14] mb-4 pb-3 border-b border-[#e8ede9]">
                      Atividade recente
                    </h3>
                    {appointments.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="flex justify-between items-center py-2.5 border-b border-[#f2f5f3] last:border-0 text-[13px]"
                      >
                        <div>
                          <span className="font-medium text-[#0e1a14]">
                            {a.clinic}
                          </span>
                          <span className="text-[#6b7c72]"> · {a.date}</span>
                        </div>
                        <span className="text-[#1D9E75] font-medium">
                          {a.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Appointments tab ── */}
            {activeTab === "appointments" && (
              <section aria-labelledby="appts-heading">
                <h2
                  id="appts-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Minhas Consultas
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Histórico completo de agendamentos.
                </p>

                <div
                  className="flex gap-2 flex-wrap mb-5"
                  role="group"
                  aria-label="Filtrar consultas"
                >
                  {APPT_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setApptFilter(f.id)}
                      aria-pressed={apptFilter === f.id}
                      className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer border ${
                        apptFilter === f.id
                          ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                          : "bg-white border-[#d9e3dd] text-[#6b7c72] hover:border-[#1D9E75] hover:text-[#1D9E75]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-14 text-[#6b7c72]">
                    <Calendar
                      size={48}
                      className="mx-auto mb-3 text-[#d9e3dd]"
                    />
                    <p className="text-[15px]">Nenhuma consulta encontrada.</p>
                  </div>
                ) : (
                  filtered.map((a) => (
                    <ApptCard
                      key={a.id}
                      appt={a}
                      onCancel={(id) => {
                        cancelAppt(id)
                        showToast("Consulta cancelada.")
                      }}
                    />
                  ))
                )}
              </section>
            )}

            {/* ── Settings tab ── */}
            {activeTab === "settings" && (
              <section aria-labelledby="settings-heading">
                <h2
                  id="settings-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Meus Dados
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Gerencie suas informações pessoais.
                </p>

                <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5 mb-4">
                  <h3 className="text-[15px] font-semibold text-[#0e1a14] pb-3 mb-4 border-b border-[#e8ede9]">
                    Informações pessoais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "pf-first", label: "Nome", key: "firstName", type: "text", auto: "given-name" },
                      { id: "pf-last", label: "Sobrenome", key: "lastName", type: "text", auto: "family-name" },
                      { id: "pf-email", label: "E-mail", key: "email", type: "email", auto: "email", disabled: true },
                      { id: "pf-phone", label: "Telefone", key: "phone", type: "tel", auto: "tel", placeholder: "(47) 99999-9999" },
                      { id: "pf-cpf", label: "CPF", key: "cpf", type: "text", placeholder: "000.000.000-00" },
                      { id: "pf-plan", label: "Convênio", key: "healthPlan", type: "text", placeholder: "Particular / Nome do plano" },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className={labelClass}>
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={(profileForm as any)[field.key]}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          placeholder={(field as any).placeholder}
                          autoComplete={(field as any).auto}
                          disabled={(field as any).disabled}
                          className={
                            inputClass +
                            ((field as any).disabled
                              ? " opacity-60 cursor-not-allowed"
                              : "")
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={saveProfile}
                    className="mt-5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
                  >
                    Salvar alterações
                  </button>
                </div>

                <div className="bg-white border border-[#d9e3dd] rounded-2xl p-5">
                  <h3 className="text-[15px] font-semibold text-[#0e1a14] pb-3 mb-4 border-b border-[#e8ede9]">
                    Segurança
                  </h3>
                  {["Senha atual", "Nova senha", "Confirmar nova senha"].map(
                    (lbl, i) => (
                      <div key={lbl} className="mb-3">
                        <label
                          htmlFor={`pass-${i}`}
                          className={labelClass}
                        >
                          {lbl}
                        </label>
                        <input
                          id={`pass-${i}`}
                          type="password"
                          placeholder="••••••••"
                          className={inputClass}
                        />
                      </div>
                    )
                  )}
                  <button
                    onClick={() => showToast("✅ Senha alterada com sucesso!")}
                    className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
                  >
                    Alterar senha
                  </button>
                </div>
              </section>
            )}

            {/* ── Notifications tab ── */}
            {activeTab === "notifications" && (
              <section aria-labelledby="notif-heading">
                <h2
                  id="notif-heading"
                  className="text-[24px] font-bold text-[#0e1a14] mb-0.5"
                >
                  Notificações
                </h2>
                <p className="text-[14px] text-[#6b7c72] mb-5">
                  Configure como quer receber seus lembretes.
                </p>

                {[
                  {
                    title: "Canais de notificação",
                    items: [
                      { key: "email", label: "E-mail", desc: "Confirmações e lembretes por e-mail" },
                      { key: "sms", label: "SMS", desc: "Mensagem de texto no celular cadastrado" },
                      { key: "whatsapp", label: "WhatsApp", desc: "Mensagem via WhatsApp Business" },
                      { key: "push", label: "Push (navegador)", desc: "Notificações diretas no navegador" },
                    ],
                  },
                  {
                    title: "Antecedência dos lembretes",
                    items: [
                      { key: "week", label: "1 semana antes", desc: "Lembrete semanal da consulta agendada" },
                      { key: "day", label: "1 dia antes", desc: "Lembrete na véspera da consulta" },
                      { key: "twoHours", label: "2 horas antes", desc: "Lembrete de última hora" },
                      { key: "thirtyMin", label: "30 minutos antes", desc: "Aviso de que a consulta está próxima" },
                    ],
                  },
                  {
                    title: "Outras notificações",
                    items: [
                      { key: "promos", label: "Promoções e novidades", desc: "Receba ofertas de clínicas parceiras" },
                      { key: "reviews", label: "Avaliações", desc: "Lembrete para avaliar consultas realizadas" },
                    ],
                  },
                ].map((group) => (
                  <div
                    key={group.title}
                    className="bg-white border border-[#d9e3dd] rounded-2xl p-5 mb-4"
                  >
                    <h3 className="text-[15px] font-semibold text-[#0e1a14] pb-3 mb-2 border-b border-[#e8ede9]">
                      {group.title}
                    </h3>
                    {group.items.map(({ key, label, desc }) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3.5 border-b border-[#f2f5f3] last:border-0"
                      >
                        <div>
                          <label
                            htmlFor={`notif-${key}`}
                            className="text-[14px] font-medium text-[#0e1a14] block cursor-pointer"
                          >
                            {label}
                          </label>
                          <p className="text-[12px] text-[#6b7c72]">{desc}</p>
                        </div>
                        <Toggle
                          id={`notif-${key}`}
                          checked={notifSettings[key as keyof typeof notifSettings]}
                          onChange={() =>
                            toggleNotif(key as keyof typeof notifSettings)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))}

                <button
                  onClick={() => showToast("✅ Preferências salvas!")}
                  className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-6 py-2.5 rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
                >
                  Salvar preferências
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
