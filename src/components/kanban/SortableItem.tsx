"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ContenuKanban } from './KanbanBoard'

export function SortableItem({ id, contenu }: { id: string; contenu: ContenuKanban }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-xl shadow-slate-950/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-white">{contenu.titre}</h4>
          <p className="mt-2 text-sm text-slate-400">{contenu.niche.nom} • {contenu.plateforme.nom}</p>
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300"
        >
          glisser
        </button>
      </div>
    </div>
  )
}
