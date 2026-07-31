'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ContenuOption = { id: number; titre: string }

export default function NewTachePage() {
  const router = useRouter()
  const [contenus, setContenus] = useState<ContenuOption[]>([])
  const [contenuId, setContenuId] = useState('')
  const [titre, setTitre] = useState('')
  const [typeValue, setTypeValue] = useState('Production')
  const [statut, setStatut] = useState('En cours')
  const [echeance, setEcheance] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadContenus() {
      const response = await fetch('/api/contenus')
      const data = await response.json()
      setContenus(data)
      if (data.length > 0) setContenuId(String(data[0].id))
    }

    loadContenus()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/taches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenuId: Number(contenuId),
          titre,
          type: typeValue,
          statut,
          echeance: echeance || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la tâche')
      }

      router.push('/taches')
    } catch (err) {
      setError((err as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Nouvelle tâche</h1>
          <p className="mt-3 text-slate-400">Définis une action à réaliser autour d’un contenu.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <label className="mb-2 block font-medium text-slate-200">Contenu</label>
                <select
                  value={contenuId}
                  onChange={(event) => setContenuId(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {contenus.map((contenu) => (
                    <option key={contenu.id} value={contenu.id}>
                      {contenu.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-200">Titre de la tâche</label>
                <input
                  value={titre}
                  onChange={(event) => setTitre(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Ex: Rédiger le brief" 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-slate-200">Type</label>
                  <select
                    value={typeValue}
                    onChange={(event) => setTypeValue(event.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  >
                    <option>Production</option>
                    <option>Recherche</option>
                    <option>Publication</option>
                    <option>Optimisation</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-medium text-slate-200">Statut</label>
                  <select
                    value={statut}
                    onChange={(event) => setStatut(event.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  >
                    <option>En cours</option>
                    <option>À faire</option>
                    <option>Terminé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-200">Échéance</label>
                <input
                  type="date"
                  value={echeance}
                  onChange={(event) => setEcheance(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting || contenus.length === 0}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <Link href="/taches" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
