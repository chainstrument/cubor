import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results = await prisma.suiviRevenu.groupBy({
    by: ['contenuId'],
    _sum: { revenu: true, conversions: true, clics: true },
    orderBy: { _sum: { revenu: 'desc' } },
    take: 5,
  })

  const enriched = await Promise.all(
    results.map(async (r) => {
      const contenu = await prisma.contenu.findUnique({ where: { id: r.contenuId } })
      return {
        contenuId: r.contenuId,
        titre: contenu?.titre ?? '—',
        revenu: r._sum.revenu ?? 0,
        conversions: r._sum.conversions ?? 0,
        clics: r._sum.clics ?? 0,
      }
    })
  )

  return NextResponse.json(enriched)
}
