"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function NewNichePage() {
  const router = useRouter()
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState('Idée')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, description, statut }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la niche')
      }

      router.push('/niches')
    } catch (error) {
      setError((error as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Nouvelle niche</h1>
          <p className="mt-3 text-slate-400">Crée une nouvelle niche éditoriale pour structurer ton contenu.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <label className="mb-2 block font-medium text-slate-200">Nom</label>
                <input
                  value={nom}
                  onChange={(event) => setNom(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Nom de la niche"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Description de la niche"
                  rows={5}
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Statut</label>
                <select
                  value={statut}
                  onChange={(event) => setStatut(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option>Idée</option>
                  <option>En validation</option>
                  <option>Test actif</option>
                  <option>Confirmée</option>
                  <option>Abandonnée</option>
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
              <Link href="/niches" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
