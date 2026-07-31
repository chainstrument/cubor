'use client'

import { useState } from 'react'
import Link from 'next/link'

type ContenuOffreRelation = {
  offre: { nomProgramme: string }
}

type ContenuWithRelations = {
  id: number
  titre: string
  statutPipeline: string
  updatedAt: Date
  datePublication: Date | null
  platformPostId: string | null
  niche: { nom: string }
  plateforme: { nom: string }
  contenuOffres: ContenuOffreRelation[]
}

type FilterOption = { value: string; label: string }

export default function ContenusList({ contenus }: { contenus: ContenuWithRelations[] }) {
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [selectedPlateforme, setSelectedPlateforme] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedOffre, setSelectedOffre] = useState('')

  const niches = Array.from(new Set(contenus.map((contenu) => contenu.niche.nom))).map((nom) => ({ value: nom, label: nom }))
  const plateformes = Array.from(new Set(contenus.map((contenu) => contenu.plateforme.nom))).map((nom) => ({ value: nom, label: nom }))
  const statuses = Array.from(new Set(contenus.map((contenu) => contenu.statutPipeline))).map((value) => ({ value, label: value }))
  const offres = Array.from(
    new Set(contenus.flatMap((contenu) => contenu.contenuOffres.map((relation) => relation.offre.nomProgramme))),
  ).map((nom) => ({ value: nom, label: nom }))

  const filteredContenus = contenus.filter((contenu) => {
    const matchesNiche = !selectedNiche || contenu.niche.nom === selectedNiche
    const matchesPlateforme = !selectedPlateforme || contenu.plateforme.nom === selectedPlateforme
    const matchesStatus = !selectedStatus || contenu.statutPipeline === selectedStatus
    const matchesOffre =
      !selectedOffre || contenu.contenuOffres.some((relation) => relation.offre.nomProgramme === selectedOffre)

    return matchesNiche && matchesPlateforme && matchesStatus && matchesOffre
  })

  async function handleDuplicate(id: number) {
    await fetch(`/api/contenus/${id}/duplicate`, { method: 'POST' })
    window.location.reload()
  }

  function FilterSelect({
    label,
    options,
    value,
    onChange,
  }: {
    label: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }) {
    return (
      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-slate-300">{label}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
        >
          <option value="">Tous</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setView('cards')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === 'cards' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Cartes
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tableau
            </button>
          </div>

          <Link
            href="/contenus/calendar"
            className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Voir le calendrier
          </Link>
        </div>

        <div className="grid gap-3 xl:grid-cols-4">
          <FilterSelect
            label="Niche"
            options={niches}
            value={selectedNiche}
            onChange={(value) => setSelectedNiche(value)}
          />
          <FilterSelect
            label="Plateforme"
            options={plateformes}
            value={selectedPlateforme}
            onChange={(value) => setSelectedPlateforme(value)}
          />
          <FilterSelect
            label="Statut"
            options={statuses}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
          />
          <FilterSelect
            label="Offre"
            options={offres}
            value={selectedOffre}
            onChange={(value) => setSelectedOffre(value)}
          />
        </div>
      </div>

      {view === 'cards' ? (
        <div className="space-y-4">
          {contenus.map((contenu) => (
            <article key={contenu.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-white">{contenu.titre}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-300">
                    <span className="rounded-full bg-slate-800 px-3 py-1">🧭 {contenu.niche.nom}</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1">📡 {contenu.plateforme.nom}</span>
                    {contenu.contenuOffres.length > 0 ? (
                      <span className="rounded-full bg-emerald-700 px-3 py-1 text-white">
                        {contenu.contenuOffres.map((relation) => relation.offre.nomProgramme).join(', ')}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2 text-right text-sm text-slate-400">
                  <p>{contenu.statutPipeline}</p>
                  <p>{contenu.datePublication ? `Publiée le ${new Date(contenu.datePublication).toISOString().slice(0, 10)}` : 'Date de publication non définie'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
                <p>Mis à jour {new Date(contenu.updatedAt).toISOString().slice(0, 10)}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/contenus/${contenu.id}`} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">
                    Voir
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(contenu.id)}
                    className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Dupliquer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-slate-950/20">
          <table className="min-w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80">
              <tr>
                <th className="px-4 py-4">Titre</th>
                <th className="px-4 py-4">Niche</th>
                <th className="px-4 py-4">Plateforme</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Publication</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contenus.map((contenu) => (
                <tr key={contenu.id} className="border-t border-slate-800 hover:bg-slate-950/80">
                  <td className="px-4 py-4 font-semibold text-white">{contenu.titre}</td>
                  <td className="px-4 py-4">{contenu.niche.nom}</td>
                  <td className="px-4 py-4">{contenu.plateforme.nom}</td>
                  <td className="px-4 py-4">{contenu.statutPipeline}</td>
                  <td className="px-4 py-4">{contenu.datePublication ? new Date(contenu.datePublication).toISOString().slice(0, 10) : '—'}</td>
                  <td className="px-4 py-4 space-x-2">
                    <Link href={`/contenus/${contenu.id}`} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800">
                      Voir
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(contenu.id)}
                      className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      Dupliquer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
