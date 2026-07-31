"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewCritereForm() {
  const router = useRouter()
  const [nom, setNom] = useState('')
  const [categorie, setCategorie] = useState('')
  const [typeCible, setTypeCible] = useState('niche')
  const [poids, setPoids] = useState<number | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    await fetch('/api/criteres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, categorie, typeCible, poids: poids === '' ? undefined : Number(poids) }),
    })
    setIsSubmitting(false)
    setNom('')
    setCategorie('')
    setPoids('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input required placeholder="Nom du critère" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-2xl bg-slate-900 px-3 py-2" />
      </div>
      <div>
        <input placeholder="Catégorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} className="w-full rounded-2xl bg-slate-900 px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <select value={typeCible} onChange={(e) => setTypeCible(e.target.value)} className="rounded-2xl bg-slate-900 px-3 py-2">
          <option value="niche">Niche</option>
          <option value="offre">Offre</option>
          <option value="contenu">Contenu</option>
        </select>
        <input type="number" placeholder="Poids" value={poids as any} onChange={(e) => setPoids(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-2xl bg-slate-900 px-3 py-2 w-28" />
        <button type="submit" disabled={isSubmitting} className="rounded-full bg-indigo-600 px-4 py-2 text-white">{isSubmitting ? 'Création...' : 'Créer'}</button>
      </div>
    </form>
  )
}
