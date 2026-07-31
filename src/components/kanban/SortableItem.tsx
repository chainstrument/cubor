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

  const isStalled =
    contenu.statutPipeline !== 'Publié' &&
    Date.now() - new Date(contenu.updatedAt).getTime() > 14 * 24 * 60 * 60 * 1000

  return (
    <div ref={setNodeRef} style={style} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-xl shadow-slate-950/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-lg font-semibold text-white">{contenu.titre}</h4>
          <p className="mt-2 text-sm text-slate-400">{contenu.niche.nom} • {contenu.plateforme.nom}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Mis à jour {new Date(contenu.updatedAt).toISOString().slice(0, 10)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            {contenu.statutPipeline}
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

      {isStalled ? (
        <p className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          En stagnation : pas de mise à jour depuis plus de 14 jours.
        </p>
      ) : null}
    </div>
  )
}
