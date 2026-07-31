import Link from 'next/link'

export default function TopNav() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-4 font-medium text-slate-100">
          <Link href="/" className="text-lg font-semibold text-white">
            Cubor
          </Link>
          <Link href="/niches" className="hover:text-indigo-300">
            Niches
          </Link>
          <Link href="/contenus" className="hover:text-indigo-300">
            Contenus
          </Link>
          <Link href="/kanban" className="hover:text-indigo-300">
            Kanban
          </Link>
          <Link href="/offres" className="hover:text-indigo-300">
            Offres
          </Link>
          <Link href="/suivis" className="hover:text-indigo-300">
            Suivis
          </Link>
          <Link href="/taches" className="hover:text-indigo-300">
            Tâches
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/niches/new" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Nouvelle niche
          </Link>
          <Link href="/offres/new" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Nouvelle offre
          </Link>
          <Link href="/taches/new" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Nouvelle tâche
          </Link>
        </div>
      </div>
    </header>
  )
}
