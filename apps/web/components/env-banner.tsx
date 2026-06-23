"use client"

export function EnvBanner() {
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV
  const appEnv    = process.env.NEXT_PUBLIC_APP_ENV

  const env = vercelEnv ?? appEnv ?? "development"

  if (env === "production") return null

  const isPreview = env === "preview"
  const label  = isPreview ? "HOMOLOGAÇÃO (HML)" : "DESENVOLVIMENTO (DEV)"
  const bg     = isPreview ? "#EF9F27" : "#378ADD"

  return (
    <div
      role="status"
      aria-label={`Ambiente: ${label}`}
      style={{ background: bg }}
      className="fixed top-0 left-0 right-0 z-[9999] py-1 text-center text-white text-[11px] font-bold tracking-widest uppercase select-none"
    >
      ⚠ Ambiente {label} — não é produção
    </div>
  )
}
