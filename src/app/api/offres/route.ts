import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const offres = await prisma.offreAffiliation.findMany({
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(offres)
}

export async function POST(request: Request) {
  const body = await request.json()
  const offre = await prisma.offreAffiliation.create({
    data: {
      nomProgramme: body.nomProgramme,
      tauxCommission: body.tauxCommission ? Number(body.tauxCommission) : undefined,
      lienAffilie: body.lienAffilie,
      dureeCookie: body.dureeCookie ? Number(body.dureeCookie) : undefined,
      statut: body.statut || 'Actif',
    },
  })
  return NextResponse.json(offre, { status: 201 })
}
