---
name: "Portfolio - Astro + Svelte"
slug: "portfolio-astro"
images: []
coverUrl: "/covers/portfolio_astro_cover.png"
thumbUrl: "/thumbs/portfolio_astro_thumb.png"
summary: "Dit is mijn portfolio website. Hierop kun je mijn werk vinden. Voorzien van Githublink en een link naar de live versie (indien aanwezig). Dit is de 3e iteratie van de applicatie, waarbij Solidjs nu is vervangen door Svelte en de projecten nu worden gegenereerd met markdown bestanden."
---

# Beschrijving

Dit is de derde versie van mijn persoonlijke portfolio. Op deze website laat ik mijn projecten zien en kan je via GitHub of een live link meer van een project bekijken. Daarnaast staat er recente GitHub-activiteit op de homepage en is er een contactpagina.

Voor deze versie heb ik SolidJS vervangen door Svelte en wordt de website gebouwd met Astro. De projecten stonden eerst meer vast in de code. Nu worden de projectkaarten en uitgebreide projectpagina's gegenereerd met Markdown-bestanden. Hierdoor hoef ik niet voor elk nieuw project opnieuw een pagina of component te maken.

De website bestaat op dit moment uit:

- een homepage met een introductie en uitgelichte projecten;
- een projectenpagina met filters;
- projectkaarten met links, tags en afbeeldingen;
- aparte pagina's voor projecten met een uitgebreide beschrijving;
- carrousels voor de uitgelichte projecten en de mobiele projectenpagina;
- een modal om screenshots groter te bekijken;
- een overzicht van mijn recente GitHub-commits;
- een contactpagina met een formulier;
- een responsive navigatie voor desktop en mobiel.

# Probleem en doel

Ik heb projecten gemaakt met verschillende programmeertalen, frameworks en libraries. Als al deze projecten alleen onder elkaar staan wordt het al snel onoverzichtelijk. Daarom wilde ik niet alleen projectkaarten tonen, maar bezoekers ook de mogelijkheid geven om gericht te filteren.

Een ander doel was om de content los te halen van de componenten. Een project bestaat uit vaste gegevens zoals de naam, categorie, gebruikte technieken, links en afbeeldingen. De beschrijving kan per project sterk verschillen. Markdown past hier goed bij, omdat ik de vaste gegevens in de frontmatter kan zetten en daaronder de beschrijving kan schrijven.

Ik wilde ook niet dat de hele website een grote JavaScript-applicatie werd. De meeste inhoud verandert namelijk niet nadat de pagina is geladen. Daarom heb ik Astro gebruikt voor de statische pagina's en Svelte alleen voor onderdelen waar interactie of state nodig is. Voorbeelden hiervan zijn de filters, het mobiele menu, de carrouselbediening en de screenshotmodal.

# Mijn rol

Ik ben de enige ontwikkelaar van dit portfolio. Dit betekent dat ik verantwoordelijk ben voor:

- het ontwerpen en bouwen van de pagina's;
- het maken van de responsive layouts;
- het opdelen van de interface in Astro- en Svelte-componenten;
- het bijhouden van de projectcontent;
- het ophalen en tonen van GitHub-data;
- het koppelen van het contactformulier aan een externe API;
- het optimaliseren van afbeeldingen;
- het testen van de belangrijkste onderdelen;
- het bouwen en beschikbaar stellen van de statische website.

Omdat het mijn eigen portfolio is blijf ik onderdelen aanpassen wanneer ik een beter idee heb voor het design of de techniek. Deze derde versie is daarom niet in één keer gemaakt, maar is steeds verder uitgebreid en aangepast.

# Pagina's en functionaliteit

## Homepage

Op de homepage staat als eerste een korte introductie over mij als full-stack developer. Daaronder staan knoppen waarmee een bezoeker mij kan mailen, mijn GitHub of LinkedIn kan openen of direct naar de projectenpagina kan gaan.

Vervolgens worden de uitgelichte projecten getoond. Welke projecten hier staan wordt bepaald met de waarde `highlighted` in het Markdown-bestand van een project. Hierdoor hoef ik de homepage zelf niet aan te passen wanneer ik een ander project wil uitlichten.

