import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const offre = await prisma.offreAffiliation.findUnique({
    where: { id: Number(params.id) },
    include: {
      niches: { include: { niche: true } },
      contenuOffres: { include: { contenu: true } },
    },
  })

  if (!offre) {
    return NextResponse.json({ error: 'Offre non trouvée' }, { status: 404 })
  }

  return NextResponse.json(offre)
}

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params
  const body = await request.json()

  const offre = await prisma.offreAffiliation.update({
    where: { id: Number(params.id) },
    data: {
      nomProgramme: body.nomProgramme,
      tauxCommission: body.tauxCommission ? Number(body.tauxCommission) : undefined,
      lienAffilie: body.lienAffilie,
      dureeCookie: body.dureeCookie ? Number(body.dureeCookie) : undefined,
      statut: body.statut,
    },
  })

  return NextResponse.json(offre)
}

export async function DELETE(_request: Request, context: RouteContext) {
  const params = await context.params
  await prisma.offreAffiliation.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({}, { status: 204 })
}
