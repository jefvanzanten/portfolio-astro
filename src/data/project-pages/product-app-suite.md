---
name: "Product App Suite"
slug: "product-app-suite"
url: "https://github.com/jefvanzanten/product-app-suite"
languages: ["TypeScript", "CSS", "HTML"]
libraries:
  [
    "React",
    "React Router",
    "Hono",
    "Drizzle ORM",
    "SQLite",
    "Better Auth",
    "Zod",
    "TanStack Query",
  ]
images: []
coverUrl: "/covers/portfolio_cover.png"
thumbUrl: "/thumbs/portfolio_thumb.png"
category: "Fullstack"
lastUpdated: "2026-08-24"
highlighted: true
---

# Beschrijving

De Product App Suite is een fullstack monorepo met vier afzonderlijke webapplicaties en één gedeelde backend:

- een calorie-tracker;
- een inventarisatie-app;
- een recepten-app;
- een beheeromgeving voor producten en opbergplaatsen;
- een centrale API die de applicaties van data, authenticatie en domeinlogica voorziet.

De applicaties gebruiken dezelfde productcatalogus en gebruikersaccounts, maar hebben ieder een eigen verantwoordelijkheid en gebruikersinterface. Ze kunnen onafhankelijk worden gebouwd en uitgerold, terwijl gedeelde contracten, authenticatiecode en generieke frontendfunctionaliteit centraal worden beheerd.

# Probleem en doel

De Product App Suite is ontstaan vanuit het idee om verschillende productgerelateerde applicaties binnen één samenhangend systeem te ontwikkelen. Producten spelen in iedere applicatie een andere rol: ze kunnen worden beheerd in de productcatalogus, als fysieke voorraad worden geregistreerd, als ingrediënt in een recept worden gebruikt of als consumptie in de calorie-tracker worden gelogd.

Wanneer deze applicaties als volledig losse projecten zouden worden gebouwd, zouden productmodellen, validatieregels en API-integraties op meerdere plaatsen opnieuw moeten worden geïmplementeerd. Daarom koos ik voor een gedeelde codebase waarin de applicaties dezelfde domeinmodellen en databronnen gebruiken, zonder dat zij één grote frontendapplicatie worden.

Een tweede doel was het verdiepen van mijn backendkennis. Mijn eerdere backendprojecten waren relatief klein. Met dit project wilde ik ervaring opdoen met een grotere domeinscope, relationele datamodellen, authenticatie, autorisatie, transacties en meerdere clients die van dezelfde API gebruikmaken.

Voor de belangrijkste onderdelen heb ik functionele specificaties, UI-specificaties, domeinregels, ERD's en endpointcontracten opgesteld. Deze documenten worden gedurende de ontwikkeling bijgewerkt en functioneren als centrale referentie voor zowel implementatie als toekomstige wijzigingen.

# Mijn rol

Ik ben de enige ontwikkelaar van de Product App Suite. Daardoor ben ik verantwoordelijk voor het volledige ontwikkelproces:

- het uitwerken van requirements en domeinregels;
- het ontwerpen van de frontend- en backendarchitectuur;
- het modelleren van de database;
- het ontwerpen en implementeren van API-contracten;
- het ontwikkelen van de vier frontendapplicaties;
- authenticatie en autorisatie;
- geautomatiseerde tests;
- Docker-builds en deploymentconfiguratie;
- het bewaken en verder ontwikkelen van de gedeelde codebase.

# Applicaties

## Calorie Tracker

De Calorie Tracker laat een gebruiker consumpties registreren en calorie- en macrototalen bekijken. Gebruikers kunnen per datum hun logboek openen, producten of gerechten zoeken en bestaande logs bekijken en aanpassen.

De applicatie ondersteunt onder andere:

- dagelijkse calorie- en macrostatistieken;
- persoonlijke voedingsdoelen;
- een consumptielogboek met datum- en typefilters;
- het toevoegen en bewerken van consumpties;
- het loggen van concrete producten in verschillende eenheden;
- het loggen van recepten als gerecht;
- historische logs waarvan de relevante receptversie behouden blijft.

Iedere gebruiker heeft uitsluitend toegang tot zijn eigen logs en voedingsdoelen.