De uitgelichte projecten staan in een horizontale carrousel. Het middelste en actieve project wordt groter getoond en de kaarten ernaast worden iets kleiner en minder opvallend gemaakt. Onder de carrousel staan navigatiepunten waarmee de bezoeker direct naar een ander project kan gaan.

Op mobiel begint de carrousel bij de eerste kaart en wordt de kaart aan het begin van het scherm uitgelijnd. Op grotere schermen staat de actieve kaart in het midden. De hoofdonderdelen van de homepage maken ook gebruik van verticaal scroll snapping, zodat de introductie, uitgelichte projecten en GitHub-commits als losse onderdelen in beeld komen.

## Projectenoverzicht

De projectenpagina toont alle projecten die in `src/data/project-cards` staan. Op dit moment zijn dit negentien projecten. De projecten worden automatisch gesorteerd op `lastUpdated`, zodat de projecten waar ik het meest recent aan heb gewerkt bovenaan staan.

Op een desktopscherm worden de projecten in een grid van drie kolommen geplaatst. Op een kleiner scherm verandert dit naar twee kolommen. Op mobiel worden de kaarten achter elkaar gezet in een horizontale carrousel.

De mobiele carrousel gebruikt scroll snapping. Hierdoor komt na het swipen steeds één projectkaart goed in beeld te staan. Onder de kaarten staan een vorige en volgende knop met daartussen een teller. Deze teller laat zien bij welk project de bezoeker is en hoeveel zichtbare projecten er zijn.

De carrousel houdt ook rekening met de filters. Als een project wordt verborgen, telt deze niet meer mee. Wanneer de actieve kaart door een filter verdwijnt kiest de carrousel automatisch de eerste kaart die nog wel zichtbaar is. Bij de eerste kaart wordt de vorige knop uitgeschakeld en bij de laatste kaart de volgende knop.

Als er geen projecten voldoen aan de gekozen filters wordt de tekst "Geen projecten gevonden met deze filters" getoond.

## Projectfilters

De projecten kunnen worden gefilterd op:

- categorie;
- programmeertaal;
- frameworks en libraries.

De categorieën en technieken zijn niet apart handmatig vastgelegd voor het filtermenu. Deze worden uit de projectdata gehaald. Achter elke filteroptie staat het aantal projecten dat bij deze optie hoort. De opties met de meeste projecten staan bovenaan. Als twee opties hetzelfde aantal hebben worden ze alfabetisch gesorteerd.

CSS en HTML worden niet bij het programmeertaalfilter getoond. Deze technieken komen bij bijna ieder frontendproject terug en voegen daardoor niet veel toe als programmeertaalfilter.

De filters zijn afhankelijk van elkaar. Als eerste kan een categorie worden gekozen. De gekozen categorie bepaalt welke programmeertalen nog beschikbaar zijn. De categorie en programmeertaal bepalen daarna samen welke frameworks en libraries nog gekozen kunnen worden.

Als een gebruiker eerst een library selecteert en daarna een categorie kiest waar deze library niet bij voorkomt, dan wordt de library automatisch verwijderd. Dit voorkomt dat er een ongeldige combinatie van filters actief blijft.

Bij frameworks en libraries kunnen meerdere opties tegelijk worden gekozen. Hierbij wordt AND-filtering gebruikt. Dit betekent dat een project alle gekozen libraries moet bevatten. Als bijvoorbeeld React en Hono zijn geselecteerd, worden alleen projecten getoond die React én Hono gebruiken.

Omdat er veel frameworks en libraries in de projecten staan heb ik ook een zoekveld toegevoegd. Hiermee kan de bezoeker binnen de beschikbare opties zoeken. De geselecteerde filters worden onder het formulier als chips getoond en kunnen daar één voor één worden verwijderd.

De filterstatus wordt ook in de URL gezet. Een URL kan bijvoorbeeld een categorie, programmeertaal en meerdere libraries bevatten. Hierdoor kan iemand een gefilterd projectenoverzicht delen of later opnieuw openen. Ongeldige waardes uit de URL worden genegeerd en daarna wordt de URL bijgewerkt met alleen de geldige filters.

Op mobiel staat het filterpaneel standaard dicht. Rechtsboven staat een ronde filterknop waarmee het paneel geopend kan worden. Achter het paneel wordt een donkere backdrop getoond. Als de gebruiker op deze backdrop drukt sluit het paneel weer. Bij het sluiten worden ook de geopende keuzemenu's gesloten.

