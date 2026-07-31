import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const nicheId = url.searchParams.get('nicheId') ? Number(url.searchParams.get('nicheId')) : undefined
  const plateformeId = url.searchParams.get('plateformeId') ? Number(url.searchParams.get('plateformeId')) : undefined
  const offreId = url.searchParams.get('offreId') ? Number(url.searchParams.get('offreId')) : undefined
  const start = url.searchParams.get('start') ? new Date(url.searchParams.get('start')!) : undefined
  const end = url.searchParams.get('end') ? new Date(url.searchParams.get('end')!) : undefined

  const where: any = {}
  if (offreId) where.offreId = offreId
  if (start) where.date = { gte: start }
  if (end) where.date = { ...(where.date ?? {}), lte: end }
  if (nicheId) where.contenu = { nicheId }
  if (plateformeId) where.contenu = { ...(where.contenu ?? {}), plateformeId }

  const suivis = await prisma.suiviRevenu.findMany({ where, include: { contenu: true, offre: true }, orderBy: { date: 'desc' } })

  const totals = await prisma.suiviRevenu.aggregate({
    _sum: { revenu: true, clics: true, conversions: true },
    where,
  })

  return NextResponse.json({ totals: totals._sum, rows: suivis })
}
