import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const plateformes = await prisma.plateforme.findMany({
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(plateformes)
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
