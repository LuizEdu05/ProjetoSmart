"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace("/")
  }, [user, router])

  const blobsData = useMemo(() => [
    { size: 320, left: 10, top: 15,  delay: -5,  dur: 22 },
    { size: 240, left: 65, top: 5,   delay: -10, dur: 18 },
    { size: 280, left: 50, top: 55,  delay: -3,  dur: 25 },
    { size: 200, left: 80, top: 70,  delay: -15, dur: 20 },
    { size: 260, left: 20, top: 65,  delay: -8,  dur: 17 },
    { size: 180, left: 40, top: 30,  delay: -12, dur: 23 },
  ], [])

  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      blobRefs.current.forEach((blob, i) => {
        if (blob) {
          const speed = (i + 1) * 15
          blob.style.marginLeft = `${x * speed}px`
          blob.style.marginTop  = `${y * speed}px`
        }
      })
    }
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { showToast("Preencha e-mail e senha.", "error"); return }
    setLoading(true)
    try {
      await login(email, password)
      router.replace("/")
    } catch {
      showToast("E-mail ou senha incorretos.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sc-mercury-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;800&family=Space+Mono&display=swap');

        .sc-mercury-wrap {
          background: #060d09;
          color: #fff;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .sc-mercury-wrap * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

        .sc-stage {
          position: absolute;
          inset: 0;
          filter: url('#sc-goo');
          opacity: 0.55;
          z-index: 0;
        }
        .sc-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(22px);
          animation: sc-float 20s infinite alternate ease-in-out;
          transition: margin 0.1s ease-out;
        }
        @keyframes sc-float {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(8vw,18vh) scale(1.15); }
          66%  { transform: translate(-6vw,9vh) scale(0.85); }
          100% { transform: translate(4vw,-8vh) scale(1.1); }
        }

        .sc-svg-hidden { position: absolute; width: 0; height: 0; }

        .sc-panel {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          padding: 48px 40px;
        }

        .sc-back {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(29,158,117,0.7);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 48px;
          transition: color 0.3s;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .sc-back:hover { color: #1D9E75; }

        .sc-brand {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(29,158,117,0.6);
          display: block;
          margin-bottom: 8px;
        }
        .sc-title {
          font-weight: 800;
          font-size: 3rem;
          line-height: 0.92;
          letter-spacing: -2px;
          margin: 0 0 56px -3px;
          color: #fff;
        }
        .sc-title span { color: #1D9E75; }

        .sc-field {
          position: relative;
          margin-bottom: 32px;
          transition: transform 0.4s cubic-bezier(0.2,1,0.3,1);
        }
        .sc-field:focus-within { transform: translateX(10px); }
        .sc-field label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .sc-field input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(29,158,117,0.2);
          color: #fff;
          padding: 12px 0;
          font-size: 18px;
          outline: none;
          transition: border-color 0.4s;
        }
        .sc-field input::placeholder { color: rgba(255,255,255,0.2); }
        .sc-glow-line {
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #1D9E75;
          box-shadow: 0 0 12px #1D9E75;
          transition: width 0.6s cubic-bezier(0.2,1,0.3,1);
        }
        .sc-field input:focus + .sc-glow-line { width: 100%; }

        .sc-btn-wrap {
          margin-top: 48px;
          position: relative;
          filter: url('#sc-goo');
        }
        .sc-btn-drop {
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; height: 100%;
          background: #1D9E75;
          transform: translate(-50%,-50%);
          border-radius: 50px;
          z-index: 1;
          transition: all 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .sc-btn-wrap:hover .sc-btn-drop {
          transform: translate(-50%,-50%) scale(1.05,1.2);
          filter: brightness(1.15);
        }
        .sc-btn {
          background: #1D9E75;
          color: #fff;
          border: none;
          padding: 20px 40px;
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
        .sc-btn:hover { letter-spacing: 5px; }
        .sc-btn:disabled { opacity: 0.6; cursor: not-allowed; letter-spacing: 3px; }

        .sc-footer {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
        }
        .sc-footer a, .sc-footer button {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.3s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          padding: 0;
          text-transform: uppercase;
        }
        .sc-footer a:hover, .sc-footer button:hover { color: #1D9E75; }
      `}</style>

      <svg className="sc-svg-hidden">
        <defs>
          <filter id="sc-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="sc-stage">
        {blobsData.map((b, i) => (
          <div
            key={i}
            ref={el => { blobRefs.current[i] = el }}
            className="sc-blob"
            style={{
              width:  `${b.size}px`,
              height: `${b.size}px`,
              left:   `${b.left}%`,
              top:    `${b.top}%`,
              background: i % 3 === 0
                ? "linear-gradient(135deg, #1D9E75, #0F6E56)"
                : i % 3 === 1
                ? "linear-gradient(135deg, #3DBE8C, #1D9E75)"
                : "linear-gradient(135deg, #0F6E56, #060d09)",
              animationDelay:    `${b.delay}s`,
              animationDuration: `${b.dur}s`,
            }}
          />
        ))}
      </div>

      <main className="sc-panel">
        <button className="sc-back" onClick={() => router.push("/")}>
          ← Voltar ao site
        </button>

        <span className="sc-brand">Smart Consulta · Acesso</span>
        <h1 className="sc-title">ENTRAR<br/><span>NA PLATAFORMA</span></h1>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="sc-field">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div className="sc-glow-line" />
          </div>

          <div className="sc-field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="sc-glow-line" />
          </div>

          <div className="sc-btn-wrap">
            <div className="sc-btn-drop" />
            <button type="submit" className="sc-btn" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </div>
        </form>

        <footer className="sc-footer">
          <button onClick={() => router.push("/register")}>Criar conta</button>
          <a href="mailto:suporte@smartconsulta.com.br">Suporte</a>
        </footer>
      </main>
    </div>
  )
}
