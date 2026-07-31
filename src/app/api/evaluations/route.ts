import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const entityType = url.searchParams.get('type') as any
  const entityId = url.searchParams.get('id') ? Number(url.searchParams.get('id')) : undefined

  if (!entityType || !entityId) return NextResponse.json([], { status: 400 })

  const evaluations = await prisma.evaluation.findMany({
    where: { typeEntite: entityType, idEntite: entityId },
    include: { critere: true },
    orderBy: { dateEvaluation: 'desc' },
  })
  return NextResponse.json(evaluations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const evaluation = await prisma.evaluation.create({
    data: {
      idEntite: Number(body.idEntite),
      typeEntite: body.typeEntite,
      critereId: Number(body.critereId),
      score: Number(body.score),
      note: body.note || null,
      source: body.source || null,
      dateEvaluation: new Date(),
    },
  })

  return NextResponse.json(evaluation, { status: 201 })
}
