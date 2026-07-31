import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const plateformes = await prisma.plateforme.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { contenus: true } } },
  })

  const payload = await Promise.all(
    plateformes.map(async (p) => {
      const publishedCount = await prisma.contenu.count({ where: { plateformeId: p.id, datePublication: { not: null } } })
      const revenue = await prisma.suiviRevenu.aggregate({
        _sum: { revenu: true },
        where: { contenu: { plateformeId: p.id } },
      })
      return {
        id: p.id,
        nom: p.nom,
        formatDominant: p.formatDominant,
        frequenceIdeale: p.frequenceIdeale,
        updatedAt: p.updatedAt,
        contenuCount: p._count?.contenus ?? 0,
        publishedCount,
        revenue: revenue._sum.revenu ?? 0,
      }
    })
  )

  return NextResponse.json(payload)
}

export async function POST(request: Request) {
  const body = await request.json()
  const plateforme = await prisma.plateforme.create({
    data: {
      nom: body.nom,
      formatDominant: body.formatDominant || '',
      frequenceIdeale: body.frequenceIdeale || '',
    },
  })
  return NextResponse.json(plateforme, { status: 201 })
}
