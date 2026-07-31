import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const criteres = await prisma.critere.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(criteres)
}

export async function POST(request: Request) {
  const body = await request.json()
  const critere = await prisma.critere.create({
    data: {
      nom: body.nom,
      categorie: body.categorie || null,
      typeCible: body.typeCible || null,
      poids: body.poids ? Number(body.poids) : undefined,
    },
  })
  return NextResponse.json(critere, { status: 201 })
}
