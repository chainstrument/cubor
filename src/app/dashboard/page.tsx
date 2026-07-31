import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getKPIs() {
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

  return { publishedCount, activeNichesCount, revenueThisMonth: revenueThisMonth._sum.revenu ?? 0 }
}

async function getTopPerformers() {
  const results = await prisma.suiviRevenu.groupBy({
    by: ['contenuId'],
    _sum: { revenu: true },
    orderBy: { _sum: { revenu: 'desc' } },
    take: 5,
  })

  return Promise.all(
    results.map(async (r) => {
      const contenu = await prisma.contenu.findUnique({ where: { id: r.contenuId } })
      return { id: r.contenuId, titre: contenu?.titre ?? '—', revenu: r._sum.revenu ?? 0 }
    })
  )
}

async function getAlerts() {
  const blockedCount = await prisma.contenu.count({ where: { statutPipeline: 'Bloqué' } })
  const undercovered = await prisma.niche.findMany({ include: { offres: true } })
  const undercoveredList = undercovered.filter((n) => (n.offres?.length ?? 0) < 3).map((n) => ({ id: n.id, nom: n.nom, offreCount: n.offres?.length ?? 0 }))
  return { blockedCount, undercoveredList }
}

export default async function DashboardPage() {
  const [kpis, top, alerts] = await Promise.all([getKPIs(), getTopPerformers(), getAlerts()])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
            <p className="mt-2 text-slate-400">Vue d'ensemble — KPIs, alertes et top performers.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/contenus/new" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Nouveau contenu</Link>
            <Link href="/niches/new" className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700">Nouvelle niche</Link>
            <Link href="/offres/new" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Nouvelle offre</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Contenus publiés (ce mois)</p>
            <p className="mt-2 text-2xl font-semibold text-white">{kpis.publishedCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Niches actives</p>
            <p className="mt-2 text-2xl font-semibold text-white">{kpis.activeNichesCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Revenu (mois)</p>
            <p className="mt-2 text-2xl font-semibold text-white">€{Math.round(kpis.revenueThisMonth)}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Alertes</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">Contenus bloqués</p>
                <span className="text-white font-semibold">{alerts.blockedCount}</span>
              </div>
              <div>
                <p className="text-sm text-slate-300">Niches sous-couvertes (&lt;3 offres)</p>
                {alerts.undercoveredList.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alerts.undercoveredList.map((n) => (
                      <Link key={n.id} href={`/niches/${n.id}`} className="rounded-full bg-rose-700 px-3 py-1 text-sm text-white">{n.nom} ({n.offreCount})</Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-slate-400">Aucune alerte</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Top performers</h2>
            {top.length > 0 ? (
              <ol className="mt-4 space-y-3">
                {top.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                    <Link href={`/contenus/${t.id}`} className="font-semibold text-white">{t.titre}</Link>
                    <span className="text-slate-300">€{Math.round(t.revenu)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-slate-400">Aucun relevé.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
