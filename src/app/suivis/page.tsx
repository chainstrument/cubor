import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSuivis() {
  return prisma.suiviRevenu.findMany({
    orderBy: { date: 'desc' },
    include: { contenu: true, offre: true },
  })
}

export default async function SuivisPage() {
  const suivis = await getSuivis()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Suivis de revenus</h1>
            <p className="mt-2 text-slate-400">Visualise les performances d’affiliation par contenu et programme.</p>
          </div>
          <Link href="/suivis/new" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Nouveau suivi
          </Link>
        </div>

        <div className="grid gap-4">
          {suivis.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">
              Aucun suivi enregistré pour le moment.
            </div>
          ) : (
            suivis.map((suivi) => (
              <article key={suivi.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{suivi.contenu.titre}</h2>
                    <p className="mt-2 text-slate-400">Offre : {suivi.offre.nomProgramme}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    {new Date(suivi.date).toISOString().slice(0, 10)}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3 text-sm text-slate-300">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-slate-500">Clics</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{suivi.clics}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-slate-500">Conversions</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{suivi.conversions}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-slate-500">Revenu</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{suivi.revenu.toFixed(2)} €</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
