"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.16, delay: i * 0.03, ease: "easeOut" as const },
  }),
}

interface FilterDropdownProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: T[]
  /** Label for a "clear / show all" option. Omit for a plain single-select. */
  allLabel?: string
  /** Value the "all" option maps to. Defaults to "" (only meaningful when T = string). */
  allValue?: T
  icon?: React.ElementType
  getLabel?: (v: T) => string
  disabled?: boolean
  className?: string
}

export function FilterDropdown<T extends string | number = string>({
  value,
  onChange,
  options,
  allLabel,
  allValue,
  icon: Icon,
  getLabel,
  disabled,
  className,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
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

  function select(v: T) {
    onChange(v)
    setOpen(false)
  }

  const label = (v: T) => (getLabel ? getLabel(v) : String(v))
  const resolvedAllValue = allValue !== undefined ? allValue : ("" as unknown as T)
  const isAllSelected = allLabel !== undefined && value === resolvedAllValue

  const items: { v: T; label: string; isAll: boolean }[] = [
    ...(allLabel !== undefined ? [{ v: resolvedAllValue, label: allLabel, isAll: true }] : []),
    ...options.map((o) => ({ v: o, label: label(o), isAll: false })),
  ]

  const triggerLabel = isAllSelected ? allLabel! : label(value)

  return (
    <div className={`relative ${className ?? ""}`} ref={ref}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          w-full flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] cursor-pointer
          transition-[border-color,background-color,box-shadow] duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          ${open
            ? "border-[#1D9E75] bg-[rgba(29,158,117,0.06)] text-[#1D9E75] shadow-[0_0_0_3px_rgba(29,158,117,0.1)]"
            : "border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] bg-white dark:bg-[#0a1209] text-[#0e1a14] dark:text-white hover:border-[#1D9E75]"
          }
        `}
      >
        {Icon && <Icon size={13} className={open ? "text-[#1D9E75]" : "text-[#6b7c72] dark:text-white/40"} />}
        <span className="truncate flex-1 text-left">{triggerLabel}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} className="flex items-center flex-shrink-0">
          <ChevronDown size={14} className="text-[#6b7c72] dark:text-white/40" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: "top left" }}
            className="
              absolute left-0 top-[calc(100%+8px)] z-50
              w-full min-w-[180px] max-h-72 overflow-y-auto rounded-2xl
              bg-white dark:bg-[#0d1a11]
              border border-[#e8ede9] dark:border-[rgba(29,158,117,0.18)]
              shadow-[0_8px_32px_rgba(14,26,20,0.12),0_2px_8px_rgba(14,26,20,0.06)]
              dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]
              p-1.5
            "
          >
            {items.map((item, i) => {
              const isSelected = value === item.v
              return (
                <motion.button
                  key={`${item.v}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => select(item.v)}
                  className={`
                    w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl
                    text-[13px] text-left cursor-pointer transition-colors duration-100
                    ${isSelected
                      ? "bg-[rgba(29,158,117,0.1)] text-[#1D9E75] font-medium"
                      : item.isAll
                        ? "text-[#6b7c72] dark:text-white/50 hover:bg-[rgba(29,158,117,0.06)] hover:text-[#1D9E75]"
                        : "text-[#2a3d33] dark:text-white/80 hover:bg-[rgba(29,158,117,0.06)] hover:text-[#1D9E75]"
                    }
                  `}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && <Check size={13} className="flex-shrink-0" />}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
