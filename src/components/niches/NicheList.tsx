"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Niche = {
  id: number
  nom: string
  description: string | null
  statut: string
  updatedAt: Date
}

const statusOptions = ['Tout', 'Idée', 'En validation', 'Test actif', 'Confirmée', 'Abandonnée']

export default function NicheList({ niches }: { niches: Niche[] }) {
  const [selectedStatus, setSelectedStatus] = useState('Tout')

  const filteredNiches = useMemo(() => {
    if (selectedStatus === 'Tout') return niches
    return niches.filter((niche) => niche.statut === selectedStatus)
  }, [selectedStatus, niches])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Niches</h1>
            <p className="mt-2 text-slate-400">Gère tes niches éditoriales et leur statut.</p>
          </div>
          <Link href="/niches/new" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Nouvelle niche
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Filtrer par statut</p>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="mt-3 w-full max-w-xs rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-right text-slate-300">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Résultats</p>
            <p className="mt-2 text-2xl font-semibold text-white">{filteredNiches.length}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredNiches.map((niche) => (
            <article key={niche.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{niche.nom}</h2>
                  <p className="mt-2 text-slate-400">{niche.description ?? 'Aucune description'}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {niche.statut}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <p>Mis à jour {niche.updatedAt.toISOString().slice(0, 10)}</p>
                <Link href={`/niches/${niche.id}`} className="font-medium text-indigo-300 hover:text-indigo-200">
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
