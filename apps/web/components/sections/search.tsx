"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

const CHIPS = [
  "Todos",
  "Clínica Geral",
  "Cardiologia",
  "Pediatria",
  "Dermatologia",
  "Ortopedia",
  "Odontologia",
  "Online",
]

export function SearchSection() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [query, setQuery] = useState("")
  const [active, setActive] = useState("Todos")

  const isDark = resolvedTheme === "dark"

  function handleSearch() {
    router.push("/buscar")
  }

  function handleChip(chip: string) {
    setActive(chip)
    router.push("/buscar")
  }

  return (
    <section
      className="relative overflow-hidden py-16 px-5 md:px-10"
      id="busca"
      style={{
        background: isDark
          ? "#0a1209"
          : "linear-gradient(180deg, rgba(29,158,117,0.05) 0%, rgba(242,245,243,0.92) 80px, rgba(242,245,243,0.92) 100%)",
      }}
    >
      {/* Subtle top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent 5%, rgba(29,158,117,0.18) 40%, rgba(55,138,221,0.12) 60%, transparent 95%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom glow line */}
      <div
        className="absolute inset-x-0 bottom-0 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, transparent 5%, rgba(14,26,20,0.07) 40%, rgba(14,26,20,0.07) 60%, transparent 95%)",
        }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-[780px] mx-auto text-center"
      >
        <p className="text-[11px] font-bold text-[#1D9E75] tracking-[0.1em] uppercase mb-2">
          Busca inteligente
        </p>
        <h2 className="text-[clamp(26px,4vw,42px)] font-bold text-[#0e1a14] dark:text-white mb-2">
          Encontre o médico ideal
        </h2>
        <p className="text-[15px] text-[#6b7c72] dark:text-white/60 mb-8">
          Pesquise por especialidade, nome do médico ou clínica.
        </p>

        {/* Search bar */}
        <div className="bg-white dark:bg-[#0a1209] border-[1.5px] border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] rounded-2xl flex items-center px-4 py-1.5 gap-2 shadow-[0_4px_24px_rgba(14,26,20,0.08)] dark:shadow-none focus-within:border-[#1D9E75] transition-colors duration-200">
          <Search
            size={17}
            className="text-[#6b7c72] flex-shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="search-input" className="sr-only">
            Buscar clínica ou médico
          </label>
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Cardiologista, Dr. Silva, Clínica..."
            className="flex-1 border-none outline-none text-[15px] text-[#0e1a14] dark:text-white placeholder:text-[#aab5af] dark:placeholder:text-white/30 bg-transparent py-2.5 min-w-0"
            aria-label="Buscar clínica, médico ou especialidade"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-xl px-5 py-2.5 text-[14px] font-medium transition-colors duration-200 cursor-pointer flex-shrink-0"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </div>

        {/* Specialty chips */}
        <div
          className="flex gap-2 flex-wrap justify-center mt-5"
          role="group"
          aria-label="Filtrar por especialidade"
        >
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              aria-pressed={active === chip}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer border ${
                active === chip
                  ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                  : "bg-white dark:bg-[#0a1209] border-[#d9e3dd] dark:border-[rgba(29,158,117,0.2)] text-[#6b7c72] dark:text-white/60 hover:bg-[#1D9E75] hover:border-[#1D9E75] hover:text-white"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
