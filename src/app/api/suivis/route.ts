import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const suivis = await prisma.suiviRevenu.findMany({
    orderBy: { date: 'desc' },
    include: { contenu: true, offre: true },
  })
  return NextResponse.json(suivis)
}

export async function POST(request: Request) {
  const body = await request.json()
  const suivi = await prisma.suiviRevenu.create({
    data: {
      contenuId: body.contenuId,
      offreId: body.offreId,
      date: new Date(body.date),
      clics: body.clics ?? 0,
      conversions: body.conversions ?? 0,
      revenu: body.revenu ?? 0,
    },
  })
  return NextResponse.json(suivi, { status: 201 })
}