## Projectkaarten

Iedere projectkaart gebruikt dezelfde component en toont:

- de thumbnail van het project;
- de naam van het project;
- een korte beschrijving uit Markdown;
- tags met programmeertalen, frameworks en libraries;
- een GitHub-link als er een repository is;
- een live link als het project online staat;
- een link naar de uitgebreide projectpagina als deze bestaat.

Niet elk project heeft een uitgebreide pagina. Een project krijgt pas een pagina als er een Markdown-bestand met dezelfde slug in `src/data/project-pages` staat. Op een groter scherm kan de gebruiker op de inhoud van de kaart klikken om deze pagina te openen. Op mobiel staat hiervoor een extra knop met de tekst "Bekijk pagina".

Externe links worden automatisch geopend in een nieuw tabblad. Daarbij worden ook `noopener` en `noreferrer` toegevoegd. Dit voorkomt dat iedere component zelf moet bepalen hoe een externe link veilig wordt geopend.

De thumbnails worden verwerkt met Astro Assets. Astro maakt voor de afbeeldingen AVIF- en WebP-versies met verschillende breedtes. Afbeeldingen die niet gelijk in beeld staan worden lazy-loaded. De eerste uitgelichte afbeeldingen worden wel direct geladen, omdat deze bovenaan de homepage zichtbaar kunnen zijn.

## Screenshotmodal

Als een bezoeker op de afbeelding van een project klikt wordt de volledige cover in een modal geopend. Hiervoor wordt het native `dialog`-element gebruikt.

De modal zorgt ervoor dat:

- de pagina achter de modal niet meer kan scrollen;
- de afbeelding nooit groter wordt dan de beschikbare ruimte;
- de modal via de sluitknop gesloten kan worden;
- klikken op de achtergrond de modal sluit;
- het normale gedrag van een dialog, zoals sluiten met Escape, blijft werken.

De actieve afbeelding wordt bijgehouden in een gedeelde Svelte-state. Hierdoor kunnen meerdere projectkaarten dezelfde modal gebruiken. Zonder JavaScript blijft de afbeelding ook bereikbaar, omdat de trigger in de basis een normale link naar het afbeeldingsbestand is.

## Uitgebreide projectpagina's

De uitgebreide projectpagina's worden tijdens de build gegenereerd uit de bestanden in `src/data/project-pages`. De slug uit de frontmatter wordt gebruikt voor de URL. Dit bestand maakt bijvoorbeeld de route `/projects/portfolio-astro`.

Aan de linkerkant van de pagina staat op desktop een sticky zijbalk. Bovenaan staat een link terug naar de projectenpagina. Daaronder staat de inhoudsopgave die automatisch wordt gemaakt op basis van de headings in het Markdown-bestand.

Tijdens het scrollen kijkt een `IntersectionObserver` welke heading in beeld staat. De bijbehorende link in de inhoudsopgave wordt dan actief gemaakt. Hierdoor kan de bezoeker zien in welk gedeelte van de beschrijving hij of zij zit.

Onderaan de zijbalk staat een contactblok met een mailknop. Op een mobiel scherm wordt de zijbalk verborgen, zodat de inhoud de volledige breedte kan gebruiken.

## Recente GitHub-activiteit

Onderaan de homepage worden mijn recente GitHub-commits getoond. De commits van meerdere openbare repositories worden opgehaald, bij elkaar gezet en op datum gesorteerd. Forks worden niet meegenomen.

Van iedere commit wordt het volgende getoond:

- de naam van de repository;
- de eerste zeven tekens van de commit-SHA;
- de eerste regel van het commitbericht;
- het aantal gewijzigde bestanden;
- de datum van de commit;
- een link naar de commit op GitHub.

Voor het ophalen van de data wordt de publieke GitHub API gebruikt. Dit gebeurt tijdens het bouwen van de website. Om niet bij iedere build alle data opnieuw op te halen wordt de uitkomst vijftien minuten gecachet.

Een externe API kan mislukken of een limiet bereiken. Daarom staat er ook een snapshot van eerdere GitHub-data in de repository. Als de API geen repositories of commits teruggeeft wordt deze snapshot gebruikt. Als er ook geen snapshot beschikbaar is wordt een lege toestand met uitleg getoond. Hierdoor is de rest van de website niet afhankelijk van GitHub.

