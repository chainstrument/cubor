import { prisma } from '@/lib/prisma'
import ContenusList from '@/components/contenus/ContenusList'

export const dynamic = 'force-dynamic'

async function getContenus() {
  return prisma.contenu.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      niche: true,
      plateforme: true,
      contenuOffres: { include: { offre: true } },
    },
  })
}

export default async function ContenusPage() {
  const contenus = await getContenus()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Contenus</h1>
            <p className="mt-2 text-slate-400">Gère tes contenus associés aux niches et plateformes.</p>
          </div>
        </div>
        <ContenusList contenus={contenus} />
      </div>
    </main>
  )
}
