import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getContenus() {
  return prisma.contenu.findMany({
    orderBy: { datePublication: 'asc' },
    include: { niche: true, plateforme: true },
  })
}

export default async function CalendarPage() {
  const contenus = await getContenus()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">Calendrier des contenus</h1>
              <p className="mt-2 text-slate-400">Consulte les dates de publication prévues et réelles.</p>
            </div>
            <Link href="/contenus" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
              Retour à la liste
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {contenus.map((contenu) => (
            <article key={contenu.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{contenu.titre}</h2>
                  <p className="mt-2 text-sm text-slate-400">{contenu.niche.nom} • {contenu.plateforme.nom}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {contenu.datePublication ? new Date(contenu.datePublication).toISOString().slice(0, 10) : 'À planifier'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
