"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type?: "success" | "error" | "info"
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = Date.now().toString()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3500)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[400] flex flex-col gap-2 items-center"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-3 bg-[#0e1a14] text-white rounded-xl px-5 py-3 text-sm font-medium shadow-2xl whitespace-nowrap"
            >
              <span>{t.message}</span>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((x) => x.id !== t.id))
                }
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar notificação"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}
