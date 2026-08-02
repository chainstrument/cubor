import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  const logs = await prisma.plateformeSyncLog.findMany({
    where: { plateformeId: numericId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(logs)
}
