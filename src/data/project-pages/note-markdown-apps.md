---
name: "Note Markdown Apps"
slug: "note-markdown-apps"
summary: "Een local-first Markdown-editor voor desktop en web, gebouwd met Electron, React en gedeelde TypeScript-packages voor bestanden, opslag en synchronisatie."
---

# Beschrijving

NoteMarkdown is een Markdown-editor waarbij documenten gewone bestanden blijven. Een gebruiker kan werken met een lokale map op de computer of met een zelfgekozen map in Google Drive.

Het doel is om de voordelen van een desktopapp en webapp te combineren. Een lokale editor geeft veel controle over bestanden, maar is meestal minder makkelijk te gebruiken op een telefoon of andere computer. Een online editor is overal bereikbaar, maar slaat documenten vaak op in het eigen systeem van de aanbieder. Met NoteMarkdown probeer ik hier een middenweg voor te maken.

De gekozen lokale map of Drive-map blijft de bron van waarheid. NoteMarkdown gebruikt geen eigen documentformaat en slaat de inhoud van documenten niet op een centrale NoteMarkdown-server op. Browseropslag wordt wel gebruikt voor onder andere offline werken, drafts, geschiedenis, zoekgegevens en wijzigingen die nog niet zijn gesynchroniseerd.

Het project is opgezet als een pnpm-monorepo met een PWA, metadata-API, Electron-applicaties en gedeelde packages voor de editor, opslag, synchronisatie en Markdown-rendering.

# Probleem en doel

Veel online editors zijn makkelijk bereikbaar en kunnen synchroniseren tussen apparaten. Het nadeel is dat de documenten dan meestal in het gegevensmodel en op de servers van die applicatie staan.

Bij een lokale Markdown-editor heeft de gebruiker meer controle. De bestanden kunnen ook door een andere teksteditor, Git-client of Markdown-applicatie worden geopend. Het nadeel is dat zo'n editor vaak alleen beschikbaar is op de computer waarop deze is geïnstalleerd.

Met NoteMarkdown wil ik deze twee manieren combineren:

- documenten blijven normale Markdown-bestanden;
- een lokale workspace heeft geen account nodig;
- Google Drive kan optioneel als online provider worden gebruikt;
- de webapp kan als PWA worden geïnstalleerd;
- wijzigingen worden eerst lokaal veilig opgeslagen;
- documentinhoud wordt niet via de eigen backend verstuurd;
- meerdere clients kunnen dezelfde editor- en workspacepackages gebruiken.

Dit project gebruik ik ook om meer te leren over local-first architectuur. Bij een normale CRUD-applicatie wordt een wijziging meestal direct naar de backend gestuurd. Bij NoteMarkdown moet de applicatie rekening houden met offline werken, meerdere opslagproviders, externe wijzigingen, conflicten en meerdere browsertabbladen die dezelfde workspace kunnen gebruiken.

# Mijn rol

Ik ontwikkel NoteMarkdown zelfstandig. Hierdoor ben ik verantwoordelijk voor zowel het productontwerp als de technische implementatie.

Mijn werkzaamheden bestaan onder andere uit:

- het vastleggen van de productregels;
- het ontwerpen van de local-first architectuur;
- het ontwikkelen van de PWA en responsive interface;
- het bouwen van lokale en Google Drive-workspaces;
- het opslaan en migreren van browserdata;
- het versleutelen van gevoelige lokale gegevens;
- het ontwikkelen van synchronisatie en conflictbehandeling;
- het bouwen van de Markdown-renderer met Rust en WebAssembly;
- het ontwikkelen van de Hono-API en database;
- Google OAuth, sessies en tokenbeheer;
- het maken van gedeelde API-contracten;
- unit-, integratie- en end-to-endtests;
- Docker- en deploymentconfiguratie;
- het documenteren en testen van performance-eisen.

# Werken met documenten

Een gebruiker kiest als eerste een map die als workspace wordt gebruikt. Daarna laat NoteMarkdown de ondersteunde Markdown-bestanden, afbeeldingen en onderliggende mappen in een bestandsboom zien.

De editor ondersteunt op dit moment onder andere:

- meerdere documenten openen in tabbladen;
- automatisch opslaan;
- wisselen tussen Editor en Preview;
- zoeken in bestandsnamen en documentinhoud;
- bestanden aanmaken;
- bestanden en mappen hernoemen en verplaatsen;
- bestanden verwijderen en herstellen;
- afbeeldingen invoegen via plakken, slepen of een bestandsdialoog;
- herstelgeschiedenis;
- conflicten bekijken en oplossen;
- een licht, donker of systeemthema;
- een Nederlandse en Engelse interface;
- responsive gebruik op desktop en mobiel;
- installatie als Progressive Web App.

