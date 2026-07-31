import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getPlateformes() {
  const plateformes = await prisma.plateforme.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: { _count: { select: { contenus: true } } },
  })

  return Promise.all(
    plateformes.map(async (p) => {
      const publishedCount = await prisma.contenu.count({ where: { plateformeId: p.id, datePublication: { not: null } } })
      const revenue = await prisma.suiviRevenu.aggregate({ _sum: { revenu: true }, where: { contenu: { plateformeId: p.id } } })
      return {
        id: p.id,
        nom: p.nom,
        formatDominant: p.formatDominant,
        frequenceIdeale: p.frequenceIdeale,
        updatedAt: p.updatedAt,
        contenuCount: p._count?.contenus ?? 0,
        publishedCount,
        revenue: revenue._sum.revenu ?? 0,
      }
    })
  )
}

export default async function PlateformesPage() {
  const plateformes = await getPlateformes()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Plateformes</h1>
            <p className="mt-2 text-slate-400">Gère tes plateformes de publication.</p>
          </div>
          <Link href="/plateformes/new" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Nouvelle plateforme
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plateformes.map((plateforme) => (
            <article key={plateforme.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{plateforme.nom}</h2>
                  <p className="mt-2 text-slate-400">{plateforme.formatDominant || 'Format non défini'}</p>
                  <p className="mt-3 text-sm text-slate-400">Contenus : {plateforme.contenuCount ?? '—'} · Publiés : {plateforme.publishedCount ?? '—'}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {plateforme.frequenceIdeale || 'Fréquence inconnue'}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <p>Mis à jour {plateforme.updatedAt.toISOString().slice(0, 10)}</p>
                <Link href={`/plateformes/${plateforme.id}`} className="font-medium text-indigo-300 hover:text-indigo-200">
                  Voir
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
