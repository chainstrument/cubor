"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function NewPlateformePage() {
  const router = useRouter()
  const [nom, setNom] = useState('')
  const [formatDominant, setFormatDominant] = useState('')
  const [frequenceIdeale, setFrequenceIdeale] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/plateformes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, formatDominant, frequenceIdeale }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la plateforme')
      }

      router.push('/plateformes')
    } catch (error) {
      setError((error as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Nouvelle plateforme</h1>
          <p className="mt-3 text-slate-400">Ajoute une plateforme de publication et ses informations de base.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <label className="mb-2 block font-medium text-slate-200">Nom</label>
                <input
                  value={nom}
                  onChange={(event) => setNom(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Nom de la plateforme"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Format dominant</label>
                <input
                  value={formatDominant}
                  onChange={(event) => setFormatDominant(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="YouTube, Blog, TikTok..."
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Fréquence idéale</label>
                <input
                  value={frequenceIdeale}
                  onChange={(event) => setFrequenceIdeale(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="1 vidéo / semaine"
                />
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
              <Link href="/plateformes" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
