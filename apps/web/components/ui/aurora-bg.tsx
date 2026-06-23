// Server component — no client JS needed, pure CSS animations

type Cross = {
  top: string; left?: string; right?: string
  size: number; opacity: number; delay: number; dur: number
}

const CROSSES: Cross[] = [
  { top: "11%", left: "5%",   size: 18, opacity: 0.065, delay: 0,   dur: 6.0 },
  { top: "36%", left: "1.8%", size: 13, opacity: 0.055, delay: 2.5, dur: 8.0 },
  { top: "63%", left: "8%",   size: 15, opacity: 0.06,  delay: 1.2, dur: 5.5 },
  { top: "86%", left: "16%",  size: 11, opacity: 0.045, delay: 3.8, dur: 7.5 },
  { top: "19%", right: "3.5%",size: 13, opacity: 0.06,  delay: 3.5, dur: 7.0 },
  { top: "51%", right: "6.5%",size: 17, opacity: 0.05,  delay: 1.8, dur: 9.0 },
  { top: "78%", right: "11%", size: 12, opacity: 0.055, delay: 0.5, dur: 6.5 },
  { top: "42%", left: "48%",  size: 10, opacity: 0.04,  delay: 5.0, dur: 9.5 },
  { top: "72%", right: "30%", size: 14, opacity: 0.05,  delay: 2.0, dur: 7.0 },
  { top: "8%",  left: "38%",  size: 11, opacity: 0.038, delay: 4.2, dur: 8.5 },
]

export function AuroraBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* ── Warm cream base ──────────────────────────────── */}
      <div className="absolute inset-0 bg-[#f7fffc]" />

      {/* ── Aurora blob 1 — primary mint, top-left ──────── */}
      <div
        className="absolute rounded-full animate-aurora-1"
        style={{
          width: "90vw",
          height: "85vh",
          top: "-32vh",
          left: "-22vw",
          background:
            "radial-gradient(ellipse at center, rgba(29,158,117,0.11) 0%, rgba(29,158,117,0.045) 45%, transparent 70%)",
        }}
      />

      {/* ── Aurora blob 2 — sky blue, top-right ─────────── */}
      <div
        className="absolute rounded-full animate-aurora-2"
        style={{
          width: "68vw",
          height: "62vh",
          top: "-14vh",
          right: "-22vw",
          background:
            "radial-gradient(ellipse at center, rgba(55,138,221,0.09) 0%, rgba(55,138,221,0.03) 50%, transparent 70%)",
        }}
      />

      {/* ── Aurora blob 3 — diffuse center mint ─────────── */}
      <div
        className="absolute rounded-full animate-aurora-3"
        style={{
          width: "115vw",
          height: "52vh",
          top: "28vh",
          left: "-8vw",
          background:
            "radial-gradient(ellipse at center, rgba(29,158,117,0.06) 0%, transparent 65%)",
        }}
      />

      {/* ── Aurora blob 4 — amber-teal, bottom-right ────── */}
      <div
        className="absolute rounded-full animate-aurora-2"
        style={{
          width: "75vw",
          height: "68vh",
          bottom: "-30vh",
          right: "-20vw",
          background:
            "radial-gradient(ellipse at center, rgba(239,159,39,0.06) 0%, rgba(29,158,117,0.045) 50%, transparent 70%)",
          animationDelay: "10s",
          animationDuration: "29s",
        }}
      />

      {/* ── Aurora blob 5 — bottom-left accent ──────────── */}
      <div
        className="absolute rounded-full animate-aurora-1"
        style={{
          width: "52vw",
          height: "48vh",
          bottom: "-18vh",
          left: "-12vw",
          background:
            "radial-gradient(ellipse at center, rgba(29,158,117,0.07) 0%, transparent 65%)",
          animationDelay: "4s",
          animationDuration: "23s",
        }}
      />

      {/* ── Fine dot grid ────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(14,26,20,0.058) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      {/* ── Film grain / noise texture ───────────────────── */}
      <div className="absolute inset-0 noise-grain" />

      {/* ── Prismatic top-edge glow ──────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(29,158,117,0.35) 25%, rgba(55,138,221,0.25) 50%, rgba(29,158,117,0.35) 75%, transparent 100%)",
        }}
      />

      {/* ── Floating medical + sprites ───────────────────── */}
      {CROSSES.map((c, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none font-extralight text-[#1D9E75] animate-float"
          style={{
            top: c.top,
            left: c.left,
            right: c.right,
            fontSize: `${c.size}px`,
            opacity: c.opacity,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.dur}s`,
            lineHeight: 1,
          }}
        >
          +
        </div>
      ))}
    </div>
  )
}
