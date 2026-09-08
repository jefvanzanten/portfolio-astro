---
name: "Product App Suite"
slug: "product-app-suite"
summary: "Een fullstack monorepo met vier React-applicaties en een gedeelde Hono-backend voor calorieën, voorraad, recepten en productbeheer."
---

# Beschrijving

De Product App Suite is een fullstack monorepo met vier aparte frontendapplicaties en één gedeelde backend.

Het project bestaat uit:

- een calorie-tracker;
- een inventarisatie-app;
- een recepten-app;
- een adminpaneel voor producten en opbergplaatsen;
- een centrale API voor data, authenticatie en domeinlogica.

Alle applicaties gebruiken dezelfde productcatalogus en gebruikersaccounts, maar iedere applicatie heeft een eigen verantwoordelijkheid en interface. Een product kan bijvoorbeeld worden beheerd in het adminpaneel, als voorraad worden toegevoegd in Inventory, als ingrediënt worden gebruikt in een recept en daarna als consumptie worden gelogd in de Calorie Tracker.

Ik heb er bewust voor gekozen om hier geen grote frontendapplicatie van te maken. Iedere frontend heeft een eigen routeboom, build en deployment. Onderdelen die echt hetzelfde zijn, zoals API-contracten en authenticatie, worden wel gedeeld via packages.

# Probleem en doel

Het idee voor dit project begon bij meerdere applicaties die allemaal iets met producten doen. Als ik deze applicaties volledig los van elkaar zou ontwikkelen, moest ik dezelfde productmodellen, validatie en API-calls op meerdere plekken opnieuw maken. Daarnaast zouden de gegevens van de applicaties niet vanzelf met elkaar verbonden zijn.

Daarom heb ik gekozen voor één gedeelde codebase met één backend. De applicaties blijven zelfstandig, maar gebruiken dezelfde productcatalogus, gebruikers en API-contracten.

Een tweede doel van dit project is het verbeteren van mijn backendkennis. Mijn eerdere backends waren meestal een stuk kleiner. Bij dit project krijg ik te maken met meerdere domeinen, relationele data, authenticatie, autorisatie, transacties en meerdere clients die allemaal met dezelfde API communiceren.

Voor de belangrijkste onderdelen maak ik vooraf functionele specificaties, UI-specificaties, domeinregels, ERD's en endpointdocumentatie. Hierdoor moet ik eerder nadenken over wat een feature precies moet doen en welke uitzonderingen er zijn, in plaats van tijdens het programmeren steeds nieuwe regels te bedenken.

# Mijn rol

Ik ontwikkel de Product App Suite zelfstandig. Hierdoor ben ik verantwoordelijk voor het volledige proces:

- het bepalen en uitschrijven van de requirements;
- het vastleggen van domein- en validatieregels;
- het ontwerpen van de frontend- en backendarchitectuur;
- het ontwerpen en aanpassen van de database;
- het maken van de API-contracten en endpoints;
- het ontwikkelen van de vier frontendapplicaties;
- het implementeren van authenticatie en autorisatie;
- het schrijven van tests;
- het maken van Docker-builds en deploymentconfiguratie;
- het onderhouden van de gedeelde packages.

Omdat de scope vrij groot is wordt het project in stappen ontwikkeld. Ik probeer eerst de regels van een onderdeel vast te leggen en daarna de backend, contracten en frontend in kleinere stukken te implementeren.

# Applicaties

## Calorie Tracker

Met de Calorie Tracker kan een gebruiker bijhouden wat hij of zij heeft gegeten. Per dag kan de gebruiker consumpties toevoegen en de calorieën en macro's bekijken.

De applicatie ondersteunt onder andere:

- dagelijkse calorie- en macrostatistieken;
- persoonlijke doelen voor voeding;
- een consumptielogboek per datum;
- filters op verschillende soorten consumpties;
- producten zoeken en als consumptie toevoegen;
- hoeveelheden in verschillende eenheden invoeren;
- recepten als gerecht loggen;
- bestaande consumpties bekijken en aanpassen;
- historische logs koppelen aan de juiste receptversie.