## Inventory

Inventory beheert fysieke voorraad op basis van producten uit de centrale productcatalogus. Iedere gekochte verpakking wordt opgeslagen als een afzonderlijk voorraaditem met een eigen locatie, houdbaarheidsdatum en resterende inhoud.

De applicatie ondersteunt onder andere:

- voorraad bekijken en filteren;
- identieke volledige verpakkingen gegroepeerd presenteren;
- nieuwe voorraad toevoegen;
- resterende inhoud aanpassen;
- houdbaarheidsdatums beheren;
- voorraad tussen opbergplaatsen verplaatsen;
- lage voorraad en de inhoud van geopende verpakkingen inzichtelijk maken.

Hierbij wordt onderscheid gemaakt tussen een catalogusproduct en een fysiek exemplaar daarvan. Hierdoor kunnen meerdere geopende verpakkingen van hetzelfde product onafhankelijk van elkaar worden beheerd.

## Recepten

De recepten-app is verantwoordelijk voor het aanmaken, bekijken en beheren van recepten. Recepten kunnen privé blijven of openbaar worden gedeeld.

De applicatie bevat onder andere:

- een publieke receptenlijst;
- zoeken en filteren op recepten;
- persoonlijke en openbare recepten;
- receptdetails met ingrediënten en bereidingsinstructies;
- recepten aanmaken en bewerken;
- recepten archiveren en herstellen;
- versiebeheer voor ingrediënten, hoeveelheden en instructies.

Receptinhoud wordt geversioneerd. Wanneer een recept wordt aangepast, blijven eerdere versies beschikbaar voor consumpties die al met die versie zijn gelogd. Hiermee blijven historische calorie- en macroberekeningen reproduceerbaar.

## Product Management Admin

Product Management Admin is een afzonderlijke beheerapplicatie voor gebruikers met de beheerdersrol.

De beheeromgeving bestaat uit twee hoofdonderdelen:

- de productcatalogus;
- het beheer van opbergplaatsen.

Binnen de productcatalogus kunnen beheerders producten zoeken, browsen, aanmaken en aanpassen. Een product bestaat uit gedeelde samenstellingsgegevens, zoals naam, merk en categorie, en een concrete uitvoering of verpakking die door de andere applicaties kan worden geselecteerd.

Opbergplaatsen worden als een hiërarchische boom beheerd. Beheerders kunnen hoofdlocaties en sublocaties aanmaken, hernoemen, verplaatsen, archiveren en herstellen. Inventory gebruikt deze boom vervolgens om voorraad aan een geldige fysieke locatie te koppelen.

# Architectuur

De repository is opgezet als een pnpm-workspace met afzonderlijke applicaties en gedeelde packages:

```text
apps/
  backend/
  calorie_tracker/
  inventory/
  product-management-admin/
  recipe/

packages/
  auth-client/
  contracts/
  shared/
```

De vier frontends zijn server-side rendered React Router-applicaties. Iedere applicatie heeft een eigen routeboom, basename, Dockerfile en buildproces. Hierdoor kunnen de applicaties onafhankelijk worden gebouwd en gedeployed.

De backend is een modulaire Hono-applicatie met één SQLite-database. Hier is voor SQLite gekozen, omdat het maar enkele gebruikers gaat onderrsteunen en gelijktijdige operaties vrij weinig gaan voorkomen.De backend bevat afzonderlijke modules voor:

- authenticatie;
- productcatalogus;
- calorie-tracking;
- voorraad;
- opbergplaatsen;
- recepten;
- healthchecks.

Binnen de backend volgt de code in hoofdzaak deze dependencyrichting:

```text
routes → services → repositories → database
             ↓
           domain
```

Routes verwerken HTTP-verkeer, services coördineren use-cases, repositories verzorgen persistence en domeinmodules bevatten pure bedrijfsregels. De verschillende onderdelen worden in één composition root samengesteld door hun afhankelijkheden expliciet te injecteren.

# Gedeelde packages

## Contracts

`packages/contracts` bevat de gedeelde API-contracten voor onder andere producten, categorieën, voorraad, locaties, calorie-tracking en recepten.

