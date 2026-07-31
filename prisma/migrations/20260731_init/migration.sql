-- CreateEnum
CREATE TYPE "EntiteType" AS ENUM ('niche', 'offre', 'contenu');

-- CreateTable
CREATE TABLE "Niche" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nom" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Niche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plateforme" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nom" TEXT NOT NULL,
    "formatDominant" TEXT,
    "frequenceIdeale" TEXT,

    CONSTRAINT "Plateforme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contenu" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "titre" TEXT NOT NULL,
    "statutPipeline" TEXT NOT NULL,
    "datePublication" TIMESTAMP(3),
    "lienAsset" TEXT,
    "platformPostId" TEXT,
    "nicheId" INTEGER NOT NULL,
    "plateformeId" INTEGER NOT NULL,

    CONSTRAINT "Contenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OffreAffiliation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomProgramme" TEXT NOT NULL,
    "tauxCommission" DOUBLE PRECISION,
    "lienAffilie" TEXT NOT NULL,
    "dureeCookie" INTEGER,
    "statut" TEXT NOT NULL,

    CONSTRAINT "OffreAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuiviRevenu" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contenuId" INTEGER NOT NULL,
    "offreId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clics" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "revenu" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "SuiviRevenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tache" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contenuId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "echeance" TIMESTAMP(3),

    CONSTRAINT "Tache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Critere" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" TEXT,
    "typeCible" TEXT,
    "poids" DOUBLE PRECISION,

    CONSTRAINT "Critere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "idEntite" INTEGER NOT NULL,
    "typeEntite" "EntiteType" NOT NULL,
    "critereId" INTEGER NOT NULL,
    "nicheId" INTEGER,
    "contenuId" INTEGER,
    "offreId" INTEGER,
    "score" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "source" TEXT,
    "dateEvaluation" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NicheOffre" (
    "nicheId" INTEGER NOT NULL,
    "offreId" INTEGER NOT NULL,

    CONSTRAINT "NicheOffre_pkey" PRIMARY KEY ("nicheId","offreId")
);

-- CreateTable
CREATE TABLE "ContenuOffre" (
    "contenuId" INTEGER NOT NULL,
    "offreId" INTEGER NOT NULL,

    CONSTRAINT "ContenuOffre_pkey" PRIMARY KEY ("contenuId","offreId")
);

-- AddForeignKey
ALTER TABLE "Contenu" ADD CONSTRAINT "Contenu_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contenu" ADD CONSTRAINT "Contenu_plateformeId_fkey" FOREIGN KEY ("plateformeId") REFERENCES "Plateforme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuiviRevenu" ADD CONSTRAINT "SuiviRevenu_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuiviRevenu" ADD CONSTRAINT "SuiviRevenu_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "OffreAffiliation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_critereId_fkey" FOREIGN KEY ("critereId") REFERENCES "Critere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "OffreAffiliation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NicheOffre" ADD CONSTRAINT "NicheOffre_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NicheOffre" ADD CONSTRAINT "NicheOffre_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "OffreAffiliation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenuOffre" ADD CONSTRAINT "ContenuOffre_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenuOffre" ADD CONSTRAINT "ContenuOffre_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "OffreAffiliation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
