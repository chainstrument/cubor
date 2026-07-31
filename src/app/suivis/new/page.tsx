'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ContenuOption = { id: number; titre: string }
type OffreOption = { id: number; nomProgramme: string }

export default function NewSuiviPage() {
  const router = useRouter()
  const [contenus, setContenus] = useState<ContenuOption[]>([])
  const [offres, setOffres] = useState<OffreOption[]>([])
  const [contenuId, setContenuId] = useState('')
  const [offreId, setOffreId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [clics, setClics] = useState('0')
  const [conversions, setConversions] = useState('0')
  const [revenu, setRevenu] = useState('0')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOptions() {
      const [contenusRes, offresRes] = await Promise.all([
        fetch('/api/contenus'),
        fetch('/api/offres'),
      ])
      const [contenusData, offresData] = await Promise.all([contenusRes.json(), offresRes.json()])
      setContenus(contenusData)
      setOffres(offresData)
      if (contenusData.length > 0) setContenuId(String(contenusData[0].id))
      if (offresData.length > 0) setOffreId(String(offresData[0].id))
    }

    loadOptions()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/suivis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenuId: Number(contenuId),
          offreId: Number(offreId),
          date,
          clics: Number(clics),
          conversions: Number(conversions),
          revenu: Number(revenu),
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du suivi')
      }

      router.push('/suivis')
    } catch (err) {
      setError((err as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Nouveau suivi de revenu</h1>
          <p className="mt-3 text-slate-400">Ajoute un événement de suivi pour un contenu et une offre.</p>

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
                <label className="mb-2 block font-medium text-slate-200">Offre</label>
                <select
                  value={offreId}
                  onChange={(event) => setOffreId(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {offres.map((offre) => (
                    <option key={offre.id} value={offre.id}>
                      {offre.nomProgramme}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-200">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block font-medium text-slate-200">Clics</label>
                  <input
                    type="number"
                    min="0"
                    value={clics}
                    onChange={(event) => setClics(event.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-slate-200">Conversions</label>
                  <input
                    type="number"
                    min="0"
                    value={conversions}
                    onChange={(event) => setConversions(event.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-medium text-slate-200">Revenu (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={revenu}
                    onChange={(event) => setRevenu(event.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting || contenus.length === 0 || offres.length === 0}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <Link href="/suivis" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
