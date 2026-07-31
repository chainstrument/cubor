"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NewContenuPage() {
  const router = useRouter()
  const [niches, setNiches] = useState<Array<{ id: number; nom: string }>>([])
  const [plateformes, setPlateformes] = useState<Array<{ id: number; nom: string }>>([])
  const [offres, setOffres] = useState<Array<{ id: number; nomProgramme: string }>>([])
  const [titre, setTitre] = useState('')
  const [nicheId, setNicheId] = useState('')
  const [plateformeId, setPlateformeId] = useState('')
  const [offreIds, setOffreIds] = useState<number[]>([])
  const [statutPipeline, setStatutPipeline] = useState('Idée')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      const nichesRes = await fetch('/api/niches')
      const plateformesRes = await fetch('/api/plateformes')
      const offresRes = await fetch('/api/offres')
      const [nichesData, plateformesData, offresData] = await Promise.all([
        nichesRes.json(),
        plateformesRes.json(),
        offresRes.json(),
      ])
      setNiches(nichesData)
      setPlateformes(plateformesData)
      setOffres(offresData)
      if (nichesData.length > 0) setNicheId(String(nichesData[0].id))
      if (plateformesData.length > 0) setPlateformeId(String(plateformesData[0].id))
    }
    fetchData()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contenus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          nicheId: Number(nicheId),
          plateformeId: Number(plateformeId),
          statutPipeline,
          offreIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du contenu')
      }

      router.push('/contenus')
    } catch (error) {
      setError((error as Error).message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Nouveau contenu</h1>
          <p className="mt-3 text-slate-400">Crée un nouveau contenu et associe-le à une niche et une plateforme.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <label className="mb-2 block font-medium text-slate-200">Titre</label>
                <input
                  value={titre}
                  onChange={(event) => setTitre(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Titre du contenu"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Niche</label>
                <select
                  value={nicheId}
                  onChange={(event) => setNicheId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {niches.map((niche) => (
                    <option key={niche.id} value={niche.id}>
                      {niche.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Plateforme</label>
                <select
                  value={plateformeId}
                  onChange={(event) => setPlateformeId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {plateformes.map((plateforme) => (
                    <option key={plateforme.id} value={plateforme.id}>
                      {plateforme.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Offres associées</label>
                <select
                  multiple
                  value={offreIds.map(String)}
                  onChange={(event) =>
                    setOffreIds(Array.from(event.target.selectedOptions, (option) => Number(option.value)))
                  }
                  className="h-32 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {offres.map((offre) => (
                    <option key={offre.id} value={offre.id}>
                      {offre.nomProgramme}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-slate-500">Optionnel : associe une ou plusieurs offres au contenu.</p>
              </div>
              <div>
                <label className="mb-2 block font-medium text-slate-200">Statut pipeline</label>
                <select
                  value={statutPipeline}
                  onChange={(event) => setStatutPipeline(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option>Idée</option>
                  <option>À rechercher</option>
                  <option>Script/Brief</option>
                  <option>En production</option>
                  <option>Prêt à publier</option>
                  <option>Publié</option>
                </select>
              </div>
            </div>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting || niches.length === 0 || plateformes.length === 0}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Création...' : 'Créer'}
              </button>
              <Link href="/contenus" className="text-sm font-medium text-indigo-300 hover:text-indigo-200">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