Op desktop kan de zijbalk worden ingeklapt en breder of smaller worden gemaakt. Op mobiel wordt de zijbalk een tijdelijke drawer. Hierdoor blijft er op een klein scherm zoveel mogelijk ruimte over voor de editor.

# Lokale en online workspaces

## Lokale mappen

In een browser met ondersteuning voor de File System Access API kan de gebruiker direct een map op de computer openen. NoteMarkdown krijgt na toestemming toegang tot deze map en kan de bestanden daar lezen en schrijven.

Voor een lokale workspace is geen account en ook geen backend nodig. De Markdown-bestanden blijven in de gekozen map staan en kunnen daarnaast met andere programma's worden gebruikt.

De browser bewaart wel extra informatie om de workspace sneller en veiliger te gebruiken. Voorbeelden hiervan zijn:

- geopende tabbladen;
- cursorposities;
- lokale drafts;
- herstelgeschiedenis;
- metadata van bestanden;
- de lokale zoekindex;
- instellingen van de interface.

Deze gegevens helpen bij het herstellen van de applicatiestatus, maar vervangen de echte bestanden niet. De lokale map blijft uiteindelijk de plaats waar de documenten horen te staan.

## Google Drive

Een gebruiker kan zich ook aanmelden met Google en één specifieke Drive-map kiezen als workspace. Alleen de gekozen map wordt daarna door NoteMarkdown gebruikt.

De browser communiceert rechtstreeks met de Google Drive API voor het lezen en schrijven van documenten en afbeeldingen. De NoteMarkdown-backend wordt hier niet als tussenlaag voor de bestanden gebruikt.

De backend is alleen verantwoordelijk voor:

- Google OAuth;
- gebruikerssessies;
- versleutelde refresh tokens;
- kortlevende access tokens voor Drive;
- referenties naar gekoppelde workspaces;
- globale instellingen en keybindings.

Hierdoor ontvangt de backend geen Markdown-inhoud, afbeeldingen, bestandsnamen, directorystructuren, zoekopdrachten of gerenderde documenten. Dit is een bewuste architectuurkeuze en niet alleen een instelling die later uitgezet kan worden.

# Eerst lokaal opslaan en daarna synchroniseren

Een wijziging in de editor mag niet direct afhankelijk zijn van een werkende opslagprovider. Als de internetverbinding tijdelijk wegvalt moet een gebruiker bij een Drive-workspace nog steeds verder kunnen typen.

Daarom wordt een wijziging als eerste duurzaam in de browser opgeslagen. Daarna probeert NoteMarkdown de wijziging naar de lokale map of Google Drive te schrijven.

Vereenvoudigd gebeurt het volgende:

```text
Editorwijziging
  → draft lokaal opslaan
  → herstelpunt bijwerken
  → zoekindex en diagnostiek bijwerken
  → schrijfopdracht voor de provider inplannen
  → externe revisie controleren
  → bestand veilig wegschrijven
```

Als een write naar Google Drive niet lukt blijft deze in een lokale wachtrij staan. Zodra de provider weer beschikbaar is wordt opnieuw geprobeerd om de wijziging te synchroniseren.

Browseropslag is hierbij geen derde soort workspace. Het is ondersteunende opslag voor de local-first werking. De lokale map of Drive-map blijft de uiteindelijke bron van waarheid.

# Synchronisatie en conflicten

Synchronisatie wordt lastiger als hetzelfde document buiten NoteMarkdown wordt aangepast. Dit kan bijvoorbeeld gebeuren vanuit een andere Markdown-editor, een ander apparaat of een tweede browsertabblad.

Een eenvoudig last-write-wins-model zou de laatst opgeslagen versie altijd laten winnen. Hierdoor kan tekst stil worden overschreven. Ik heb er daarom voor gekozen om meerdere revisies apart bij te houden:

- de laatst bekende revisie van de provider;
- de revisie van de lokaal gecachete inhoud;
- de basisrevisie waarop de lokale wijziging is gemaakt;
- de actuele lokale draft;
- de revisie waarop de zoekindex is gebaseerd.

Voor het schrijven wordt gecontroleerd of de externe revisie nog overeenkomt met de verwachte revisie. Als zowel de lokale als externe inhoud is veranderd, probeert NoteMarkdown een three-way merge uit te voeren. De basisversie, lokale versie en externe versie worden dan met elkaar vergeleken.

