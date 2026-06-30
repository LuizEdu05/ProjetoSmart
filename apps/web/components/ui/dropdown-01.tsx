"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Share2,
  BookmarkPlus,
  Trash2,
} from "lucide-react"

const ACTIONS = [
  {
    icon: Pencil,
    label: "Editar",
    shortcut: "⌘E",
    danger: false,
  },
  {
    icon: Copy,
    label: "Duplicar",
    shortcut: "⌘D",
    danger: false,
  },
  {
    icon: Share2,
    label: "Compartilhar",
    shortcut: "⌘S",
    danger: false,
  },
  {
    icon: BookmarkPlus,
    label: "Salvar",
    shortcut: "⌘B",
    danger: false,
  },
  null, // divider
  {
    icon: Trash2,
    label: "Excluir",
    shortcut: "⌫",
    danger: true,
  },
] as const

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, delay: i * 0.04, ease: "easeOut" as const },
  }),
}

export default function Component() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  let itemIndex = 0

  return (
    <div className="flex items-center justify-center p-10">
      <div className="relative" ref={ref}>
        {/* Trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Ações"
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center
            border transition-[border-color,background-color,box-shadow] duration-150 cursor-pointer
            ${open
              ? "border-[#1D9E75] bg-[rgba(29,158,117,0.1)] text-[#1D9E75] shadow-[0_0_0_3px_rgba(29,158,117,0.12)]"
              : "border-[#e8ede9] dark:border-[rgba(29,158,117,0.2)] bg-white dark:bg-[#0a1209] text-[#6b7c72] dark:text-white/60 hover:border-[#1D9E75] hover:text-[#1D9E75]"
            }
          `}
        >
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <MoreHorizontal size={16} />
          </motion.span>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: "top right" }}
              className="
                absolute right-0 top-[calc(100%+8px)] z-50
                w-52 rounded-2xl overflow-hidden
                bg-white dark:bg-[#0d1a11]
                border border-[#e8ede9] dark:border-[rgba(29,158,117,0.18)]
                shadow-[0_8px_32px_rgba(14,26,20,0.12),0_2px_8px_rgba(14,26,20,0.06)]
                dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]
                p-1.5
              "
            >
              {ACTIONS.map((action, i) => {
                if (action === null) {
                  return (
                    <div
                      key={`div-${i}`}
                      className="my-1 h-px bg-[#e8ede9] dark:bg-[rgba(29,158,117,0.1)] mx-1"
                    />
                  )
                }

                const currentIndex = itemIndex++
                const { icon: Icon, label, shortcut, danger } = action

                return (
                  <motion.button
                    key={label}
                    role="menuitem"
                    custom={currentIndex}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => setOpen(false)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
                      text-[13px] font-medium cursor-pointer
                      transition-colors duration-100 group
                      ${danger
                        ? "text-[#e05252] dark:text-[#ff7070] hover:bg-[rgba(224,82,82,0.08)]"
                        : "text-[#2a3d33] dark:text-white/80 hover:bg-[rgba(29,158,117,0.07)] hover:text-[#1D9E75] dark:hover:text-[#1D9E75]"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                        transition-colors duration-100
                        ${danger
                          ? "bg-[rgba(224,82,82,0.1)] text-[#e05252] dark:text-[#ff7070]"
                          : "bg-[#f2f5f3] dark:bg-[rgba(29,158,117,0.1)] text-[#6b7c72] dark:text-white/50 group-hover:bg-[rgba(29,158,117,0.12)] group-hover:text-[#1D9E75] dark:group-hover:text-[#1D9E75]"
                        }
                      `}
                    >
                      <Icon size={12} strokeWidth={2} />
                    </span>
                    <span className="flex-1 text-left">{label}</span>
                    <kbd
                      className={`
                        text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-100
                        ${danger ? "text-[#e05252]/60" : "text-[#6b7c72] dark:text-white/30"}
                      `}
                    >
                      {shortcut}
                    </kbd>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