## Contact

Op de contactpagina staan links naar LinkedIn en mijn e-mailadres. Daarnaast staat er een formulier met velden voor de naam, het e-mailadres en het bericht.

Als `PUBLIC_API_URL` is ingesteld stuurt het formulier een POST-request met JSON naar `/email/send-email` van die API. Tijdens het versturen verandert de tekst van de knop naar "Versturen...". De gebruiker krijgt daarna een succes- of foutmelding. Na een succesvolle verzending worden de velden leeggemaakt.

Tijdens een actief request kan het formulier niet nog een keer worden verstuurd. Hiermee worden dubbele verzendingen voorkomen.

Als `PUBLIC_API_URL` niet is ingesteld blijft het formulier zichtbaar, maar wordt de verzendknop uitgeschakeld. Onder het formulier staat dan dat het contactformulier op dat moment niet beschikbaar is. De bezoeker kan in dat geval nog steeds de gewone mail- of LinkedIn-link gebruiken.

## Navigatie

De navigatie blijft bovenaan de pagina staan. Op desktop worden de links naar Projecten en Contact naast elkaar getoond. De actieve pagina krijgt een gekleurde lijn, zodat zichtbaar is op welke pagina de bezoeker zit.

Op mobiel worden de links verborgen achter een hamburgermenu. Als de gebruiker op de knop drukt verandert het icoon in een kruis en schuift het menu open. De naam van de actieve pagina blijft in de navigatiebalk staan.

# Architectuur

De belangrijkste mappen van het project zijn als volgt ingedeeld:

```text
src/
  assets/thumbs/
  components/
  data/project-cards/
  data/project-pages/
  lib/
  pages/
  types/
  data.ts
  Layout.astro

public/
  covers/
  fonts/
  icons/

tests/
```

De bestanden in `pages` bepalen de routes van Astro. De algemene layout met metadata, navigatie, globale styling en optionele analytics staat in `Layout.astro`.

De meeste componenten zijn Astro-componenten, omdat deze alleen HTML en CSS hoeven te genereren. Svelte wordt gebruikt als er in de browser state of eventafhandeling nodig is. Ik heb geprobeerd de Svelte-componenten zo gericht mogelijk te laden:

- het mobiele menu wordt alleen geladen bij de mobiele mediaquery;
- de screenshottrigger wordt geladen als deze zichtbaar wordt;
- de projectfilters en afbeeldingsmodal worden tijdens idle-tijd geladen;
- de algemene carrouselbediening wordt geladen zodra de pagina opent;
- de mobiele projectcarrousel wordt alleen op kleine schermen geladen.

Hierdoor wordt niet voor iedere component standaard JavaScript naar de browser gestuurd.

# Contentgedreven projectdata

Voor de projecten gebruik ik twee soorten Markdown-bestanden.

`src/data/project-cards` bevat de korte projectbeschrijvingen voor de homepage en projectenpagina. `src/data/project-pages` bevat de uitgebreide beschrijvingen zoals deze pagina.

In de frontmatter van deze bestanden staan onder andere:

- naam;
- slug;
- categorie;
- programmeertalen;
- frameworks en libraries;
- GitHub-, live- en downloadlinks;
- cover en thumbnail;
- datum van de laatste wijziging;
- of het project uitgelicht moet worden.

In `data.ts` worden alle Markdown-bestanden met `import.meta.glob` ingeladen. De frontmatter, Markdown-inhoud en headings worden daar samengevoegd tot één getypeerd `Project`-object.

In dezelfde datalaag wordt de publieke thumbnail-URL gekoppeld aan de afbeelding in `src/assets/thumbs`. Als de afbeelding daar niet bestaat wordt er bewust een fout gegeven tijdens de build. Hierdoor kom ik er voor de deployment achter dat een project naar een ontbrekende thumbnail verwijst.

# Technische keuzes

## Waarom Astro?

Het grootste gedeelte van dit portfolio bestaat uit tekst, afbeeldingen en links die na het laden niet veranderen. Hiervoor is een volledige client-side applicatie naar mijn mening niet nodig.

Astro genereert de pagina's vooraf als statische HTML. Hierdoor kan de website op een gewone statische host worden geplaatst. Voor de onderdelen die wel interactief zijn kan Astro losse islands laden. Dit is voor dit project de belangrijkste reden geweest om Astro te gebruiken.