Als de wijziging niet veilig automatisch gecombineerd kan worden, wordt er een conflictstatus gemaakt. De lokale tekst wordt dus niet zomaar over een onbekende externe versie heen geschreven.

De applicatie houdt ook rekening met meerdere browsertabbladen. Per workspace wordt één tabblad gekozen als synchronisatieleider. Per document wordt daarnaast een editing lease gebruikt. Hiermee wordt geprobeerd te voorkomen dat meerdere tabbladen dezelfde synchronisatietaken tegelijk uitvoeren of elkaars writes overschrijven.

# Een workspace opnieuw openen

Een grote workspace kan veel bestanden bevatten. Als bij ieder bezoek eerst alle bestanden opnieuw van de provider moeten worden opgehaald duurt het te lang voordat de gebruiker verder kan werken.

Bij het openen van een bekende workspace wordt de interface daarom eerst opgebouwd uit de duurzame lokale repository. Daaruit kunnen onder andere worden hersteld:

- het workspace-manifest;
- de bestandsboom;
- geopende tabbladen;
- het actieve document;
- lokale drafts;
- zoekgegevens;
- bestaande conflicten;
- writes die nog uitgevoerd moeten worden;
- instellingen van de interface.

Hierdoor kan de gebruiker de bekende toestand snel terugzien. Daarna controleert NoteMarkdown op de achtergrond of er wijzigingen bij de provider zijn.

Het actieve document en de geopende tabbladen krijgen voorrang. Bestanden die op dat moment niet zichtbaar zijn kunnen later worden verwerkt.

Voor Google Drive worden change cursors gebruikt. Hiermee kan de applicatie vanaf een eerder punt opvragen wat er veranderd is, in plaats van iedere keer de volledige Drive-map opnieuw te downloaden en indexeren.

# Markdown-rendering met Rust en WebAssembly

De Markdown-preview wordt niet op de backend gegenereerd. In de repository staat een Rust-package dat naar WebAssembly wordt gecompileerd en in de browser wordt uitgevoerd.

De renderer gebruikt `pulldown-cmark` en ondersteunt GitHub Flavored Markdown. Het renderen gebeurt in een webworker. Hierdoor hoeft de React-interface niet te wachten als een groter document wordt verwerkt en blijft CodeMirror beter reageren op invoer.

De worker geeft naast de veilige HTML ook extra informatie terug over:

- links;
- afbeeldingen;
- headings;
- codeblokken;
- bronposities;
- de tijd die het renderen kostte.

Raw HTML uit een Markdown-bestand wordt niet uitgevoerd. Syntax highlighting wordt los geladen en alleen toegepast als het document codeblokken bevat waarvoor dit nodig is. Hierdoor hoeft deze extra code niet bij ieder document standaard uitgevoerd te worden.

# Zoeken en workspaceproblemen

Full-text zoeken gebeurt volledig in de browser. Een aparte worker beheert de zoekindex en verwerkt wijzigingen incrementeel. Dit betekent dat niet bij iedere wijziging de volledige workspace opnieuw geïndexeerd hoeft te worden.

Een gebruiker kan zoeken in:

- bestandsnamen;
- de inhoud van Markdown-documenten;
- exacte woordgroepen tussen aanhalingstekens.

De zoekresultaten bevatten compacte snippets met de relevante tekst. De zoekopdracht en documentinhoud worden hiervoor niet naar de backend gestuurd.

NoteMarkdown controleert een workspace daarnaast op verschillende problemen, zoals:

- relatieve links naar een document dat niet bestaat;
- verwijzingen naar ontbrekende afbeeldingen;
- bestanden die extern verwijderd zijn;
- conflicterende revisies.

Als een document wordt verplaatst of hernoemd kunnen relatieve links in andere documenten worden aangepast. Voor zo'n wijziging over meerdere bestanden worden eerst herstelpunten gemaakt. Als er tijdens de operatie iets fout gaat is er daardoor nog een eerdere toestand beschikbaar.

# Architectuur

De repository is georganiseerd als een pnpm-workspace:

```text
apps/
  web-app/
  api/
  desktop-app/
  web-tray-app/
  demo/

packages/
  editor/
  workspace-core/
  workspace-local/
  workspace-drive/
  browser-storage/
  sync-core/
  markdown-wasm/
  api-contracts/
  electron-server/
  file-browser/
  types/
  utils/
```

