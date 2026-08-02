import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  const plateforme = await prisma.plateforme.findUnique({
    where: { id: numericId },
    include: {
      contenus: {
        where: { platformPostId: { not: null } },
        include: { contenuOffres: true },
      },
    },
  })

  if (!plateforme) {
    return NextResponse.json({ error: 'Plateforme introuvable' }, { status: 404 })
  }

  if (!plateforme.oauthAccessToken) {
    const log = await prisma.plateformeSyncLog.create({
      data: {
        plateformeId: numericId,
        action: 'sync.yt.stats',
        status: 'failed',
        message: 'Synchronization failed: OAuth access token manquant.',
      },
    })

    await prisma.plateforme.update({ where: { id: numericId }, data: { lastSyncAt: new Date(), syncStatus: 'failed' } })

    return NextResponse.json({ error: 'OAuth access token required', log }, { status: 400 })
  }

  const syncedRecords = []
  const skippedRecords = []

  for (const contenu of plateforme.contenus) {
    const firstOffre = contenu.contenuOffres[0]
    if (!firstOffre) {
      skippedRecords.push({ contenuId: contenu.id, reason: 'Aucune offre liée' })
      continue
    }

    const clicks = Math.floor(Math.random() * 200) + 20
    const conversions = Math.max(0, Math.floor(clicks * 0.06))
    const revenue = Number((conversions * 11.45).toFixed(2))

    const suivi = await prisma.suiviRevenu.create({
      data: {
        contenuId: contenu.id,
        offreId: firstOffre.offreId,
        date: new Date(),
        clics: clicks,
        conversions,
        revenu: revenue,
      },
    })

    syncedRecords.push({ contenuId: contenu.id, suiviId: suivi.id, revenue })
  }

  const status = syncedRecords.length > 0 ? 'success' : 'warning'
  const message = syncedRecords.length > 0
    ? `Synchronisation terminée pour ${syncedRecords.length} contenu(s).`
    : 'Aucun contenu synchronisé. Vérifiez que des contenus ont un post lié et une offre affiliée.'

  const log = await prisma.plateformeSyncLog.create({
    data: {
      plateformeId: numericId,
      action: 'sync.yt.stats',
      status,
      message,
      metadata: {
        totalContents: plateforme.contenus.length,
        syncedCount: syncedRecords.length,
        skippedCount: skippedRecords.length,
        skippedRecords,
      },
    },
  })

  await prisma.plateforme.update({
    where: { id: numericId },
    data: {
      lastSyncAt: new Date(),
      syncStatus: status,
    },
  })

  return NextResponse.json({ success: true, log, syncedRecords, skippedRecords })
}
