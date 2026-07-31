import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getOffres() {
  return prisma.offreAffiliation.findMany({ orderBy: { updatedAt: 'desc' } })
}

export default async function OffresPage() {
  const offres = await getOffres()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Offres d'affiliation</h1>
            <p className="mt-2 text-slate-400">Gère les programmes d'affiliation associés à tes contenus.</p>
          </div>
          <Link href="/offres/new" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Nouvelle offre
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {offres.map((offre) => (
            <article key={offre.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{offre.nomProgramme}</h2>
                  <p className="mt-2 text-slate-400">{offre.lienAffilie}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {offre.statut}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <p>Taux : {offre.tauxCommission ?? '—'}%</p>
                <Link href={`/offres/${offre.id}`} className="font-medium text-indigo-300 hover:text-indigo-200">
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
