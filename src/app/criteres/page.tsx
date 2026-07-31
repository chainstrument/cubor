import { prisma } from '@/lib/prisma'
import NewCritereForm from '@/components/criteres/NewCritereForm'

export const dynamic = 'force-dynamic'

async function getCriteres() {
  return prisma.critere.findMany({ orderBy: { updatedAt: 'desc' } })
}

export default async function CriteresPage() {
  const criteres = await getCriteres()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Catalogue de critères</h1>
          <p className="mt-2 text-slate-400">Gère les critères utilisés pour l’évaluation des entités.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Nouveau critère</h2>
              <div className="mt-4">
                <NewCritereForm />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Liste des critères</h2>
              <div className="mt-4 space-y-3">
                {criteres.map((c) => (
                  <div key={c.id} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{c.nom}</p>
                        <p className="text-sm text-slate-400">{c.categorie ?? ''} • {c.typeCible}</p>
                      </div>
                      <div className="text-slate-300">Poids: {c.poids ?? '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
