"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// ── Blur-reveal text ──────────────────────────────────────────
export function BlurRevealText({
  text,
  triggerKey,
  className,
}: {
  text: string
  triggerKey: string | number
  className?: string
}) {
  const words = text.split(" ")
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={`${triggerKey}-${i}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 8 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`inline-block ${className ?? ""}`}
          style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </>
  )
}

// ── Generic Deck Carousel ─────────────────────────────────────
export function DeckCarousel<T>({
  items,
  renderCard,
}: {
  items: T[]
  renderCard: (item: T, textKey: number) => React.ReactNode
}) {
  const [current, setCurrent]       = useState(0)
  const [exitingIdx, setExitingIdx] = useState<number | null>(null)
  const [direction, setDirection]   = useState<1 | -1>(1)
  const [textKey, setTextKey]       = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView       = useInView(containerRef, { once: false, amount: 0.2 })
  const touchStartX  = useRef(0)
  const isAnimating  = exitingIdx !== null

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating) return
      const next = (current + dir + items.length) % items.length
      setDirection(dir)
      setExitingIdx(current)
      setTimeout(() => {
        setCurrent(next)
        setExitingIdx(null)
        setTextKey((k) => k + 1)
      }, 360)
    },
    [current, isAnimating, items.length]
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      onTouchStart={(e) => { touchStartX.current = e.touches[0]!.clientX }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0]!.clientX - touchStartX.current
        if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1)
      }}
    >
      {/* ── Card stack area ── */}
      <div className="absolute inset-x-0 top-0 bottom-[60px]">

        {/* Peek card 2 — furthest back */}
        {!isAnimating && items.length > 2 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[24px] bg-white/50 dark:bg-[#0d1f14]/50 border border-[#e8ede9]/70 dark:border-[rgba(29,158,117,0.08)] pointer-events-none"
            style={{ transform: "translateY(20px) scale(0.90)", transformOrigin: "bottom center", zIndex: 1 }}
          />
        )}

        {/* Peek card 1 — middle */}
        {!isAnimating && items.length > 1 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[24px] bg-white/75 dark:bg-[#0a1209]/75 border border-[#e8ede9] dark:border-[rgba(29,158,117,0.1)] pointer-events-none"
            style={{ transform: "translateY(11px) scale(0.95)", transformOrigin: "bottom center", zIndex: 2 }}
          />
        )}

        {/* Exiting card — falls away */}
        <AnimatePresence>
          {exitingIdx !== null && inView && (
            <motion.div
              key={`exit-${exitingIdx}`}
              className="absolute inset-0 rounded-[24px] overflow-hidden"
              style={{ zIndex: 10 }}
              initial={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
              animate={{ y: "110%", rotate: direction * 8, opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.36, ease: [0.45, 0, 1, 1] }}
            >
              {renderCard(items[exitingIdx]!, textKey - 1)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active card */}
        {exitingIdx === null && (
          <motion.div
            key={`active-${current}-${textKey}`}
            className="absolute inset-0 rounded-[24px] overflow-hidden shadow-[0_12px_48px_rgba(14,26,20,0.12)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.4)]"
            style={{ zIndex: 5 }}
            initial={inView ? { y: -20, scale: 0.97, opacity: 0 } : false}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderCard(items[current]!, textKey)}
          </motion.div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[56px] flex items-center justify-between"
        style={{ zIndex: 20 }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Clínica anterior"
          className="w-9 h-9 rounded-full border border-[#e8ede9] dark:border-[rgba(29,158,117,0.2)] bg-white dark:bg-[#0a1209] text-[#6b7c72] dark:text-white/60 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-[border-color,color] duration-200 flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-2 items-center" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Clínica ${i + 1}`}
              onClick={() => {
                if (i !== current) navigate(i > current ? 1 : -1)
              }}
              className={`rounded-full transition-all duration-200 cursor-pointer ${
                i === current
                  ? "w-6 h-2 bg-[#1D9E75]"
                  : "w-2 h-2 bg-[#d9e3dd] dark:bg-white/20 hover:bg-[#1D9E75]/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate(1)}
          aria-label="Próxima clínica"
          className="w-9 h-9 rounded-full border border-[#e8ede9] dark:border-[rgba(29,158,117,0.2)] bg-white dark:bg-[#0a1209] text-[#6b7c72] dark:text-white/60 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-[border-color,color] duration-200 flex items-center justify-center cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
