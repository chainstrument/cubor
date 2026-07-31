import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const niches = await prisma.niche.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(niches)
}

export async function POST(request: Request) {
  const body = await request.json()
  const niche = await prisma.niche.create({
    data: {
      nom: body.nom,
      statut: body.statut || 'Idée',
      description: body.description || '',
    },
  })
  return NextResponse.json(niche, { status: 201 })
}