De persoonlijke doelen en consumpties horen bij één gebruiker. Een ingelogde gebruiker mag dus alleen zijn of haar eigen gegevens bekijken en aanpassen.

Een los product en een gerecht worden niet op precies dezelfde manier gelogd. Bij een product wordt de gekozen hoeveelheid gebruikt om de voedingswaarden uit te rekenen. Bij een gerecht moet ook bekend blijven met welke versie van het recept de berekening is gemaakt.

## Inventory

Inventory gebruik ik voor het bijhouden van fysieke voorraad. De producten komen uit de centrale productcatalogus, maar ieder gekocht exemplaar wordt als een apart voorraaditem opgeslagen.

Een voorraaditem heeft onder andere een eigen:

- opbergplaats;
- houdbaarheidsdatum;
- resterende inhoud;
- status als geopende of volledige verpakking.

Hierdoor kunnen twee verpakkingen van hetzelfde product toch van elkaar verschillen. De ene verpakking kan bijvoorbeeld al open zijn en bijna leeg, terwijl de andere nog volledig is en een andere houdbaarheidsdatum heeft.

De applicatie ondersteunt:

- voorraad bekijken en filteren;
- nieuwe voorraad toevoegen;
- dezelfde volledige verpakkingen gegroepeerd tonen;
- de resterende inhoud aanpassen;
- houdbaarheidsdatums beheren;
- voorraad naar een andere opbergplaats verplaatsen;
- geopende verpakkingen bekijken;
- lage voorraad zichtbaar maken.

Het onderscheid tussen een product uit de catalogus en een echt voorraaditem is hierbij belangrijk. Het catalogusproduct beschrijft wat het product is. Het voorraaditem beschrijft de verpakking die op dat moment daadwerkelijk in huis ligt.

## Recepten

In de recepten-app kan een gebruiker recepten bekijken, aanmaken en beheren. Een recept kan privé blijven of openbaar worden gemaakt.

De huidige functionaliteit bestaat onder andere uit:

- een lijst met openbare recepten;
- zoeken en filteren;
- persoonlijke en openbare recepten;
- receptdetails met ingrediënten;
- stappen voor de bereiding;
- recepten aanmaken en bewerken;
- recepten archiveren en herstellen;
- versiebeheer voor ingrediënten, hoeveelheden en instructies.

Ik heb voor versiebeheer gekozen omdat een recept ook in de Calorie Tracker kan worden gebruikt. Stel dat een gebruiker vandaag een gerecht logt en het recept volgende week aanpast. Dan moet de oude consumptie nog steeds berekend kunnen worden met het recept zoals dit op dat moment was.

Daarom verwijst een gerechtlog naar een specifieke receptversie. Nieuwe wijzigingen maken een nieuwe versie en veranderen niet stil de inhoud waarmee een oudere consumptie is berekend.

## Product Management Admin

Product Management Admin is een aparte beheerapplicatie voor gebruikers met een beheerdersrol.

Het adminpaneel bestaat uit twee hoofdonderdelen:

- de centrale productcatalogus;
- het beheer van opbergplaatsen.

Bij de productcatalogus kan een beheerder producten zoeken, bekijken, aanmaken en aanpassen. Een product bevat gedeelde gegevens zoals naam, merk en categorie. Daarnaast is er een concrete uitvoering of verpakking die door de andere applicaties geselecteerd kan worden.

De opbergplaatsen worden als een boomstructuur beheerd. Een hoofdlocatie kan meerdere sublocaties hebben. Een voorbeeld hiervan is een keuken met daaronder een koelkast en verschillende keukenkastjes.

Een beheerder kan locaties:

- aanmaken;
- hernoemen;
- onder een andere locatie plaatsen;
- archiveren;
- herstellen.

