"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[SmartConsulta] Unhandled error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7fffc] dark:bg-[#060d09] px-5">
      <div className="text-center max-w-[400px]">
        <div className="text-[48px] mb-4">⚠️</div>
        <h1 className="text-[22px] font-black text-[#0e1a14] dark:text-white mb-2">
          Algo deu errado
        </h1>
        <p className="text-[14px] text-[#6b7c72] dark:text-white/50 mb-6">
          Ocorreu um erro inesperado. Tente novamente ou volte à página inicial.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl text-[14px] font-medium transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="px-5 py-2.5 border border-[#e8ede9] dark:border-[rgba(29,158,117,0.2)] text-[#0e1a14] dark:text-white rounded-xl text-[14px] font-medium hover:border-[#1D9E75] transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}
