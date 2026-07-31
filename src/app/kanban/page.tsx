import KanbanBoard from '@/components/kanban/KanbanBoard'

export default function KanbanPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-4xl font-semibold text-white">Kanban contenu</h1>
          <p className="mt-2 text-slate-400">Visualise et organise ton pipeline de production.</p>
        </div>
        <KanbanBoard />
      </div>
    </main>
  )
}
