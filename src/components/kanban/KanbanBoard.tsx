"use client"

import { useEffect, useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableItem } from './SortableItem'
import KanbanColumn from './KanbanColumn'

const statuses = [
  'Idée',
  'À rechercher',
  'Script/Brief',
  'En production',
  'Prêt à publier',
  'Publié',
]

export type ContenuKanban = {
  id: number
  titre: string
  statutPipeline: string
  niche: { nom: string }
  plateforme: { nom: string }
}

export default function KanbanBoard() {
  const [contenus, setContenus] = useState<ContenuKanban[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    async function fetchContenus() {
      const response = await fetch('/api/contenus')
      const data = await response.json()
      setContenus(data)
      setLoading(false)
    }

    fetchContenus()
  }, [])

  function getItemsByStatus(status: string) {
    return contenus.filter((contenu) => contenu.statutPipeline === status)
  }

  async function updateStatut(id: number, statutPipeline: string) {
    await fetch(`/api/contenus/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statutPipeline }),
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activeIdNumber = Number(active.id)
    const activeContenu = contenus.find((contenu) => contenu.id === activeIdNumber)

    if (!activeContenu) return

    const overId = String(over.id)
    const newStatus = statuses.includes(overId)
      ? overId
      : contenus.find((contenu) => contenu.id === Number(overId))?.statutPipeline

    if (!newStatus || newStatus === activeContenu.statutPipeline) return

    const updatedList = contenus.map((contenu) =>
      contenu.id === activeIdNumber ? { ...contenu, statutPipeline: newStatus } : contenu,
    )

    setContenus(updatedList)
    updateStatut(activeIdNumber, newStatus)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Kanban contenu</h2>
        <p className="mt-2 text-slate-400">Glisse les cartes pour visualiser le pipeline.</p>
      </div>

      {loading ? (
        <p className="text-slate-300">Chargement...</p>
      ) : (
        <DndContext sensors={sensors} onDragStart={(event) => setActiveId(Number(event.active.id))} onDragEnd={handleDragEnd}>
          <div className="grid gap-4 overflow-x-auto md:grid-cols-2 xl:grid-cols-3">
            {statuses.map((status) => (
              <KanbanColumn key={status} id={status} title={status} count={getItemsByStatus(status).length}>
                <SortableContext items={getItemsByStatus(status).map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
                  {getItemsByStatus(status).map((contenu) => (
                    <SortableItem key={contenu.id} id={String(contenu.id)} contenu={contenu} />
                  ))}
                </SortableContext>
              </KanbanColumn>
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="rounded-3xl border border-slate-700 bg-slate-800 p-4 text-white shadow-xl">
                {contenus.find((contenu) => contenu.id === activeId)?.titre}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
