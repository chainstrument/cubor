"use client"

import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'

export default function KanbanColumn({
  id,
  title,
  count,
  children,
}: {
  id: string
  title: string
  count: number
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <section
      ref={setNodeRef}
      className={`rounded-3xl border p-4 transition ${isOver ? 'border-indigo-400 bg-slate-800/90' : 'border-slate-800 bg-slate-900/80'}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
