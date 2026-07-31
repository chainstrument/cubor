import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import EvaluationForm from '@/components/evaluations/EvaluationForm'

export const dynamic = 'force-dynamic'

async function getNiche(id: string) {
  const niche = await prisma.niche.findUnique({
    where: { id: Number(id) },
    include: {
      contenus: { orderBy: { updatedAt: 'desc' } },
      offres: { include: { offre: true } },
      evaluations: { include: { critere: true }, orderBy: { dateEvaluation: 'desc' } },
    },
  })

  if (!niche) return null

  const evals = niche.evaluations ?? []
  let composite = null
  if (evals.length > 0) {
    const withPoids = evals.filter((e) => e.critere?.poids)
    const weighted = withPoids.reduce((acc, e) => acc + (e.score * (e.critere?.poids ?? 0)), 0)
    const totalPoids = withPoids.reduce((acc, e) => acc + (e.critere?.poids ?? 0), 0)
    if (totalPoids > 0) composite = weighted / totalPoids
    else composite = evals.reduce((acc, e) => acc + e.score, 0) / evals.length
  }

  return { ...niche, compositeScore: composite }
}

export default async function NichePage({ params }: { params: { id: string } }) {
  const niche = await getNiche(params.id)
  if (!niche) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Niche introuvable</h1>
          <p className="mt-4 text-slate-400">La niche demandée n'existe pas ou a été supprimée.</p>
          <Link href="/niches" className="mt-6 inline-block rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
            Retour aux niches
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">{niche.nom}</h1>
              <p className="mt-2 text-slate-400">{niche.description ?? 'Aucune description fournie.'}</p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              {niche.statut}
            </span>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Créé</p>
              <p className="mt-2 text-lg font-semibold text-white">{niche.createdAt.toISOString().slice(0, 10)}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Dernière mise à jour</p>
              <p className="mt-2 text-lg font-semibold text-white">{niche.updatedAt.toISOString().slice(0, 10)}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Contenus liés</p>
              <p className="mt-2 text-lg font-semibold text-white">{niche.contenus.length}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold text-white">Offres liées</h2>
              {niche.offres.length > 0 ? (
                <div className="grid gap-3">
                  {niche.offres.map((relation) => (
                    <Link
                      key={`${relation.nicheId}-${relation.offreId}`}
                      href={`/offres/${relation.offre.id}`}
                      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-indigo-500"
                    >
                      <p className="font-semibold text-white">{relation.offre.nomProgramme}</p>
                      <p className="mt-1 text-sm text-slate-400">Statut : {relation.offre.statut}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">Aucune offre liée pour cette niche.</p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-2xl font-semibold text-white">Scoring de validation</h2>
              <p className="mt-2 text-lg font-semibold text-white">{niche.compositeScore ? `${niche.compositeScore.toFixed(2)} / 10` : '—'}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Contenus associés</h2>
            {niche.contenus.length > 0 ? (
              <div className="mt-4 grid gap-4">
                {niche.contenus.map((contenu) => (
                  <Link
                    key={contenu.id}
                    href={`/contenus/${contenu.id}`}
                    className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-indigo-500"
                  >
                    <p className="font-semibold text-white">{contenu.titre}</p>
                    <p className="mt-1 text-sm text-slate-400">Statut pipeline : {contenu.statutPipeline}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">Aucun contenu associé pour cette niche.</p>
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Évaluations & Historique</h2>
            <div className="mt-4">
              <p className="text-sm text-slate-400">Ajouter une évaluation</p>
              <div className="mt-3">
                <EvaluationForm entityType="niche" entityId={niche.id} />
              </div>

              <div className="mt-6">
                <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Historique</p>
                {niche.evaluations && niche.evaluations.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {niche.evaluations.map((ev) => (
                      <li key={ev.id} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">{ev.critere?.nom ?? 'Critère'}</p>
                            <p className="text-sm text-slate-400">{ev.note ?? ''}</p>
                          </div>
                          <div className="text-slate-300">{ev.score} • {new Date(ev.dateEvaluation).toISOString().slice(0,10)}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-slate-400">Aucune évaluation.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link href="/niches" className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              Retour aux niches
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