Inventory gebruikt deze boom daarna om een voorraaditem aan een geldige fysieke locatie te koppelen.

# Architectuur

De repository is opgezet als een pnpm-workspace:

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

De vier frontends zijn React Router-applicaties met server-side rendering. Iedere frontend heeft een eigen routeboom, basename, Dockerfile en buildproces. Hierdoor kan ik één applicatie bouwen of deployen zonder de andere frontends als één gezamenlijke applicatie mee te nemen.

De backend is gemaakt met Hono en gebruikt één SQLite-database. Ik heb voor SQLite gekozen omdat dit project maar door een klein aantal gebruikers gebruikt gaat worden en er waarschijnlijk weinig gelijktijdige databaseoperaties zijn. Voor deze situatie vind ik een losse databaseserver onnodig.

De backend is verdeeld in modules voor:

- authenticatie;
- producten en categorieën;
- calorie-tracking;
- voorraad;
- opbergplaatsen;
- recepten;
- healthchecks.

Binnen een backendmodule loopt de dependencyrichting in de basis als volgt:

```text
routes → services → repositories → database
             ↓
           domain
```

De route ontvangt het HTTP-request en valideert de invoer. De service voert de use-case uit en bepaalt welke stappen nodig zijn. De repository verzorgt de communicatie met de database. Domeinmodules bevatten regels die zo min mogelijk afhankelijk zijn van Hono, Drizzle of andere frameworks.

De afhankelijkheden worden in één composition root samengesteld en expliciet meegegeven. Hierdoor kan een service in een test bijvoorbeeld een andere repository krijgen dan tijdens het uitvoeren van de echte backend.

# Gedeelde packages

## Contracts

In `packages/contracts` staan de gedeelde API-contracten voor onder andere:

- producten;
- categorieën;
- voorraad;
- opbergplaatsen;
- calorie-tracking;
- recepten.

De contracten zijn gemaakt met Zod. TypeScript controleert types tijdens het ontwikkelen, maar data uit een HTTP-request is tijdens runtime nog steeds onbetrouwbaar. Zod valideert deze data daarom op de grens van het systeem.

Zowel de backend als de frontendclients gebruiken dezelfde schema's. In de frontend worden de transportgegevens daarna omgezet naar modellen van de applicatie zelf. Hierdoor worden de API-types niet door de volledige frontend heen gebruikt.

## Auth client

`packages/auth-client` bevat de gedeelde code voor authenticatie, sessies en gebruikersrollen. Alle applicaties gebruiken dezelfde Better Auth-backend en dezelfde gebruikersidentiteit.

Het package regelt het gedeelde gedeelte, maar iedere applicatie blijft zelf verantwoordelijk voor de toegang tot routes en functionaliteit. Het adminpaneel controleert bijvoorbeeld niet alleen of een gebruiker is ingelogd, maar ook of de gebruiker de beheerdersrol heeft.

Doordat de applicaties dezelfde sessie gebruiken hoeft een gebruiker niet opnieuw in te loggen bij het wisselen tussen bijvoorbeeld Inventory en het adminpaneel.

## Shared

In `packages/shared` staat alleen code die echt door meerdere applicaties op dezelfde manier wordt gebruikt. Voorbeelden hiervan zijn:

- algemene API-helpers;
- productpresentatie;
- navigatiecomponenten;
- herbruikbare browserhooks.

Ik probeer hier niet ieder component in te zetten dat toevallig op elkaar lijkt. De Calorie Tracker, Inventory en recepten-app hebben verschillende gebruikersflows. De onderdelen die alleen bij zo'n flow horen blijven daarom binnen de betreffende applicatie.

# Technische keuzes

## Waarom een monorepo?

De applicaties gebruiken dezelfde producten, gebruikers en API-contracten. Als deze in losse repositories zouden staan, moest een wijziging aan een contract op meerdere plaatsen los worden bijgehouden.

