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
    <section className={`relative py-20 md:py-28 overflow-hidden ${bg}`}>
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className={`relative ${reversed ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
            <div className="relative aspect-[4/3] overflow-hidden">
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
            <div className={`absolute -top-4 ${reversed ? "-right-4" : "-left-4"} w-full h-full border-2 border-[#d4a017]/30 -z-10`} />
          </div>

          {/* Content */}
          <div className={`${reversed ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
            {badge && (
              <span className={`inline-block px-6 py-2 text-sm tracking-[0.3em] uppercase font-medium ${badgeBg}`}>
                {badge}
              </span>
            )}

            <h2 className={`mt-5 font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] ${textColor}`}>
              {title}{" "}
              {titleHighlight && (
                <span className="text-[#d4a017]">{titleHighlight}</span>
              )}{" "}
              {titleEnd}
            </h2>

            <div className={`mt-6 text-base leading-relaxed ${mutedColor}`}>
              {typeof text === "string" ? <p>{text}</p> : text}
            </div>

            {children && <div className="mt-8">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
