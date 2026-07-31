import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

export async function POST(_request: Request, context: RouteContext) {
  const params = await context.params
  const id = Number(params.id)

  const contenu = await prisma.contenu.findUnique({
    where: { id },
    include: { contenuOffres: true },
  })

  if (!contenu) {
    return NextResponse.json({ error: 'Contenu introuvable.' }, { status: 404 })
  }

  const duplicatedContenu = await prisma.contenu.create({
    data: {
      titre: `Copie de ${contenu.titre}`,
      statutPipeline: 'Idée',
      nicheId: contenu.nicheId,
      plateformeId: contenu.plateformeId,
      lienAsset: contenu.lienAsset,
      platformPostId: contenu.platformPostId,
      datePublication: contenu.datePublication,
      contenuOffres: contenu.contenuOffres.length
        ? {
            create: contenu.contenuOffres.map((relation) => ({
              offre: { connect: { id: relation.offreId } },
            })),
          }
        : undefined,
    },
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })

  return NextResponse.json(duplicatedContenu, { status: 201 })
}
