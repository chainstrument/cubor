import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params
  const id = Number(params.id)
  const body = await request.json()

  if (!body.statutPipeline || typeof body.statutPipeline !== 'string') {
    return NextResponse.json({ error: 'Le statut pipeline est requis.' }, { status: 400 })
  }

  const contenu = await prisma.contenu.update({
    where: { id },
    data: {
      statutPipeline: body.statutPipeline,
      lienAsset: body.lienAsset,
      platformPostId: body.platformPostId,
      datePublication: body.datePublication ? new Date(body.datePublication) : undefined,
    },
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })

  return NextResponse.json(contenu)
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const id = Number(params.id)
  const contenu = await prisma.contenu.findUnique({
    where: { id },
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })

  if (!contenu) {
    return NextResponse.json({ error: 'Contenu introuvable.' }, { status: 404 })
  }

  return NextResponse.json(contenu)
}
