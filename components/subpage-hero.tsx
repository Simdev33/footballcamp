interface SubpageHeroProps {
  title: string
  titleHighlight?: string
  subtitle?: string
}

export function SubpageHero({ title, titleHighlight, subtitle }: SubpageHeroProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1f0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a0171a_0%,transparent_60%)]" />

      {/* Stadium floodlight glow */}
      <div className="absolute top-0 left-[20%] w-[25%] h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      <div className="absolute top-0 right-[20%] w-[25%] h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      {/* Pitch lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
        <line x1="400" y1="0" x2="400" y2="300" stroke="white" strokeWidth="2" />
        <circle cx="400" cy="150" r="60" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="400" cy="150" r="3" fill="white" />
      </svg>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24 text-center">
        {/* Football icon */}
        <svg viewBox="0 0 32 32" className="w-8 h-8 md:w-10 md:h-10 text-[#d4a017]/60 mx-auto mb-5" fill="none">
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 3L19 9 26 9 21 14 23 21 16 17 9 21 11 14 6 9 13 9Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white">
          {title}{" "}
          {titleHighlight && (
            <span className="text-[#d4a017]">{titleHighlight}</span>
          )}
        </h1>

        {subtitle && (
          <p className="mt-5 text-sm md:text-lg text-white/60 max-w-2xl mx-auto">{subtitle}</p>
        )}

        {/* Grass edge at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 md:h-3 bg-gradient-to-r from-[#1e6b1e] via-[#2d7a2d] to-[#1e6b1e]" />
      </div>
    </section>
  )
}
