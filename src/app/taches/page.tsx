import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getTaches() {
  return prisma.tache.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { contenu: true },
  })
}

export default async function TachesPage() {
  const taches = await getTaches()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Tâches</h1>
            <p className="mt-2 text-slate-400">Gère les actions à réaliser par contenu.</p>
          </div>
          <Link href="/taches/new" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Nouvelle tâche
          </Link>
        </div>

        <div className="grid gap-4">
          {taches.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">
              Aucune tâche définie pour le moment.
            </div>
          ) : (
            taches.map((tache) => (
              <article key={tache.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{tache.titre}</h2>
                    <p className="mt-2 text-slate-400">Contenu : {tache.contenu.titre}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Type : {tache.type} · Statut : {tache.statut}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    Mis à jour {tache.updatedAt.toISOString().slice(0, 10)}
                  </span>
                </div>

                {tache.echeance ? (
                  <div className="mt-4 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                    Échéance : {new Date(tache.echeance).toISOString().slice(0, 10)}
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