Met een monorepo kan ik een wijziging aan de backend, het contract en de bijbehorende frontendclients in dezelfde wijziging uitvoeren. Het voordeel hiervan is dat een brekende contractwijziging eerder zichtbaar wordt.

Een monorepo betekent voor mij niet dat alles automatisch gedeeld moet worden. Iedere applicatie blijft een apart workspacepackage met een eigen build en deployment.

## Waarom een centrale API?

Producten, voorraad, recepten en consumpties hebben veel relaties met elkaar. De backend is daarom de centrale plaats voor domeinregels, transacties, authenticatie en autorisatie.

De frontends hebben geen directe toegang tot de database. Ze gebruiken gerichte endpoints voor hun use-cases. Hierdoor hoeft een regel, zoals controleren of een consumptie van de huidige gebruiker is, niet door iedere client zelf te worden uitgevoerd.

## Waar deel ik code wel en niet?

Ik deel code als meerdere applicaties precies hetzelfde contract of gedrag nodig hebben. Authenticatie en Zod-schema's zijn hier duidelijke voorbeelden van.

Complete features deel ik niet alleen omdat de interfaces op elkaar lijken. Een product zoeken in de Calorie Tracker heeft bijvoorbeeld een ander doel dan een product beheren in het adminpaneel. Als ik deze volledige features samenvoeg ontstaat er al snel een gedeeld package dat van alle applicaties iets moet weten.

Daarom blijven applicatiespecifieke componenten, loaders en domeinregels bij de applicatie die daar verantwoordelijk voor is.

## Hoe zijn de domeinen gescheiden?

De backend en frontends zijn ingedeeld op functionele domeinen. Binnen frontendfeatures gebruik ik waar dit nuttig is drie lagen:

- `domain` voor modellen en regels zonder frameworkcode;
- `data` voor API-requests, validatie en mapping;
- `presentation` voor React-componenten en gebruikersinteractie.

De gedeelde contracttypes worden alleen gebruikt bij de datagrens. Daarna wordt de data omgezet naar een model van de frontend. Dit kost extra mappingcode, maar voorkomt dat een backend-DTO automatisch het model van iedere frontend wordt.

## Waarom React Router met SSR?

Iedere frontend gebruikt React Router als framework met server-side rendering. De routes zijn de plaats waar authenticatie, loaders, actions en de presentatie bij elkaar komen.

Met SSR kunnen een sessie en toegangsrechten al tijdens het laden van de route gecontroleerd worden. Daarnaast krijgt iedere applicatie een eigen serverbuild en kan deze achter een eigen publiek basispad worden uitgevoerd.

# Uitdagingen

## Afzonderlijk deployen vanuit één repository

De frontends moeten gedeelde packages kunnen gebruiken, maar mogen niet afhankelijk worden van de code van een andere frontend. Tegelijkertijd wil ik niet bij iedere deployment de volledige monorepo als één applicatie bouwen.

Iedere applicatie heeft daarom een eigen Dockerfile, workspacefilter, build en runtime. Tijdens een Docker-build worden alleen de betreffende applicatie en de transitieve workspace-afhankelijkheden meegenomen. De backend wordt weer als een aparte service gebouwd.

## Navigeren tussen zelfstandige applicaties

De Calorie Tracker en Inventory verwijzen voor beheertaken naar Product Management Admin. Het adminpaneel moet daarbij weten vanuit welke applicatie de gebruiker kwam, zodat er een goede teruglink kan worden getoond.

Hiervoor gebruik ik een `source`-parameter met een beperkte lijst van toegestane waardes. Ik gebruik bewust geen vrije return-URL. Een willekeurige return-URL kan namelijk gebruikt worden als open redirect naar een externe website.

Omdat alle applicaties dezelfde authenticatie en sessie gebruiken blijft de gebruiker tijdens het wisselen ingelogd.

## Historische gegevens correct houden

Een oudere consumptie moet later nog steeds te begrijpen en te berekenen zijn. Dit wordt lastig als een recept ondertussen andere ingrediënten of hoeveelheden heeft gekregen.

