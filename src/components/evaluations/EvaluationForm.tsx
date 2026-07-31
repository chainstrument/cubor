"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Critere = { id: number; nom: string; poids?: number | null }

export default function EvaluationForm({ entityType, entityId }: { entityType: string; entityId: number }) {
  const router = useRouter()
  const [criteres, setCriteres] = useState<Critere[]>([])
  const [critereId, setCritereId] = useState<number | null>(null)
  const [score, setScore] = useState<number>(5)
  const [note, setNote] = useState('')
  const [source, setSource] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/criteres')
      .then((r) => r.json())
      .then((data) => {
        setCriteres(data)
        if (data.length > 0) setCritereId(data[0].id)
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!critereId) return
    setIsSubmitting(true)

    await fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idEntite: entityId, typeEntite: entityType, critereId, score, note, source }),
    })

    setIsSubmitting(false)
    setNote('')
    setSource('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="flex gap-2">
        <select className="rounded-2xl bg-slate-900 px-3 py-2" value={critereId ?? ''} onChange={(e) => setCritereId(Number(e.target.value))}>
          {criteres.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
        <input type="number" min={0} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-20 rounded-2xl bg-slate-900 px-3 py-2" />
        <button type="submit" disabled={isSubmitting} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          {isSubmitting ? 'Envoi...' : 'Noter'}
        </button>
      </div>
      <div>
        <input placeholder="Source (ex: revue interne)" value={source} onChange={(e) => setSource(e.target.value)} className="w-full rounded-2xl bg-slate-900 px-3 py-2" />
      </div>
      <div>
        <textarea placeholder="Note (optionnelle)" value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-2xl bg-slate-900 px-3 py-2" rows={3} />
      </div>
    </form>
  )
}
