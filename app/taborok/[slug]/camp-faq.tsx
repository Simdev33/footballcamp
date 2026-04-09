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
          className="border border-border/60 bg-white px-6 shadow-sm"
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