De contracten zijn gebaseerd op Zod. Zowel de backend als de frontendclients gebruiken deze schema's om gegevens op systeemgrenzen te valideren. De frontends zetten transportdata daarna om naar modellen die eigendom zijn van de betreffende applicatie.

## Auth client

`packages/auth-client` bevat gedeelde functionaliteit voor browserauthenticatie, sessies en gebruikersrollen. Alle applicaties gebruiken dezelfde Better Auth-backend en gebruikersidentiteit.

Authenticatie wordt centraal gedeeld, terwijl iedere applicatie zelfstandig bepaalt welke routes en functionaliteit voor een gebruiker beschikbaar zijn. Het adminpaneel controleert bijvoorbeeld niet alleen of iemand is ingelogd, maar ook of die gebruiker de beheerdersrol heeft.

## Shared

`packages/shared` bevat alleen functionaliteit die werkelijk door meerdere applicaties wordt gebruikt, zoals generieke API-helpers, productpresentatie, navigatiecomponenten en herbruikbare browserhooks.

Applicatiespecifieke componenten en domeinregels blijven bewust binnen de applicatie die daar eigenaar van is.

# Technische keuzes

## Waarom een monorepo?

De applicaties werken met dezelfde producten, gebruikers, contracten en een deel van dezelfde presentatielogica. Een monorepo maakt het mogelijk om wijzigingen aan een contract, backendendpoint en bijbehorende clients in één wijziging door te voeren.

Tegelijkertijd blijven de applicaties afzonderlijke workspacepackages. Hierdoor is de gedeelde repository geen reden om alles in één frontend of deployment onder te brengen.

## Waarom een centrale API?

Producten, voorraad, recepten en consumpties zijn inhoudelijk met elkaar verbonden. Een centrale API zorgt ervoor dat domeinregels en autorisatie niet door meerdere clients opnieuw hoeven te worden geïmplementeerd.

De frontendapplicaties consumeren gerichte endpoints, maar hebben geen directe toegang tot de database. Hierdoor blijft de backend de centrale plek voor bedrijfsregels, transacties en toegangscontrole.

## Waar deel ik code wel en niet?

Ik deel code wanneer meerdere applicaties exact hetzelfde concept of contract nodig hebben. Voorbeelden zijn authenticatie, API-schema's, productpresentatie en generieke navigatie.

Ik deel geen complete feature-implementaties alleen omdat de interfaces op elkaar lijken. De calorie-tracker, Inventory en recepten-app hebben ieder hun eigen gebruikersflows en domeintaal. Hun componenten, dataloaders en presentatielogica blijven daarom binnen de betreffende applicatie.

Dit voorkomt dat gedeelde packages veranderen in een verzameling sterk gekoppelde applicatiecode.

## Hoe zijn de domeinen gescheiden?

Zowel de backend als de frontends zijn opgedeeld rond functionele domeinen. Frontendfeatures gebruiken waar relevant drie lagen:

- `domain` voor frameworkonafhankelijke modellen en regels;
- `data` voor API-verkeer, validatie en mapping;
- `presentation` voor React-componenten en gebruikersinteractie.

Contracttypes mogen alleen aan de datagrens worden gebruikt. De rest van de frontend werkt met eigen domeinmodellen. Hierdoor lekken backend-DTO's niet rechtstreeks door naar de gebruikersinterface.

## Waarom React Router met SSR?

Iedere frontend is een React Router-frameworkapp met server-side rendering. Routebestanden vormen de composition boundary voor authenticatie, loaders, actions en presentatie.

SSR maakt het mogelijk om sessies en toegangscontrole al tijdens het laden van een route af te handelen. Daarnaast hebben de applicaties hierdoor ieder een zelfstandige serverbuild die achter een eigen publiek basispad kan worden uitgerold.

# Uitdagingen

## Afzonderlijk deployen vanuit één repository

Een belangrijke uitdaging was het combineren van gedeelde code met zelfstandige deployments. De frontends moeten gedeelde packages kunnen gebruiken, maar mogen niet afhankelijk worden van elkaars applicatiecode.

Iedere applicatie heeft daarom een eigen workspacefilter, Dockerfile, build en runtime. Docker installeert alleen de betreffende applicatie en haar transitieve workspace-afhankelijkheden. De backend wordt als een afzonderlijke service gebouwd en uitgevoerd.

