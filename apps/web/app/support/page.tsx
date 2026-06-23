"use client"

import { useState } from "react"
import { ChevronDown, MessageSquare, Phone, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

const FAQS = [
  {
    q: "Como faço para agendar uma consulta?",
    a: "Escolha a clínica ou especialidade desejada, selecione um horário disponível, informe seus dados e confirme o pagamento. O agendamento é concluído em segundos e você recebe a confirmação por e-mail.",
  },
  {
    q: "Posso cancelar ou remarcar minha consulta?",
    a: "Sim! Cancele ou remarcações sem custo com até 24 horas de antecedência. Para cancelamentos com menos de 24h será cobrada uma taxa de R$ 30. Acesse 'Meus agendamentos' no seu perfil para gerenciar.",
  },
  {
    q: "O agendamento é confirmado na hora?",
    a: "Sim. Ao confirmar o pagamento, seu horário é reservado imediatamente e a clínica é notificada. Você receberá e-mail e notificação de confirmação.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Aceitamos cartão de crédito, débito e Pix. O pagamento é processado de forma segura via criptografia SSL. Você pode salvar cartões para agendamentos futuros.",
  },
  {
    q: "As consultas são presenciais ou online?",
    a: "Depende da clínica e especialidade. Nos cards de agendamento você encontra a modalidade disponível. Cada vez mais clínicas oferecem ambas as opções.",
  },
  {
    q: "Como encontro uma clínica na minha cidade?",
    a: "Use a barra de busca na página inicial. Filtre por especialidade, localização e disponibilidade. Estamos em expansão contínua pelo Brasil.",
  },
  {
    q: "É seguro informar meus dados pessoais?",
    a: "Sim. Seguimos a LGPD e usamos criptografia de ponta a ponta. Suas informações são utilizadas apenas para gerenciar seus agendamentos.",
  },
  {
    q: "Posso usar o Smart Consulta para minha clínica?",
    a: "Claro! Temos um portal completo para clínicas gerenciarem agendamentos, profissionais e relatórios. Acesse o Portal da Clínica ou entre em contato conosco.",
  },
]

type TicketStatus = "open" | "sent"

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border-b border-[#f2f5f3] last:border-0 transition-colors ${open ? "bg-[#fafcfb]" : ""}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer group">
        <span className="text-[15px] font-medium text-[#0e1a14] group-hover:text-[#1D9E75] transition-colors">{q}</span>
        <ChevronDown size={16} className={`text-[#6b7c72] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-[14px] text-[#6b7c72] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("open")
  const [errors, setErrors]   = useState<Record<string, string>>({})

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim())    errs.name    = "Informe seu nome."
    if (!email.trim())   errs.email   = "Informe seu e-mail."
    if (!subject.trim()) errs.subject = "Informe o assunto."
    if (!message.trim()) errs.message = "Descreva sua dúvida."
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Store ticket in localStorage as mock
    try {
      const tickets = JSON.parse(localStorage.getItem("sc_support_tickets") || "[]")
      tickets.push({
        id: "TK" + Date.now(),
        name, email, subject, message,
        status: "open",
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("sc_support_tickets", JSON.stringify(tickets))
    } catch {}

    setTicketStatus("sent")
  }

  const inp = (err?: string) =>
    `w-full border-[1.5px] ${err ? "border-[#E24B4A]" : "border-[#d9e3dd] focus:border-[#1D9E75]"} rounded-xl px-4 py-3 text-[14px] text-[#0e1a14] outline-none transition-colors bg-white`

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Navbar */}
      <header className="bg-white border-b border-[#e8ede9] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="w-8 h-8 bg-[#1D9E75] rounded-xl flex items-center justify-center text-white font-bold text-sm">+</span>
            <span className="font-bold text-[16px]">
              <span className="text-[#EF9F27]">SMART</span>
              <span className="text-[#0e1a14]"> Consulta</span>
            </span>
          </Link>
          <Link href="/" className="text-[13px] text-[#1D9E75] hover:underline cursor-pointer">← Voltar ao site</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E1F5EE] text-[#0F6E56] rounded-full px-4 py-1.5 text-[12px] font-semibold mb-4">
            <MessageSquare size={12} /> Central de Suporte
          </div>
          <h1 className="text-[36px] font-bold text-[#0e1a14] mb-3">Como podemos ajudar?</h1>
          <p className="text-[16px] text-[#6b7c72] max-w-md mx-auto">
            Encontre respostas rápidas nas perguntas frequentes ou abra um chamado para nossa equipe.
          </p>
        </div>

        {/* Contact channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { Icon: MessageSquare, title: "Chat online", desc: "Atendimento em tempo real", sub: "Seg–Sex, 8h–18h", color: "#1D9E75" },
            { Icon: Mail,          title: "E-mail",      desc: "suporte@smartconsulta.com",  sub: "Resposta em até 24h",  color: "#378ADD" },
            { Icon: Phone,         title: "Telefone",    desc: "(47) 3322-0000",             sub: "Seg–Sex, 8h–18h",     color: "#EF9F27" },
          ].map(({ Icon, title, desc, sub, color }) => (
            <div key={title} className="bg-white rounded-2xl border border-[#e8ede9] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="font-semibold text-[14px] text-[#0e1a14]">{title}</p>
                <p className="text-[13px] text-[#1D9E75]">{desc}</p>
                <p className="text-[12px] text-[#6b7c72]">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <div>
            <h2 className="text-[22px] font-bold text-[#0e1a14] mb-4">Perguntas frequentes</h2>
            <div className="bg-white rounded-2xl border border-[#e8ede9] overflow-hidden">
              {FAQS.map(item => <FaqItem key={item.q} {...item} />)}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-[22px] font-bold text-[#0e1a14] mb-4">Abrir chamado</h2>
            <div className="bg-white rounded-2xl border border-[#e8ede9] p-6">
              {ticketStatus === "sent" ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-[#1D9E75]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0e1a14] mb-2">Chamado aberto!</h3>
                  <p className="text-[14px] text-[#6b7c72] mb-5">
                    Recebemos sua mensagem. Nossa equipe entrará em contato em até 24 horas no e-mail <strong>{email}</strong>.
                  </p>
                  <button onClick={() => { setTicketStatus("open"); setName(""); setEmail(""); setSubject(""); setMessage("") }}
                    className="px-5 py-2.5 rounded-xl bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-[13px] font-semibold transition-colors cursor-pointer">
                    Novo chamado
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-4">
                  {([
                    ["name",    "Seu nome",  "text",  "João Silva",         name,    setName],
                    ["email",   "E-mail",    "email", "joao@email.com",     email,   setEmail],
                    ["subject", "Assunto",   "text",  "Problema com agendamento", subject, setSubject],
                  ] as const).map(([k, label, type, ph, val, setter]) => (
                    <div key={k}>
                      <label className="block text-[12px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">{label}</label>
                      <input type={type} value={val as string} onChange={e => { (setter as any)(e.target.value); setErrors(p => ({ ...p, [k]: "" })) }}
                        placeholder={ph} className={inp(errors[k])} />
                      {errors[k] && <p className="text-[11px] text-[#E24B4A] mt-1">{errors[k]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-wide text-[#2a3d33] mb-1.5">Mensagem</label>
                    <textarea value={message} onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })) }}
                      rows={5} placeholder="Descreva detalhadamente sua dúvida ou problema..."
                      className={inp(errors.message) + " resize-none"} />
                    {errors.message && <p className="text-[11px] text-[#E24B4A] mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit"
                    className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl py-3 text-[15px] font-semibold transition-colors cursor-pointer">
                    Enviar chamado
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
