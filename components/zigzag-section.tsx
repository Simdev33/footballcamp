"use client"

import Image from "next/image"

interface ZigzagSectionProps {
  badge?: string
  title: string
  titleHighlight?: string
  titleEnd?: string
  text: string | React.ReactNode
  imageSrc: string
  imageAlt: string
  reversed?: boolean
  dark?: boolean
  children?: React.ReactNode
}

export function ZigzagSection({
  badge,
  title,
  titleHighlight,
  titleEnd,
  text,
  imageSrc,
  imageAlt,
  reversed = false,
  dark = false,
  children,
}: ZigzagSectionProps) {
  const bg = dark ? "bg-[#0a1f0a]" : "bg-background"
  const textColor = dark ? "text-white" : "text-foreground"
  const mutedColor = dark ? "text-white/70" : "text-muted-foreground"
  const badgeBg = dark
    ? "bg-[#d4a017] text-[#0a1f0a]"
    : "bg-[#0a1f0a] text-[#d4a017]"

  return (
    <section className={`relative py-14 md:py-28 overflow-hidden ${bg}`}>
      {dark && (
        <>
          {/* Pitch lines background for dark sections */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <rect x="40" y="30" width="720" height="540" fill="none" stroke="white" strokeWidth="2" />
            <line x1="400" y1="30" x2="400" y2="570" stroke="white" strokeWidth="2" />
            <circle cx="400" cy="300" r="80" fill="none" stroke="white" strokeWidth="2" />
          </svg>
          {/* Stadium atmosphere glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-[radial-gradient(ellipse_at_top,#d4a01710_0%,transparent_70%)]" />
        </>
      )}
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          <div className={`relative ${reversed ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-[#0a1f0a]" : "from-background"} via-transparent to-transparent opacity-40`} />
            </div>
            <div className={`absolute -top-3 md:-top-4 ${reversed ? "-right-3 md:-right-4" : "-left-3 md:-left-4"} w-full h-full border-2 border-[#d4a017]/30 rounded-lg -z-10`} />
          </div>

          <div className={`${reversed ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
            {badge && (
              <span className={`inline-block px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm tracking-[0.3em] uppercase font-medium ${badgeBg}`}>
                {badge}
              </span>
            )}

            <h2 className={`mt-4 md:mt-5 font-serif text-xl md:text-3xl lg:text-4xl font-bold leading-[1.1] ${textColor}`}>
              {title}{" "}
              {titleHighlight && (
                <span className="text-[#d4a017]">{titleHighlight}</span>
              )}{" "}
              {titleEnd}
            </h2>

            <div className={`mt-4 md:mt-6 text-sm md:text-base leading-relaxed ${mutedColor}`}>
              {typeof text === "string" ? <p>{text}</p> : text}
            </div>

            {children && <div className="mt-6 md:mt-8">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
