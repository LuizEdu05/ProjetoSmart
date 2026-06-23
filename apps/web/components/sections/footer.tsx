export function Footer() {
  const COLS = [
    {
      title: "Plataforma",
      links: [
        { label: "Clínicas", href: "#clinicas" },
        { label: "Médicos", href: "#medicos" },
        { label: "Teleconsulta", href: "#" },
        { label: "Como funciona", href: "#como-funciona" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Sobre nós", href: "#" },
        { label: "Para clínicas", href: "/clinic/login" },
        { label: "Blog de saúde", href: "#" },
        { label: "Carreiras", href: "#" },
      ],
    },
    {
      title: "Suporte",
      links: [
        { label: "Central de ajuda", href: "/support" },
        { label: "WhatsApp", href: "#" },
        { label: "Privacidade", href: "#" },
        { label: "Termos de uso", href: "#" },
      ],
    },
  ]

  function scrollTo(href: string) {
    if (href === "#") return
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer
      className="bg-[#0e1a14] text-[#8fa398] pt-14 pb-7 px-5 md:px-10"
      aria-label="Rodapé"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-11">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-[26px] h-[26px] bg-[#1D9E75] rounded-[7px] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                +
              </span>
              <span className="font-bold text-[20px] leading-none">
                <span className="text-[#FFB800]">SMART</span>
                <span className="text-white"> Consulta</span>
              </span>
            </div>
            <p className="text-[13px] leading-[1.7]">
              A plataforma mais completa para agendamento de consultas médicas no
              Brasil.
            </p>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.05em] mb-3.5">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault()
                          scrollTo(link.href)
                        }
                      }}
                      className="text-[13px] text-[#8fa398] hover:text-[#1D9E75] transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[12px]">
          <span>© 2026 Smart Consulta. Todos os direitos reservados.</span>
          <span className="text-[#1D9E75]">Feito com ♥ para sua saúde</span>
        </div>
      </div>
    </footer>
  )
}
