"use client"

import { useMemo, useState } from 'react'

type Row = {
  id: number
  date: string
  contenuTitle: string
  offreName: string
  clics: number
  conversions: number
  revenu: number
}

export default function RevenueTable({ rows }: { rows: Row[] }) {
  const [sortBy, setSortBy] = useState<'date' | 'revenu' | 'conversions' | 'clics'>('date')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      let v = 0
      if (sortBy === 'date') v = new Date(a.date).getTime() - new Date(b.date).getTime()
      else if (sortBy === 'revenu') v = a.revenu - b.revenu
      else if (sortBy === 'conversions') v = a.conversions - b.conversions
      else v = a.clics - b.clics
      return dir === 'asc' ? v : -v
    })
    return copy
  }, [rows, sortBy, dir])

  function header(key: typeof sortBy, label: string) {
    return (
      <button onClick={() => (setSortBy(key), setDir(dir === 'asc' ? 'desc' : 'asc'))} className="font-medium">
        {label} {sortBy === key ? (dir === 'asc' ? '▲' : '▼') : ''}
      </button>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-slate-400">
            <th>{header('date', 'Date')}</th>
            <th>Titre</th>
            <th>Offre</th>
            <th>{header('clics', 'Clics')}</th>
            <th>{header('conversions', 'Conversions')}</th>
            <th className="text-right">{header('revenu', 'Revenu')}</th>
          </tr>
        </thead>
        <tbody className="mt-2">
          {sorted.map((r) => (
            <tr key={r.id} className="border-t border-slate-800">
              <td className="py-3 text-sm text-slate-200">{new Date(r.date).toISOString().slice(0, 10)}</td>
              <td className="py-3 text-sm text-slate-200">{r.contenuTitle}</td>
              <td className="py-3 text-sm text-slate-200">{r.offreName}</td>
              <td className="py-3 text-sm text-slate-200">{r.clics}</td>
              <td className="py-3 text-sm text-slate-200">{r.conversions}</td>
              <td className="py-3 text-sm text-slate-200 text-right">€{r.revenu.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
