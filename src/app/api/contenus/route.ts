import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const contenus = await prisma.contenu.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })
  return NextResponse.json(contenus)
}

export async function POST(request: Request) {
  const body = await request.json()
  const contenu = await prisma.contenu.create({
    data: {
      titre: body.titre,
      statutPipeline: body.statutPipeline || 'Idée',
      nicheId: body.nicheId,
      plateformeId: body.plateformeId,
      contenuOffres: body.offreIds?.length
        ? {
            create: body.offreIds.map((offreId: number) => ({ offre: { connect: { id: offreId } } })),
          }
        : undefined,
    },
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })
  return NextResponse.json(contenu, { status: 201 })
}
