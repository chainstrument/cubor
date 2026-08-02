import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  const plateforme = await prisma.plateforme.findUnique({
    where: { id: numericId },
    include: {
      syncLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!plateforme) {
    return NextResponse.json({ error: 'Plateforme introuvable' }, { status: 404 })
  }

  return NextResponse.json(plateforme)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  const body = await request.json()

  const updatedPlateforme = await prisma.plateforme.update({
    where: { id: numericId },
    data: {
      provider: body.provider ?? undefined,
      formatDominant: body.formatDominant ?? undefined,
      frequenceIdeale: body.frequenceIdeale ?? undefined,
      oauthAccessToken: body.accessToken ?? undefined,
      oauthRefreshToken: body.refreshToken ?? undefined,
      oauthTokenExpiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      oauthStatus: body.oauthStatus ?? undefined,
      syncStatus: body.syncStatus ?? undefined,
    },
  })

  return NextResponse.json(updatedPlateforme)
}
