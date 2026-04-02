"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const CDN = "https://focis.b-cdn.net"

const GALLERY_IMAGES = [
  { src: `${CDN}/site/edzes-kozben.jpg`, alt: "Edzés közben", span: "col-span-1 row-span-1" },
  { src: `${CDN}/Photos/14-Pavlidis_2.png`, alt: "Pavlidis - SL Benfica", span: "col-span-1 row-span-2" },
  { src: `${CDN}/site/gyerekek-edzovel.jpg`, alt: "Gyerekek az edzővel", span: "col-span-1 row-span-1" },
  { src: `${CDN}/Photos/5-BARRENECHEA-3.png`, alt: "Barrenechea - SL Benfica", span: "col-span-1 row-span-2" },
  { src: `${CDN}/site/gyerekcsapat.jpg`, alt: "Csapatmunka", span: "col-span-1 row-span-1" },
  { src: `${CDN}/Photos/84-Joao-Rego.png`, alt: "João Rego - SL Benfica", span: "col-span-1 row-span-1" },
  { src: `${CDN}/site/kickoff-labdaval.jpg`, alt: "Kickoff", span: "col-span-1 row-span-1" },
  { src: `${CDN}/Photos/66-J.Wynder_2.png`, alt: "Wynder - SL Benfica", span: "col-span-1 row-span-1" },
]

export function GallerySection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1f0a]" />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-14">
          <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
            {t.gallery.badge}
          </span>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {t.gallery.title}{" "}
            <span className="text-primary">{t.gallery.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-base text-white/60 max-w-2xl mx-auto">{t.gallery.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {GALLERY_IMAGES.map((image, index) => (
            <div key={index} className={`group relative overflow-hidden cursor-pointer ${image.span}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0a1f0a] opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">{image.alt}</span>
              </div>
              <div className="absolute inset-0 border-2 border-[#d4a017]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
