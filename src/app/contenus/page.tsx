import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getContenus() {
  return prisma.contenu.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })
}

export default async function ContenusPage() {
  const contenus = await getContenus()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Contenus</h1>
            <p className="mt-2 text-slate-400">Gère tes contenus associés aux niches et plateformes.</p>
          </div>
          <Link href="/contenus/new" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Nouveau contenu
          </Link>
        </div>

        <div className="space-y-4">
          {contenus.map((contenu) => (
            <article key={contenu.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{contenu.titre}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                    <span className="rounded-full bg-slate-800 px-3 py-1">Niche : {contenu.niche.nom}</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1">Plateforme : {contenu.plateforme.nom}</span>
                    {contenu.contenuOffres.length > 0 ? (
                      <span className="rounded-full bg-emerald-700 px-3 py-1 text-white">
                        Offre : {contenu.contenuOffres.map((relation) => relation.offre.nomProgramme).join(', ')}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {contenu.statutPipeline}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <p>Mis à jour {contenu.updatedAt.toISOString().slice(0, 10)}</p>
                <Link href={`/contenus/${contenu.id}`} className="font-medium text-indigo-300 hover:text-indigo-200">
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