## Navigeren tussen zelfstandige applicaties

De calorie-tracker en Inventory verwijzen voor beheertaken naar dezelfde Product Management Admin-app. Daarbij moet het adminpaneel weten vanuit welke applicatie de gebruiker is gekomen, zodat de juiste terugkeerlink kan worden getoond.

Hiervoor gebruikt de adminapp een beperkte en gevalideerde `source`-parameter. Alleen bekende bronnen worden geaccepteerd. Er wordt bewust geen vrije retour-URL gebruikt, zodat deze navigatie geen open redirect kan veroorzaken.

Omdat alle applicaties dezelfde authenticatiebackend en sessie gebruiken, hoeft een gebruiker bij het wisselen tussen applicaties niet opnieuw in te loggen.

## Historische juistheid combineren met actuele productgegevens

Een consumptielog moet ook na een latere wijziging begrijpelijk en berekenbaar blijven. Tegelijkertijd moeten correcties aan productnamen en voedingswaarden waar mogelijk direct doorwerken.

Daarom maakt het datamodel onderscheid tussen actuele stamgegevens en geversioneerde receptinhoud. Een gerechtlog verwijst naar een specifieke, onveranderlijke receptversie, terwijl geschikte productgegevens en macroprofielen actueel kunnen blijven.

## Een veranderend productmodel migreren

Tijdens de ontwikkeling is het productmodel doorontwikkeld naar een model waarin iedere concrete uitvoering rechtstreeks als product selecteerbaar is. Deze wijziging raakt de productcatalogus, voorraad, recepten, calorie-tracking, API-contracten en database.

Door de migratie op te delen in afzonderlijke plannen en contractslices konden de verschillende applicaties stapsgewijs worden aangepast zonder de domeingrenzen te verliezen.

# Specificatiegedreven ontwikkeling

Voor de features bestaan functionele specificaties en, waar nodig, afzonderlijke UI-specificaties.

De functionele specificaties beschrijven onder andere:

- scope en gebruikersrollen;
- domein- en validatieregels;
- routegedrag;
- autorisatie;
- fouttoestanden;
- acceptatiecriteria.

De UI-specificaties beschrijven de schermopbouw, responsive presentatie, interacties en visuele toestanden. Daarnaast bevat de repository ERD's en endpointdocumentatie voor de belangrijkste backenddomeinen.

Deze aanpak helpt om beslissingen expliciet vast te leggen en voorkomt dat implementatiecode de enige bron van waarheid wordt.

# Kwaliteit en testen

De repository bevat unit-, domein-, route- en componenttests. Voor de frontendtests gebruik ik Vitest en Testing Library. Voor kritieke Calorie Tracker-flows is daarnaast Playwright-configuratie aanwezig voor end-to-endtests.

Architectuurgrenzen worden waar mogelijk via ESLint-regels afgedwongen. TypeScript en Zod bewaken respectievelijk interne types en onbetrouwbare data op systeemgrenzen.

Op repositoryniveau kunnen build, linting, typechecks en tests voor alle workspacepackages worden uitgevoerd.

# Resultaat

Het resultaat is een groeiend productsysteem waarin vier zelfstandig inzetbare applicaties dezelfde backend, productcatalogus, authenticatie en API-contracten gebruiken.

De codebase bevat inmiddels:

- afzonderlijk bouwbare en deploybare frontendapplicaties;
- een modulaire backend met gedeelde SQLite-database;
- rolgebaseerde authenticatie en autorisatie;
- een centrale productcatalogus;
- voorraadbeheer met fysieke verpakkingen en hiërarchische locaties;
- persoonlijke consumptielogs en voedingsstatistieken;
- publieke en privé-recepten met geversioneerde inhoud;
- gedeelde, runtime-gevalideerde API-contracten;
- uitgebreide functionele en technische documentatie.

Het project is nog in actieve ontwikkeling. Nieuwe functionaliteit wordt toegevoegd vanuit de vastgelegde specificaties, terwijl bestaande domeinmodellen en architectuur stapsgewijs worden verfijnd.
