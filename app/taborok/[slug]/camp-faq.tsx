"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface CampFaqProps {
  items: { question: string; answer: string }[]
}

export function CampFaq({ items }: CampFaqProps) {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="border border-[#d4a017]/10 bg-[#0a1f0a]/30 px-6"
        >
          <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
