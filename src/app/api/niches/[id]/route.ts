import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const niche = await prisma.niche.findUnique({
    where: { id: Number(params.id) },
    include: {
      contenus: {
        orderBy: { updatedAt: 'desc' },
      },
      offres: {
        include: {
          offre: true,
        },
      },
    },
  })
  if (!niche) {
    return NextResponse.json({ error: 'Niche non trouvée' }, { status: 404 })
  }
  return NextResponse.json(niche)
}

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params
  const body = await request.json()
  const niche = await prisma.niche.update({
    where: { id: Number(params.id) },
    data: {
      nom: body.nom,
      statut: body.statut,
      description: body.description,
    },
  })
  return NextResponse.json(niche)
}

export async function DELETE(_request: Request, context: RouteContext) {
  const params = await context.params
  await prisma.niche.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({}, { status: 204 })
}
