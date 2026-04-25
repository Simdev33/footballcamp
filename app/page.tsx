import { Hero } from "@/components/hero"
import BelowFold from "@/components/below-fold-home"
import { getPublicCamps } from "@/lib/public-camps"

export default async function Home() {
  const camps = await getPublicCamps()

  return (
    <main>
      <Hero initialCamps={camps} />
      <BelowFold initialCamps={camps} />
    </main>
  )
}