De belangrijkste applicatie is op dit moment de React/Vite PWA in `apps/web-app`. De desktop- en trayapplicaties zijn aparte clients en kunnen steeds meer van dezelfde packages gaan gebruiken.

De webapp gebruikt:

- React voor de interface;
- CodeMirror 6 voor de editor;
- Zustand voor workspace- en documentstate;
- TanStack Query voor account- en API-data;
- IndexedDB voor duurzame browseropslag;
- webworkers voor Markdown-rendering en zoeken.

De backend is een aparte Hono-service. Deze gebruikt PostgreSQL met Drizzle ORM. De gedeelde API-contracten zijn gemaakt met Zod en worden ook gebruikt voor de OpenAPI-beschrijving.

# Eén contract voor meerdere providers

Een lokale directory en een Google Drive-map werken technisch heel anders. Toch moet de rest van de applicatie met allebei dezelfde soort handelingen kunnen uitvoeren.

Daarom implementeren beide providers hetzelfde `WorkspaceProvider`-contract. Dit contract bevat onder andere operaties voor:

- bestanden en mappen tonen;
- documenten lezen en schrijven;
- revisies controleren;
- bestanden aanmaken;
- bestanden hernoemen en verplaatsen;
- bestanden verwijderen en herstellen;
- externe wijzigingen ontdekken;
- controleren welke mogelijkheden een provider ondersteunt.

De specifieke Google Drive-logica blijft binnen `workspace-drive`. Browsermachtigingen en lokale filesystemoperaties blijven binnen `workspace-local`.

De synchronisatielaag gebruikt alleen de algemene operaties van het contract. Hierdoor hoeft deze laag niet te weten of een revisie uit Drive komt of dat een bestand via de File System Access API wordt geschreven.

# Privacy als architectuurkeuze

Privacy is bij NoteMarkdown niet alleen een instelling in de interface. Ik heb de grens ook in de architectuur verwerkt.

De backend mag account- en configuratiegegevens opslaan, maar heeft geen endpoints voor het uploaden van documenten, zoekindexen of Markdown-rendering. Bij een Drive-workspace loopt de documentinhoud rechtstreeks tussen de browser en Google Drive.

Sommige Drive-gegevens moeten lokaal beschikbaar zijn om offline te kunnen werken. Gevoelige gegevens worden daarom versleuteld in de browseropslag. Dit geldt onder andere voor:

- drafts;
- geschiedenis;
- manifests;
- paden;
- conflicten;
- pending operations.

Diagnostische informatie wordt beperkt tot vaste categorieën, aantallen, timings en foutcodes. Bestandsnamen, paden, workspace-ID's, inhoud, tokens en requestbodies mogen niet in de telemetrie terechtkomen.

# Technische keuzes

## Waarom local-first?

Een tekstwijziging hoort niet verloren te gaan omdat het netwerk of Google Drive tijdelijk niet bereikbaar is. Daarom wordt de lokale opslag als eerste veilige stap gebruikt en de providerwrite als een volgende stap.

Dit maakt de implementatie wel ingewikkelder. De applicatie moet namelijk bijhouden welke versie lokaal staat, welke versie extern staat en welke writes nog moeten worden uitgevoerd. Voor een editor vind ik deze extra complexiteit wel de moeite waard, omdat de inhoud van de gebruiker het belangrijkste onderdeel van de applicatie is.

## Waarom meerdere packages?

De PWA, desktopapp en trayapp hebben voor een groot gedeelte dezelfde editor- en bestandsfunctionaliteit nodig. Als iedere applicatie dit zelf implementeert ontstaan er meerdere versies van dezelfde logica.

Daarom staan de editor, file browser, providers, opslag en synchronisatie in aparte packages. Een package krijgt daarbij een zo duidelijk mogelijke verantwoordelijkheid. Providerdetails horen bijvoorbeeld niet in `sync-core` en React-componenten horen niet in een algemene opslagpackage.

## Waarom Rust en WebAssembly?

Markdown-rendering kan bij grote documenten meer werk vragen en mag de editor niet blokkeren. Rust geeft mij de mogelijkheid om een afgebakende en snelle renderer te maken. Door deze naar WebAssembly te compileren kan dezelfde renderer in de browser worden uitgevoerd.

De webworker is hierbij minstens zo belangrijk. Ook een snelle renderer kan merkbaar zijn als deze op de hoofdthread draait. Door het werk naar een worker te verplaatsen blijft de gebruikersinterface beschikbaar.

