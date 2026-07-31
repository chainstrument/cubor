# Content Engine — README de développement

## 1. Résumé du projet

Application de gestion d'un système de production de contenu multi-niches et multi-plateformes, monétisé par affiliation (puis produits propres à terme). L'app centralise :

- la validation de niches éditoriales sur des critères objectifs
- la qualification d'offres d'affiliation
- un pipeline de production de contenu (kanban)
- le suivi de performance et de revenus
- des modules de consolidation (résilience, playbook, automatisation) une fois le système rodé

**Usage :** solo, un seul utilisateur au départ (pas de gestion multi-comptes à prévoir en V0).

**Philosophie de build :** partir d'un noyau minimal (Niche / Contenu / Offre + pipeline kanban), le faire tourner manuellement sur un cycle complet, puis enrichir avec les modules périphériques. Ne pas construire tous les modules en parallèle dès le départ — voir l'ordre de priorité des epics ci-dessous.

---

## 2. Modèle de données (résumé)

Entités principales et leurs relations (voir MCD en annexe si disponible) :

- **Niche** — sujet éditorial (`id_niche`, `nom`, `statut`, `description`)
- **Plateforme** — canal de diffusion (`id_plateforme`, `nom`, `format_dominant`, `frequence_ideale`)
- **Contenu** — entité pivot (`id_contenu`, `id_niche` FK, `id_plateforme` FK, `titre`, `statut_pipeline`, `date_publication`, `lien_asset`, `platform_post_id`)
- **OffreAffiliation** — programme d'affiliation (`id_offre`, `nom_programme`, `taux_commission`, `lien_affilie`, `duree_cookie`, `statut`)
- **SuiviRevenu** — relevés de performance dans le temps (`id_suivi`, `id_contenu` FK, `id_offre` FK, `date`, `clics`, `conversions`, `revenu`)
- **Tache** — actions de production liées à un contenu (`id_tache`, `id_contenu` FK, `titre`, `type`, `statut`, `echeance`)
- **Critere** — catalogue de critères de scoring réutilisables (`id_critere`, `nom`, `categorie`, `type_cible`, `poids`)
- **Evaluation** — notation polymorphe d'une entité sur un critère, historisée (`id_evaluation`, `id_entite`, `type_entite`, `id_critere`, `score`, `note`, `source`, `date_evaluation`)

Relations many-to-many : `Contenu ↔ OffreAffiliation`, `Niche ↔ OffreAffiliation`.

---

## 3. Ordre de priorité des epics

| Priorité | Epic |
|---|---|
| P0 | Setup & modèle de données core |
| P0 | Module Contenu (pipeline kanban) |
| P0 | Module Niches |
| P0 | Module Offres d'affiliation |
| P1 | Dashboard / vue d'ensemble |
| P1 | Module Plateformes (structure, sans API externe) |
| P1 | Module Critères & évaluations |
| P1 | Module Revenus & performance |
| P2 | Intégrations API (sync automatique des stats) |
| P2 | Module Consolidation (résilience / playbook / automatisation) |
| P2 | Module Paramètres / Fondations |

**Règle :** ne pas commencer un epic P1 avant qu'au moins un cycle complet (créer une niche → une offre → un contenu → le faire progresser dans le pipeline → le publier) fonctionne de bout en bout avec les epics P0.

---

## Epic 0 — Setup & modèle de données core

*Objectif : poser la base technique et le schéma de données.*

- [ ] Initialiser le projet (stack au choix du dev), config environnement, linting
- [ ] Mettre en place la base de données et le schéma des entités core : `Niche`, `Plateforme`, `Contenu`, `OffreAffiliation`, `SuiviRevenu`, `Tache`
- [ ] Mettre en place les migrations (outil de migration versionné)
- [ ] Endpoints CRUD de base pour chaque entité core (API REST ou équivalent)
- [ ] Seed de données de test (2-3 niches, 2 plateformes, quelques contenus factices) pour développer les vues sans attendre de vraies données

---

## Epic 1 — Module Contenu (pipeline kanban)

*Objectif : la page principale, usage quotidien. Priorité maximale.*

