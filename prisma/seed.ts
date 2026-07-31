import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const niche1 = await prisma.niche.create({
    data: { nom: 'Marketing B2B', statut: 'Confirmée', description: 'Contenu pour audiences professionnelles.' },
  })

  const niche2 = await prisma.niche.create({
    data: { nom: 'Développement personnel', statut: 'Test actif', description: 'Conseils et routines pour l’efficacité.' },
  })

  const plateforme1 = await prisma.plateforme.create({
    data: { nom: 'YouTube', formatDominant: 'Vidéo', frequenceIdeale: '2x/semaine' },
  })

  const plateforme2 = await prisma.plateforme.create({
    data: { nom: 'Blog', formatDominant: 'Article', frequenceIdeale: '1x/semaine' },
  })

  const offre1 = await prisma.offreAffiliation.create({
    data: {
      nomProgramme: 'Programme partenaires SaaS',
      tauxCommission: 10,
      lienAffilie: 'https://affiliate.example.com/saas',
      dureeCookie: 30,
      statut: 'Actif',
    },
  })

  const offre2 = await prisma.offreAffiliation.create({
    data: {
      nomProgramme: 'Programme formation en ligne',
      tauxCommission: 15,
      lienAffilie: 'https://affiliate.example.com/course',
      dureeCookie: 45,
      statut: 'Actif',
    },
  })

  const contenu1 = await prisma.contenu.create({
    data: {
      titre: 'Comment structurer une stratégie SaaS B2B',
      statutPipeline: 'Idée',
      nicheId: niche1.id,
      plateformeId: plateforme1.id,
      contenuOffres: {
        create: [{ offre: { connect: { id: offre1.id } } }],
      },
    },
  })

  const contenu2 = await prisma.contenu.create({
    data: {
      titre: '5 habitudes pour rester productif chaque jour',
      statutPipeline: 'À rechercher',
      nicheId: niche2.id,
      plateformeId: plateforme2.id,
      contenuOffres: {
        create: [{ offre: { connect: { id: offre2.id } } }],
      },
    },
  })

  await prisma.suiviRevenu.create({
    data: {
      contenuId: contenu1.id,
      offreId: offre1.id,
      date: new Date(),
      clics: 12,
      conversions: 2,
      revenu: 250,
    },
  })

  await prisma.tache.create({
    data: {
      contenuId: contenu1.id,
      titre: 'Rédiger le script de la vidéo',
      type: 'Production',
      statut: 'En cours',
      echeance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
