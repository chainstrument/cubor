import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getPlateforme(id: string) {
  return prisma.plateforme.findUnique({
    where: { id: Number(id) },
  })
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

          <div className="mt-8 flex gap-3">
            <Link href="/plateformes" className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              Retour aux plateformes
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