## Waarom Svelte?

In de vorige versie gebruikte ik SolidJS. Voor deze derde versie heb ik ervoor gekozen om Svelte te gebruiken voor de interactieve onderdelen.

Svelte gebruik ik niet voor de volledige pagina, maar alleen waar state nodig is. Een voorbeeld is het projectfilter. Hier moeten gekozen filters worden bijgehouden, opties opnieuw worden berekend, kaarten verborgen worden en de URL worden aangepast. Dit is makkelijker in een Svelte-component dan met alleen statische Astro-componenten.

Hetzelfde geldt voor het mobiele menu, de carrouselbediening en de screenshotmodal. De inhoud blijft van Astro komen en Svelte voegt alleen het gedrag toe.

## Waarom Markdown?

Ik wilde projecten kunnen toevoegen zonder de layoutcode aan te passen. Met Markdown kan ik de beschrijving schrijven als een normaal document en de vaste projectgegevens in de frontmatter zetten.

De korte kaartbeschrijving en uitgebreide pagina zijn bewust los van elkaar gehouden. Niet ieder project heeft genoeg informatie nodig voor een volledige pagina. Toch kan het project dan wel gewoon in het overzicht staan. Als ik later een uitgebreide beschrijving toevoeg, wordt de detailpagina automatisch aan de kaart gekoppeld via dezelfde slug.

## Waarom een eigen carrouselfallback?

Voor de carrousels maak ik in de basis gebruik van horizontaal scrollen en CSS scroll snapping. Nieuwere CSS-mogelijkheden voor carrouselnavigatie worden nog niet overal voldoende ondersteund. Daarom heb ik tijdelijk een eigen Svelte-fallback gemaakt.

Deze fallback houdt bij welke slide actief is en bestuurt de navigatiepunten, pijlen en teller. Ook reageert de component op projecten die door de filters verborgen worden.

Als JavaScript niet werkt kan de gebruiker nog steeds handmatig horizontaal scrollen. Bij de navigatiepunten blijft ook de gewone ankernavigatie beschikbaar. Later kan deze fallback mogelijk worden vervangen als de native CSS-functionaliteit breed genoeg wordt ondersteund.

# Responsive ontwerp en toegankelijkheid

De website heeft verschillende layouts voor desktop, tablet en mobiel. Het projectenoverzicht is hier het duidelijkste voorbeeld van: drie kolommen op desktop, twee op een kleiner scherm en een horizontale carrousel op mobiel.

Ik heb bij de interactieve onderdelen rekening gehouden met:

- semantische HTML-elementen zoals `nav`, `button`, `form`, `dialog` en `section`;
- zichtbare focusstijlen voor toetsenbordgebruikers;
- labels voor knoppen en invoervelden;
- `aria-expanded` voor menu's;
- `aria-current` voor actieve navigatie;
- `aria-live` voor de teller van de mobiele carrousel;
- bediening met het toetsenbord;
- minder animatie bij `prefers-reduced-motion`;
- veilige externe links;
- responsive afbeeldingen en lazy loading.

De afbeeldingsmodal houdt ook rekening met de safe areas van een mobiel apparaat. De afbeelding wordt binnen de viewport gehouden, zodat de sluitknop en afbeelding bereikbaar blijven.

Er is daarnaast ondersteuning voorbereid voor een licht en donker thema. Het eerder gekozen thema wordt uit `localStorage` gehaald voordat de pagina zichtbaar wordt. De website gebruikt ook automatische page transitions via CSS.

Google Analytics wordt alleen toegevoegd als `PUBLIC_GA_ID` is ingesteld. Zonder deze environment variable wordt het script niet geladen.

# Kwaliteit en testen

Voor de projectdata, componentprops, filters en GitHub-responses gebruik ik TypeScript. De code wordt gecontroleerd met ESLint, Astro Check en Svelte Check.

Met Playwright worden de belangrijkste onderdelen van de projectenpagina getest. De tests controleren onder andere:

