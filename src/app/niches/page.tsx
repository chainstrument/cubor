import { prisma } from '@/lib/prisma'
import NicheList from '@/components/niches/NicheList'

export const dynamic = 'force-dynamic'

type NicheSummary = {
  id: number
  nom: string
  description: string | null
  statut: string
  updatedAt: Date
}

async function getNiches() {
  return prisma.niche.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      nom: true,
      description: true,
      statut: true,
      updatedAt: true,
    },
  })
}

export default async function NichesPage() {
  const niches = await getNiches()

  return <NicheList niches={niches} />
}
