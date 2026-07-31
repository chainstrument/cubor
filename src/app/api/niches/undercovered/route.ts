import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const niches = await prisma.niche.findMany({
    include: { offres: { include: { offre: true } } },
    orderBy: { updatedAt: 'desc' },
  })

  const undercovered = niches.filter((n) => (n.offres?.length ?? 0) < 3)

  return NextResponse.json(
    undercovered.map((n) => ({ id: n.id, nom: n.nom, offreCount: n.offres?.length ?? 0 }))
  )
}
