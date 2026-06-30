"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register, user } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace("/")
  }, [user, router])

  const blobsData = useMemo(() => [
    { size: 300, left: 75, top: 10,  delay: -7,  dur: 24 },
    { size: 220, left: 5,  top: 20,  delay: -12, dur: 19 },
    { size: 260, left: 55, top: 60,  delay: -4,  dur: 22 },
    { size: 190, left: 15, top: 70,  delay: -16, dur: 18 },
    { size: 280, left: 40, top: 5,   delay: -9,  dur: 26 },
    { size: 200, left: 85, top: 55,  delay: -2,  dur: 20 },
  ], [])

  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      blobRefs.current.forEach((blob, i) => {
        if (blob) {
          const speed = (i + 1) * 12
          blob.style.marginLeft = `${x * speed}px`
          blob.style.marginTop  = `${y * speed}px`
        }
      })
    }
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { firstName, lastName, email, phone, password } = form
    if (!firstName || !email || !password) {
      showToast("Preencha todos os campos obrigatórios.", "error")
      return
    }
    if (password.trim().length < 6) {
      showToast("Senha deve ter pelo menos 6 caracteres.", "error")
      return
    }
    setLoading(true)
    try {
      await register(firstName, lastName, email, phone, password)
      router.replace("/")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta."
      showToast(msg, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sc-reg-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;800&family=Space+Mono&display=swap');

        .sc-reg-wrap {
          background: #060d09;
          color: #fff;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 32px 0;
        }
        .sc-reg-wrap * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

        .sc-reg-stage {
          position: fixed;
          inset: 0;
          filter: url('#sc-reg-goo');
          opacity: 0.5;
          z-index: 0;
          pointer-events: none;
        }
        .sc-reg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(22px);
          animation: sc-reg-float 20s infinite alternate ease-in-out;
          transition: margin 0.1s ease-out;
        }
        @keyframes sc-reg-float {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(-8vw,15vh) scale(1.1); }
          66%  { transform: translate(6vw,8vh) scale(0.9); }
          100% { transform: translate(-4vw,-10vh) scale(1.05); }
        }

        .sc-reg-svg { position: absolute; width: 0; height: 0; }

        .sc-reg-panel {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          padding: 40px;
        }

        .sc-reg-back {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(29,158,117,0.7);
          background: none; border: none; cursor: pointer; padding: 0;
          display: inline-flex; align-items: center; gap: 6px;
          margin-bottom: 40px;
          transition: color 0.3s;
        }
        .sc-reg-back:hover { color: #1D9E75; }

        .sc-reg-brand {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(29,158,117,0.6);
          display: block;
          margin-bottom: 8px;
        }
        .sc-reg-title {
          font-weight: 800;
          font-size: 2.6rem;
          line-height: 0.92;
          letter-spacing: -2px;
          margin: 0 0 44px -3px;
          color: #fff;
        }
        .sc-reg-title span { color: #1D9E75; }

        .sc-reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 20px;
        }

        .sc-reg-field {
          position: relative;
          margin-bottom: 28px;
          transition: transform 0.4s cubic-bezier(0.2,1,0.3,1);
        }
        .sc-reg-field:focus-within { transform: translateX(8px); }
        .sc-reg-field label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .sc-reg-field input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(29,158,117,0.2);
          color: #fff;
          padding: 10px 0;
          font-size: 16px;
          outline: none;
        }
        .sc-reg-field input::placeholder { color: rgba(255,255,255,0.18); }
        .sc-reg-glow {
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #1D9E75;
          box-shadow: 0 0 10px #1D9E75;
          transition: width 0.6s cubic-bezier(0.2,1,0.3,1);
        }
        .sc-reg-field input:focus + .sc-reg-glow { width: 100%; }

        .sc-reg-btn-wrap {
          margin-top: 40px;
          position: relative;
          filter: url('#sc-reg-goo');
        }
        .sc-reg-btn-drop {
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; height: 100%;
          background: #1D9E75;
          transform: translate(-50%,-50%);
          border-radius: 50px;
          z-index: 1;
          transition: all 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .sc-reg-btn-wrap:hover .sc-reg-btn-drop {
          transform: translate(-50%,-50%) scale(1.05,1.2);
          filter: brightness(1.15);
        }
        .sc-reg-btn {
          background: #1D9E75;
          color: #fff;
          border: none;
          padding: 18px 40px;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          cursor: pointer;
          width: 100%;
          position: relative;
          z-index: 2;
          transition: letter-spacing 0.3s, opacity 0.2s;
        }
        .sc-reg-btn:hover { letter-spacing: 5px; }
        .sc-reg-btn:disabled { opacity: 0.6; cursor: not-allowed; letter-spacing: 3px; }

        .sc-reg-footer {
          margin-top: 32px;
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
        }
        .sc-reg-footer button, .sc-reg-footer a {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: color 0.3s;
        }
        .sc-reg-footer button:hover, .sc-reg-footer a:hover { color: #1D9E75; }
      `}</style>

      <svg className="sc-reg-svg">
        <defs>
          <filter id="sc-reg-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="sc-reg-stage">
        {blobsData.map((b, i) => (
          <div
            key={i}
            ref={el => { blobRefs.current[i] = el }}
            className="sc-reg-blob"
            style={{
              width:  `${b.size}px`,
              height: `${b.size}px`,
              left:   `${b.left}%`,
              top:    `${b.top}%`,
              background: i % 3 === 0
                ? "linear-gradient(135deg, #3DBE8C, #1D9E75)"
                : i % 3 === 1
                ? "linear-gradient(135deg, #1D9E75, #0F6E56)"
                : "linear-gradient(135deg, #0F6E56, #04100a)",
              animationDelay:    `${b.delay}s`,
              animationDuration: `${b.dur}s`,
            }}
          />
        ))}
      </div>

      <main className="sc-reg-panel">
        <button className="sc-reg-back" onClick={() => router.push("/")}>
          ← Voltar ao site
        </button>

        <span className="sc-reg-brand">Smart Consulta · Nova conta</span>
        <h1 className="sc-reg-title">CRIAR<br/><span>SUA CONTA</span></h1>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="sc-reg-row">
            <div className="sc-reg-field">
              <label>Nome *</label>
              <input type="text" placeholder="João" value={form.firstName} onChange={set("firstName")} required />
              <div className="sc-reg-glow" />
            </div>
            <div className="sc-reg-field">
              <label>Sobrenome</label>
              <input type="text" placeholder="Silva" value={form.lastName} onChange={set("lastName")} />
              <div className="sc-reg-glow" />
            </div>
          </div>

          <div className="sc-reg-field">
            <label>E-mail *</label>
            <input type="email" placeholder="seu@email.com" value={form.email} onChange={set("email")} required />
            <div className="sc-reg-glow" />
          </div>

          <div className="sc-reg-field">
            <label>WhatsApp</label>
            <input type="tel" placeholder="(47) 99999-9999" value={form.phone} onChange={set("phone")} />
            <div className="sc-reg-glow" />
          </div>

          <div className="sc-reg-field">
            <label>Senha * (mín. 6 caracteres)</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
            <div className="sc-reg-glow" />
          </div>

          <div className="sc-reg-btn-wrap">
            <div className="sc-reg-btn-drop" />
            <button type="submit" className="sc-reg-btn" disabled={loading}>
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </div>
        </form>

        <footer className="sc-reg-footer">
          <button onClick={() => router.push("/login")}>Já tenho conta</button>
          <a href="mailto:suporte@smartconsulta.com.br">Suporte</a>
        </footer>
      </main>
    </div>
  )
}