## Waarom geen documentbackend?

Een centrale documentbackend zou synchronisatie op sommige punten makkelijker maken, maar dan worden de bestanden alsnog afhankelijk van NoteMarkdown. Dat gaat tegen het doel van het project in.

Daarom verwerkt de backend alleen accounts, OAuth, tokens en instellingen. De documenten blijven in een lokale map of bij Google Drive. Dit betekent dat de browser meer synchronisatielogica moet uitvoeren, maar de gebruiker houdt wel controle over de bestanden.

# Uitdagingen

## Browseropslag en echte bestanden combineren

De browser moet genoeg informatie bewaren om snel en offline te kunnen werken. Tegelijkertijd mag IndexedDB niet ongemerkt de nieuwe bron van waarheid worden.

Daarom maak ik onderscheid tussen vervangbare cachedata en onvervangbare lokale data. Een zoekindex kan opnieuw worden opgebouwd. Een draft die nog niet naar Drive is geschreven kan niet zomaar worden verwijderd.

## Drive synchroniseren zonder centrale contentserver

Omdat de documenten direct tussen de browser en Google Drive bewegen kan de backend de synchronisatie niet centraal uitvoeren. De browser moet zelf omgaan met revisies, retries, change cursors, conflicten en pending writes.

Dit is een belangrijk voordeel voor privacy, maar technisch ook één van de lastigste onderdelen van het project.

## Externe wijzigingen herkennen

Een document kan buiten de actieve NoteMarkdown-tab veranderen. Alleen controleren tijdens het opslaan is niet genoeg, omdat de gebruiker dan mogelijk lang naar een verouderde versie kijkt.

Daarom worden providerrevisies en change cursors bijgehouden en zijn er aparte conflictstatussen. Het doel is dat een onbekende externe wijziging nooit stil wordt overschreven door een lokale write.

## Grote workspaces responsive houden

Markdown-rendering, zoekindexering en het controleren van een volledige workspace kunnen veel werk veroorzaken. Als dit allemaal op de hoofdthread en tegelijk gebeurt reageert de editor langzaam.

Daarom gebruik ik workers, incrementele updates, generatie-ID's en begrensde queues met prioriteiten. De generatie-ID's voorkomen bijvoorbeeld dat een ouder workerresultaat een nieuwer resultaat overschrijft als taken in een andere volgorde klaar zijn.

# Testen en betrouwbaarheid

De repository bevat tests voor onder andere:

- het algemene providercontract;
- pad- en bestandsoperaties;
- IndexedDB-opslag en migraties;
- versleutelde Drive-records;
- writes met revisiecontrole;
- de wachtrij met pending writes;
- retries en foutclassificatie;
- synchronisatie tussen tabbladen;
- three-way merges;
- API-contracten;
- privacyregels;
- authenticatie en scheiding tussen gebruikers;
- Markdown-rendering;
- full-text zoeken.

Voor TypeScript-tests gebruik ik Vitest. De Rust-renderer wordt getest met Cargo. Playwright wordt gebruikt voor beschermde end-to-endtests met echte Drive-workspaces en meerdere browsercontexten.

Vooral bij synchronisatie zijn alleen unittests niet genoeg. Twee tabbladen of een externe Drive-wijziging kunnen namelijk een andere volgorde van acties veroorzaken dan in een enkele functie zichtbaar is. Daarom worden deze scenario's ook op integratie- en end-to-endniveau getest.

# Huidige stand

NoteMarkdown heeft inmiddels een bruikbare local-first webeditor met:

- lokale workspaces;
- Google Drive-workspaces;
- offline ondersteuning;
- veilige autosave;
- meerdere geopende documenten;
- een Editor- en Preview-weergave;
- full-text zoeken;
- herstelgeschiedenis;
- conflictbehandeling;
- een lokaal uitgevoerde Markdown-renderer;
- responsive gebruik en PWA-installatie.

De ontwikkeling richt zich nu verder op het testen en verbeteren van Drive-synchronisatie, grote workspaces, mobiele browsers, passieve detectie van externe wijzigingen en de betrouwbaarheid voor een release.

Het project is technisch een stuk uitgebreider geworden dan alleen een Markdown-editor. Vooral het veilig combineren van lokale bestanden, cloudopslag, browseropslag en offline gebruik maakt het interessant. Het belangrijkste uitgangspunt blijft daarbij dat de gebruiker eigenaar blijft van gewone Markdown-bestanden en niet afhankelijk wordt van een eigen NoteMarkdown-documentserver.