Daarom wordt de inhoud van een recept geversioneerd. Een gerechtlog verwijst naar de versie waarmee deze consumptie is aangemaakt. Geschikte actuele stamgegevens, zoals een gecorrigeerde productnaam, kunnen wel actueel blijven waar dit de historische berekening niet verandert.

## Het productmodel aanpassen

Tijdens de ontwikkeling is het productmodel veranderd naar een model waarbij iedere concrete uitvoering direct als product gekozen kan worden. Deze wijziging bleef niet beperkt tot één tabel of component.

De verandering raakte:

- de productcatalogus;
- voorraad;
- recepten;
- calorie-tracking;
- API-contracten;
- de database.

Ik heb deze migratie daarom opgedeeld in kleinere plannen en contractslices. Hierdoor konden de onderdelen stap voor stap worden aangepast en bleef beter zichtbaar welke applicatie of welk domein nog het oude model gebruikte.

# Specificatiegedreven ontwikkeling

Voor de grotere features maak ik functionele specificaties en waar nodig een aparte UI-specificatie.

In de functionele specificaties leg ik onder andere vast:

- wat binnen en buiten de scope valt;
- welke gebruikersrollen er zijn;
- welke domein- en validatieregels gelden;
- hoe routes en endpoints moeten reageren;
- welke autorisatie nodig is;
- welke fouttoestanden mogelijk zijn;
- welke acceptatiecriteria gelden.

De UI-specificaties beschrijven de schermen, responsive layouts, interacties en verschillende visuele statussen. Daarnaast bevat de repository ERD's en documentatie van de belangrijkste endpoints.

Ik gebruik deze documenten als referentie tijdens het programmeren. Als een regel verandert probeer ik eerst de specificatie aan te passen. Hierdoor is de implementatiecode niet de enige plaats waar staat hoe een feature hoort te werken.

# Kwaliteit en testen

De repository bevat verschillende soorten tests:

- unittests;
- domeintests;
- routetests;
- componenttests;
- end-to-endtests voor belangrijke Calorie Tracker-flows.

Voor de TypeScript-tests gebruik ik Vitest en voor React-componenten Testing Library. Voor de end-to-endtests is Playwright geconfigureerd.

Architectuurgrenzen worden waar mogelijk gecontroleerd met ESLint-regels. TypeScript controleert de interne types en Zod controleert de data die via systeemgrenzen binnenkomt.

Op het niveau van de volledige repository kan ik de builds, linting, typechecks en tests van alle workspacepackages uitvoeren. Dit is belangrijk omdat een wijziging aan een gedeeld contract meerdere applicaties tegelijk kan raken.

# Resultaat

Het resultaat is een groeiend productsysteem waarin vier aparte frontendapplicaties dezelfde backend, authenticatie, productcatalogus en API-contracten gebruiken.

De codebase bevat op dit moment:

- vier afzonderlijk bouwbare en deploybare React Router-applicaties;
- een modulaire Hono-backend;
- één gedeelde SQLite-database;
- authenticatie en autorisatie op basis van rollen;
- een centrale productcatalogus;
- voorraadbeheer met losse fysieke verpakkingen;
- een hiërarchie van opbergplaatsen;
- persoonlijke consumptielogs en voedingsstatistieken;
- openbare en privé-recepten;
- versiebeheer voor receptinhoud;
- gedeelde API-contracten met runtimevalidatie;
- functionele en technische specificaties;
- geautomatiseerde tests op meerdere niveaus.

Het project is nog in ontwikkeling. De grote scope maakt het soms lastig, maar is ook precies waarom ik er veel van leer. Iedere nieuwe feature raakt niet alleen een scherm, maar vaak ook een contract, backendmodule, databasemodel en test. Hierdoor krijg ik meer ervaring met de gevolgen van technische keuzes binnen een groter fullstackproject.
