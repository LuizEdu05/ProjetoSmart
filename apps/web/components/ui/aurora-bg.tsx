// Server component — no client JS needed, pure CSS animations

const CROSSES = [
  { top: "11%", left: "5%",   size: 18, opacity: 0.065, delay: 0,   dur: 6.0 },
  { top: "51%", right: "6.5%",size: 17, opacity: 0.05,  delay: 1.8, dur: 9.0 },
  { top: "8%",  left: "38%",  size: 11, opacity: 0.038, delay: 4.2, dur: 8.5 },
]

export function AuroraBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base */}
      <div className="absolute inset-0 bg-[#f7fffc] dark:bg-[#060d09]" />

      {/* Blob 1 — primary mint, top-left */}
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

      {/* Blob 2 — sky blue, top-right */}
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

      {/* Fine dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(14,26,20,0.05) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      {/* Prismatic top-edge glow */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(29,158,117,0.35) 25%, rgba(55,138,221,0.25) 50%, rgba(29,158,117,0.35) 75%, transparent 100%)",
        }}
      />

      {/* Floating + sprites */}
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
