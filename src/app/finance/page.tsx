"use client"

import { useEffect, useState } from 'react'
import RevenueTable from '@/components/suivis/RevenueTable'

export default function FinancePageClient() {
  const [nicheId, setNicheId] = useState('')
  const [plateformeId, setPlateformeId] = useState('')
  const [offreId, setOffreId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [totals, setTotals] = useState<{ revenu?: number; clics?: number; conversions?: number } | null>(null)

  async function fetchData() {
    const params = new URLSearchParams()
    if (nicheId) params.set('nicheId', nicheId)
    if (plateformeId) params.set('plateformeId', plateformeId)
    if (offreId) params.set('offreId', offreId)
    if (start) params.set('start', start)
    if (end) params.set('end', end)

    const res = await fetch('/api/finances/summary?' + params.toString())
    const data = await res.json()
    setTotals(data.totals)
    setRows(
      data.rows.map((r: any) => ({ id: r.id, date: r.date, contenuTitle: r.contenu.titre, offreName: r.offre.nomProgramme, clics: r.clics, conversions: r.conversions, revenu: r.revenu }))
    )
  }

  useEffect(() => { fetchData() }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Dashboard financier</h1>
            <p className="mt-2 text-slate-400">Filtre par niche, plateforme, offre et période.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="grid gap-3 md:grid-cols-4">
            <input placeholder="NicheId" value={nicheId} onChange={(e) => setNicheId(e.target.value)} className="rounded-2xl bg-slate-950 px-3 py-2" />
            <input placeholder="PlateformeId" value={plateformeId} onChange={(e) => setPlateformeId(e.target.value)} className="rounded-2xl bg-slate-950 px-3 py-2" />
            <input placeholder="OffreId" value={offreId} onChange={(e) => setOffreId(e.target.value)} className="rounded-2xl bg-slate-950 px-3 py-2" />
            <div className="flex gap-2">
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-2xl bg-slate-950 px-3 py-2" />
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-2xl bg-slate-950 px-3 py-2" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={fetchData} className="rounded-full bg-indigo-600 px-4 py-2 text-white">Filtrer</button>
            <button onClick={() => { setNicheId(''); setPlateformeId(''); setOffreId(''); setStart(''); setEnd(''); }} className="rounded-full bg-slate-800 px-4 py-2 text-slate-200">Réinitialiser</button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm text-slate-400">Totaux</p>
            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-sm text-slate-400">Revenu</p>
                <p className="text-2xl font-semibold text-white">€{Math.round(totals?.revenu ?? 0)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Conversions</p>
                <p className="text-2xl font-semibold text-white">{totals?.conversions ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Clics</p>
                <p className="text-2xl font-semibold text-white">{totals?.clics ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <RevenueTable rows={rows} />
          </div>
        </div>
      </div>
    </main>
  )
}
