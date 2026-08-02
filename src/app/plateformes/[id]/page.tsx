import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PlateformeSyncPanel from '@/components/plateformes/PlateformeSyncPanel'

export const dynamic = 'force-dynamic'

async function getPlateforme(id: string) {
  const plateforme = await prisma.plateforme.findUnique({
    where: { id: Number(id) },
    include: {
      syncLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
  if (!plateforme) return null

  const contenuCount = await prisma.contenu.count({ where: { plateformeId: plateforme.id } })
  const publishedCount = await prisma.contenu.count({ where: { plateformeId: plateforme.id, datePublication: { not: null } } })
  const revenue = await prisma.suiviRevenu.aggregate({ _sum: { revenu: true }, where: { contenu: { plateformeId: plateforme.id } } })

  return { ...plateforme, contenuCount, publishedCount, revenue: revenue._sum.revenu ?? 0 }
}

export default async function PlateformePage({ params }: { params: { id: string } }) {
  const plateforme = await getPlateforme(params.id)

  if (!plateforme) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Plateforme introuvable</h1>
          <p className="mt-4 text-slate-400">La plateforme demandée n'existe pas ou a été supprimée.</p>
          <Link href="/plateformes" className="mt-6 inline-block rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
            Retour aux plateformes
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">{plateforme.nom}</h1>
              <p className="mt-2 text-slate-400">{plateforme.formatDominant || 'Format non défini'}</p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              {plateforme.frequenceIdeale || 'Fréquence inconnue'}
            </span>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Contenus liés</p>
              <p className="mt-2 text-lg font-semibold text-white">{plateforme.contenuCount}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Publiés</p>
              <p className="mt-2 text-lg font-semibold text-white">{plateforme.publishedCount}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Revenu total</p>
              <p className="mt-2 text-lg font-semibold text-white">€{Math.round(plateforme.revenue)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Provider</p>
              <p className="text-lg font-semibold text-white">{plateforme.provider || 'Aucun'}</p>
              <p className="text-sm text-slate-400">Statut OAuth : {plateforme.oauthStatus || 'non configuré'}</p>
              <p className="text-sm text-slate-400">Dernière synchronisation : {plateforme.lastSyncAt ? new Date(plateforme.lastSyncAt).toLocaleString() : 'Jamais'}</p>
              <p className="text-sm text-slate-400">Etat sync : {plateforme.syncStatus || 'inconnu'}</p>
            </div>
            <Link href="/plateformes" className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              Retour aux plateformes
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <PlateformeSyncPanel
              plateformeId={plateforme.id}
              provider={plateforme.provider}
              oauthStatus={plateforme.oauthStatus}
              lastSyncAt={plateforme.lastSyncAt?.toISOString() ?? null}
              syncStatus={plateforme.syncStatus}
            />

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="text-2xl font-semibold text-white">Logs de synchronisation</h2>
              <p className="mt-2 text-sm text-slate-400">Historique récent des synchronisations et actions API.</p>
              <div className="mt-6 space-y-4">
                {plateforme.syncLogs.length === 0 ? (
                  <p className="text-slate-400">Aucun log disponible pour cette plateforme.</p>
                ) : (
                  plateforme.syncLogs.map((log) => (
                    <div key={log.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">{log.action}</p>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{log.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{log.message || 'Aucun message'}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