- dat desktop een grid toont zonder mobiele carrouselknoppen;
- dat mobiel een scroll-snapcarrousel met teller toont;
- dat de vorige en volgende knoppen goed werken;
- dat het mobiele filterpaneel open en dicht kan;
- dat categorie en programmeertaal de volgende opties beperken;
- dat de aantallen bij de filteropties kloppen;
- dat er binnen frameworks en libraries gezocht kan worden;
- dat meerdere libraries tegelijk geselecteerd kunnen worden;
- dat meerdere libraries als AND-filter werken;
- dat ongeldige vervolgfilters automatisch worden verwijderd;
- dat de gekozen filters in de URL terechtkomen.

Met `pnpm build` worden de statische pagina's en geoptimaliseerde afbeeldingen gegenereerd. Als een thumbnail ontbreekt of een projecttype niet klopt, komt dit daardoor al tijdens de ontwikkeling of build naar voren.

# Uitdagingen

## Astro en Svelte combineren

De eerste uitdaging was bepalen welke onderdelen Astro moesten blijven en welke onderdelen Svelte nodig hadden. Het is makkelijk om alles interactief te maken, maar dan verdwijnt een groot voordeel van Astro.

Ik heb er daarom voor gekozen om de pagina's, projectkaarten en meeste styling in Astro te houden. Alleen onderdelen die echt browserstate nodig hebben zijn Svelte-componenten geworden. Hierdoor blijft het grootste gedeelte statische HTML.

## Dezelfde projecten anders tonen op mobiel

Op desktop staan de projecten in een grid, maar op mobiel werkt een carrousel beter omdat een kaart anders erg smal wordt. Dezelfde HTML wordt daarom met CSS omgezet van grid naar horizontale lijst.

De lastigheid zit vooral in de combinatie met filters. Na een filterwijziging kunnen kaarten verdwijnen terwijl de carrousel nog op één van deze kaarten staat. De carrousel kijkt daarom opnieuw naar alle zichtbare kaarten, kiest een geldige actieve kaart en werkt de knoppen en teller bij.

## GitHub-data blijven tonen bij fouten

De GitHub API is een externe afhankelijkheid en kan door een netwerkfout of rate limit geen data teruggeven. Ik wilde niet dat een mislukte API-call de hele build of homepage kapot zou maken.

Daarom heb ik drie stappen gebruikt. Als eerste wordt er gekeken naar een recente lokale cache. Als deze er niet is wordt nieuwe data opgehaald. Als dat mislukt wordt de snapshot uit de repository gebruikt. Pas als daar ook geen data in staat wordt een lege toestand getoond.

## Korte en uitgebreide projectcontent scheiden

Niet ieder project heeft gelijk een uitgebreide beschrijving nodig. Als ik alles in één Markdown-bestand zou zetten, wordt de korte beschrijving op een projectkaart te lang of moet ik extra logica toevoegen om een gedeelte eruit te halen.

Daarom heb ik de kaarten en pagina's opgesplitst. De slug wordt gebruikt om te controleren of een kaart een uitgebreide pagina heeft. Hierdoor kan ik later per project een pagina toevoegen zonder de bestaande projectkaart aan te passen.

# Resultaat

Het resultaat is een statische en responsive portfolio-website met Astro en Svelte. Bezoekers kunnen mijn projecten bekijken, filteren op de gebruikte technieken, screenshots vergroten, uitgebreide projectbeschrijvingen lezen en via GitHub, LinkedIn, e-mail of het contactformulier contact opnemen.

De huidige versie bevat:

- negentien projectkaarten uit Markdown;
- een homepage met introductie en uitgelichte projecten;
- een responsive carrousel met navigatiepunten;
- filters op categorie, programmeertaal en libraries;
- zoekbare en meervoudige libraryfilters;
- filters die gedeeld kunnen worden via de URL;
- een desktopgrid en mobiele projectcarrousel;
- geoptimaliseerde thumbnails in meerdere formaten;
- een modal voor projectscreenshots;
- statisch gegenereerde projectpagina's met een inhoudsopgave;
- recente GitHub-commits met cache en snapshot als fallback;
- een configureerbaar contactformulier;
- conditionele Google Analytics;
- checks met ESLint, Astro, Svelte en Playwright.

Het voordeel van deze opzet is dat ik voor een nieuw project meestal alleen een Markdown-bestand en afbeeldingen hoef toe te voegen. De bestaande componenten zorgen daarna voor de sortering, filters, projectkaart, links en eventueel de uitgebreide projectpagina.
