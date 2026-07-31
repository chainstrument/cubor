"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function NewOffrePage() {
  const router = useRouter()
  const [nomProgramme, setNomProgramme] = useState('')
  const [tauxCommission, setTauxCommission] = useState('')
  const [lienAffilie, setLienAffilie] = useState('')
  const [dureeCookie, setDureeCookie] = useState('')
  const [statut, setStatut] = useState('Actif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/offres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomProgramme,
          tauxCommission: tauxCommission ? Number(tauxCommission) : undefined,
          lienAffilie,
          dureeCookie: dureeCookie ? Number(dureeCookie) : undefined,
          statut,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l’offre')
      }

      router.push('/offres')
    } catch (error) {
      setError((error as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Nouvelle offre d’affiliation</h1>
          <p className="mt-3 text-slate-400">Ajoute un programme d’affiliation lié aux contenus et niches.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <label className="mb-2 block font-medium text-slate-200">Nom du programme</label>
                <input
                  value={nomProgramme}
                  onChange={(event) => setNomProgramme(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Nom du programme d’affiliation"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Taux de commission</label>
                <input
                  value={tauxCommission}
                  onChange={(event) => setTauxCommission(event.target.value)}
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Ex: 5.5"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Lien affilié</label>
                <input
                  value={lienAffilie}
                  onChange={(event) => setLienAffilie(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Durée cookie (jours)</label>
                <input
                  value={dureeCookie}
                  onChange={(event) => setDureeCookie(event.target.value)}
                  type="number"
                  min="0"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Ex: 30"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Statut</label>
                <select
                  value={statut}
                  onChange={(event) => setStatut(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option>Actif</option>
                  <option>Inactif</option>
                </select>
              </div>
            </div>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Création...' : 'Créer'}
              </button>
              <Link href="/offres" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