- [ ] Vue Kanban avec colonnes = `statut_pipeline` (`Idée`, `À rechercher`, `Script/Brief`, `En production`, `Prêt à publier`, `Publié`)
- [ ] Drag & drop pour changer le statut d'une carte
- [ ] Carte kanban : titre, badge niche (couleur), icône plateforme, indicateur visuel si le contenu est dans le même statut depuis plus de X jours (seuil configurable)
- [ ] Fiche détail Contenu : champs éditoriaux (titre, angle, script/brief en texte long, lien asset), offre(s) liée(s), plateforme(s) liée(s), niche liée
- [ ] Action "dupliquer un contenu" (pour décliner sur une autre plateforme, copie les champs éditoriaux, reset le statut à `Idée`)
- [ ] Vue Calendrier (date de publication prévue/réelle par contenu)
- [ ] Vue Liste/tableau avec filtres croisés (niche, plateforme, statut, offre liée)
- [ ] Champ `platform_post_id` sur la fiche, renseignable après publication (préparation pour l'intégration API future)

---

## Epic 2 — Module Niches

- [ ] Liste des niches en cartes ou tableau, avec statut (`Idée`, `En validation`, `Test actif`, `Confirmée`, `Abandonnée`)
- [ ] Filtrage par statut
- [ ] Fiche détail Niche : infos générales, historique des changements de statut (avec date + raison en cas d'abandon)
- [ ] Affichage résumé des offres liées et des contenus liés (lecture seule, liens vers les modules respectifs)
- [ ] Emplacement pour afficher le scoring de validation une fois le module Critères & évaluations disponible (prévoir l'UI même si les données arrivent plus tard)

---

## Epic 3 — Module Offres d'affiliation

- [ ] Liste des offres en tableau : programme, niche(s) liée(s), taux de commission, statut actif/inactif
- [ ] Fiche détail Offre : infos programme (marchand, réseau, lien affilié, durée du cookie), niches compatibles, liste des contenus utilisant cette offre
- [ ] Relation many-to-many Offre ↔ Niche et Offre ↔ Contenu
- [ ] Vue/alerte : niches ayant moins de 3 offres qualifiées liées

---

## Epic 4 — Dashboard / vue d'ensemble

*Dépend des epics 1-3 pour avoir des données à afficher.*

- [ ] KPIs agrégés en tête de page (nb contenus publiés sur 7/30 jours, nb niches actives, revenu du mois si dispo)
- [ ] Bloc alertes (contenus bloqués en pipeline, niches sous-couvertes en offres)
- [ ] Bloc top performers récents (nécessite des données de `SuiviRevenu`, peut rester vide/placeholder tant que l'epic 7 n'est pas fait)
- [ ] Raccourcis de création rapide (nouveau contenu, nouvelle niche, nouvelle offre)

---

## Epic 5 — Module Plateformes (structure de base)

*Sans intégration API à ce stade — juste la structure.*

- [ ] Liste des plateformes (CRUD simple)
- [ ] Fiche détail Plateforme : format dominant, fréquence idéale, statut de connexion (placeholder "non connecté" par défaut)
- [ ] Stats agrégées basiques (nb contenus publiés sur cette plateforme, calcul simple sans API externe)

---

## Epic 6 — Module Critères & évaluations

- [ ] Schéma de données `Critere` et `Evaluation` (polymorphe : `id_entite` + `type_entite`)
- [ ] Interface de gestion du catalogue de critères (CRUD : nom, catégorie, type cible, poids optionnel)
- [ ] Interface de notation : depuis une fiche Niche (ou Offre), pouvoir ajouter une évaluation sur un critère existant (score + note + source)
- [ ] Historique des évaluations consultable par entité (ne pas écraser les anciennes évaluations, empiler dans le temps)
- [ ] Calcul d'un score composite optionnel si des poids sont définis sur les critères
- [ ] Brancher l'affichage du scoring sur la fiche Niche (epic 2)

---

## Epic 7 — Module Revenus & performance

- [ ] Schéma et CRUD `SuiviRevenu`, saisie manuelle possible (date, contenu, offre, clics, conversions, revenu)
- [ ] Dashboard financier filtrable par niche / plateforme / offre / période
- [ ] Table brute des relevés, triable
- [ ] Export CSV
- [ ] Brancher le bloc "top performers" du Dashboard (epic 4) sur ces données réelles

---

## Epic 8 — Intégrations API (sync automatique) — P2

*À n'attaquer qu'une fois les epics P0/P1 stables et utilisés en réel sur au moins une niche.*

- [ ] Auth OAuth pour YouTube Data API / YouTube Analytics API
- [ ] Job planifié de synchronisation des stats YouTube vers `SuiviRevenu` (via `platform_post_id`)
- [ ] Gestion des tokens (refresh, expiration, statut affiché dans le module Plateformes)
- [ ] Extension à d'autres plateformes selon accès obtenus (TikTok, Meta/Instagram, Pinterest) — à traiter en issues séparées, accès et contraintes différents par plateforme
- [ ] Logs de synchronisation (dernière sync, erreurs) visibles sur la fiche Plateforme

---

## Epic 9 — Module Consolidation — P2

- [ ] Checklist de résilience (items configurables ou hardcodés au départ : diversification vérifiée, sauvegardes faites, veille CGU à jour)
- [ ] Espace Playbook : notes en texte libre par niche (ce qui a marché, benchmarks, post-mortem) — simple champ texte long lié à une niche, pas besoin de structuration complexe en V1
- [ ] Journal des automatisations actives (liste des jobs/alertes configurés avec leur statut)

---

## Epic 10 — Module Paramètres / Fondations — P2

- [ ] Page Fondations : checklist statique (statut juridique, mentions légales rédigées) + zone de liens/docs de référence
- [ ] Gestion des connexions API (vue centralisée des tokens actifs, par plateforme et par réseau d'affiliation)
- [ ] Préférences générales (unités, notifications)

---

## 4. Notes d'architecture pour l'agent de dev

- Le champ `type_entite` sur `Evaluation` doit rester une valeur contrainte (enum : `niche`, `offre`, `contenu`) pour éviter les erreurs de référence — pas de texte libre.
- Prévoir dès le schéma initial la relation many-to-many `Contenu ↔ OffreAffiliation` (table de jointure), même si l'UI ne l'exploite pleinement qu'à l'epic 3.
- Le point d'architecture non tranché : un contenu décliné sur plusieurs plateformes est-il une seule fiche avec plusieurs plateformes liées, ou plusieurs fiches liées à un "contenu pivot" parent ? Choix à faire avant l'epic 1 si possible, car il impacte le schéma de `Contenu`. Recommandation : si le pipeline de production diffère significativement selon la plateforme (ex: script YouTube long vs script TikTok court), privilégier la seconde option.
- Pas de gestion multi-utilisateurs en V0 — ne pas sur-architecturer les permissions dès le départ.