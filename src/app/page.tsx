export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <h1 className="text-4xl font-semibold text-white">Cubor</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            MVP next.js pour la production de contenu multi-niches et multi-plateformes.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Prochaines étapes</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>• Initialiser Prisma + PostgreSQL</li>
              <li>• Créer les pages Niche, Contenu, Offre, Plateforme</li>
              <li>• Implémenter le Kanban et le CRUD</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Status</h2>
            <p className="mt-4 text-slate-300">Projet scaffoldé en Next.js, configuration initiale prête.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
