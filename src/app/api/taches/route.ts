import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const taches = await prisma.tache.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { contenu: true },
  })
  return NextResponse.json(taches)
}

export async function POST(request: Request) {
  const body = await request.json()
  const tache = await prisma.tache.create({
    data: {
      contenuId: body.contenuId,
      titre: body.titre,
      type: body.type,
      statut: body.statut,
      echeance: body.echeance ? new Date(body.echeance) : undefined,
    },
  })
  return NextResponse.json(tache, { status: 201 })
}
