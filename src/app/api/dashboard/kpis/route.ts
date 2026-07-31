import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [publishedCount, activeNichesCount, revenueThisMonth] = await Promise.all([
    prisma.contenu.count({ where: { datePublication: { not: null } } }),
    prisma.niche.count({ where: { statut: { not: 'Abandonnée' } } }),
    prisma.suiviRevenu.aggregate({
      _sum: { revenu: true },
      where: { date: { gte: startOfMonth } },
    }),
  ])

  return NextResponse.json({
    publishedCount,
    activeNichesCount,
    revenueThisMonth: revenueThisMonth._sum.revenu ?? 0,
  })
}
