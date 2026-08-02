import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  const body = await request.json()

  const plateforme = await prisma.plateforme.update({
    where: { id: numericId },
    data: {
      provider: body.provider ?? 'youtube',
      oauthAccessToken: body.accessToken ?? undefined,
      oauthRefreshToken: body.refreshToken ?? undefined,
      oauthTokenExpiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      oauthStatus: body.accessToken ? 'connected' : 'disconnected',
      syncStatus: 'ready',
    },
  })

  await prisma.plateformeSyncLog.create({
    data: {
      plateformeId: numericId,
      action: 'oauth.token.save',
      status: 'success',
      message: 'Tokens OAuth enregistrés avec succès.',
      metadata: {
        provider: plateforme.provider,
        expiresAt: plateforme.oauthTokenExpiresAt?.toISOString() ?? null,
      },
    },
  })

  return NextResponse.json({ success: true, plateforme })
}
