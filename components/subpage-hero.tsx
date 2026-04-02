interface SubpageHeroProps {
  title: string
  titleHighlight?: string
  subtitle?: string
}

export function SubpageHero({ title, titleHighlight, subtitle }: SubpageHeroProps) {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1f0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a0171a_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 text-center">
        <div className="h-1 w-20 bg-gradient-to-r from-[#d4a017] to-[#b8860b] mx-auto mb-8" />

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {title}{" "}
          {titleHighlight && (
            <span className="text-[#d4a017]">{titleHighlight}</span>
          )}
        </h1>

        {subtitle && (
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">{subtitle}</p>
        )}

        <div className="h-1 w-20 bg-gradient-to-r from-[#d4a017] to-[#b8860b] mx-auto mt-10" />
      </div>
    </section>
  )
}
