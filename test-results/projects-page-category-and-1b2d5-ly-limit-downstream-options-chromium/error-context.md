# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects-page.spec.ts >> category and language dynamically limit downstream options
- Location: tests/projects-page.spec.ts:127:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /category=Frontend/
Received string:  "http://localhost:4321/projects"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="nl" data-theme="dark" data-astro-cid-tcsfveqr="">…</html>
       - unexpected value "http://localhost:4321/projects"

```

```yaml
- main:
  - navigation:
    - link "JEFVANZANTEN.DEV":
      - /url: /
    - link "Projecten":
      - /url: /projects
    - link "Contact":
      - /url: /contact
  - text: Categorie
  - button "Categorie": Alle categorieën ▾
  - text: Programmeertaal
  - button "Programmeertaal": Alle programmeertalen ▾
  - text: Frameworks & libraries
  - group: Kies frameworks / libraries ▾
  - region "Projecten":
    - article:
      - link "Open screenshot van Product App Suite":
        - /url: /covers/portfolio_cover.png
        - img "Product App Suite cover"
      - heading "Product App Suite" [level=2]
      - paragraph: "Dit project bestaat uit meerdere applicaties binnen één gedeelde codebase: een calorie-tracker, inventarisatie-app, recepten-app, adminpaneel en een backend die de applicaties van data voorziet."
      - paragraph: De applicaties zijn ontwikkeld op basis van specificatiebestanden waarin de kernfunctionaliteit per app is vastgelegd.
      - text: TypeScript CSS HTML React React-Router Hono Drizzle ORM SQLite Better-Auth Zod
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/product-app-suite
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Portfolio - Astro + Svelte":
        - /url: /covers/portfolio_astro_cover.png
        - img "Portfolio - Astro + Svelte cover"
      - heading "Portfolio - Astro + Svelte" [level=2]
      - paragraph: Dit is mijn portfolio website. Hierop kun je mijn werk vinden. Voorzien van Githublink en een link naar de live versie (indien aanwezig).
      - paragraph: Dit is de 3e iteratie van de applicatie, waarbij Solidjs nu is vervangen door Svelte en de projecten nu worden gegenereerd met markdown bestanden.
      - text: TypeScript CSS HTML Astro Svelte
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/portfolio-astro/
        - img "GitHub logo"
        - text: GitHub
      - link "Bekijk live":
        - /url: https://jefvanzanten.dev/
        - img "Bekijk live logo"
        - text: Bekijk live
    - article:
      - link "Open screenshot van Datekanaal":
        - /url: /covers/datekanaal_cover.png
        - img "Datekanaal cover"
      - heading "Datekanaal" [level=2]
      - paragraph: Datekanaal is een datingplatform voor studenten en starters in Nederland. De applicatie combineert een Next.js frontend met realtime matchmaking, profielbeheer en backend-logica via Convex.
      - paragraph: Ik ben stagiair bij The AI Club en heb het afgelopen halfjaar tot op heden aan Datekanaal gewerkt.
      - text: TypeScript CSS HTML Nextjs React Convex TailwindCSS
      - link "Bekijk live":
        - /url: https://www.datekanaal.nl/
        - img "Bekijk live logo"
        - text: Bekijk live
    - article:
      - link "Open screenshot van Note Markdown Apps":
        - /url: /covers/note_markdown_apps.png
        - img "Note Markdown Apps cover"
      - heading "Note Markdown Apps" [level=2]
      - paragraph:
        - text: Een
        - code: pnpm
        - text: "-monorepo met drie apps:"
        - code: desktop-app
        - text: ","
        - code: web-tray-app
        - text: en
        - code: demo
        - text: . In plaats van een Tauri/Rust-core gebruikt deze versie Electron en gedeelde TypeScript-packages voor onder meer de editor, bestandsbrowser en serverlogica.
      - paragraph:
        - text: De UI is React-gebaseerd en de editorcode zit centraal in
        - code: "@note/editor"
        - text: ", zodat de apps dezelfde markdown- en note-ervaring kunnen hergebruiken."
      - text: TypeScript HTML CSS React Electron Nextjs CodeMirror
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/note-markdown.git
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Idea Leaderboard":
        - /url: /covers/leaderboard.png
        - img "Idea Leaderboard cover"
      - heading "Idea Leaderboard" [level=2]
      - paragraph: Een local-first desktop app om ideeen en projecten in SQLite te bewaren en via drag-and-drop op prioriteit te rangschikken. Gebouwd met React, Electron en Drizzle, zonder account of cloud-backend.
      - text: TypeScript HTML CSS React Electron Drizzle ORM
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/idea-leaderboard.git
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Python API - Email send en PDF generation":
        - /url: /covers/fastapi_custom_cover.png
        - img "Python API - Email send en PDF generation cover"
      - heading "Python API - Email send en PDF generation" [level=2]
      - paragraph: Dit is een Python API met een email service en pdf generation service die ik kan gebruiken d.m.v. api endpoints.
      - text: Python FastAPI Resend Pydantic Weasyprint
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/PyAPI
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Bun Auth server":
        - /url: /covers/authserver_cover.png
        - img "Bun Auth server cover"
      - heading "Bun Auth server" [level=2]
      - paragraph: Minimale auth-server voor mijn persoonlijke projecten met beschermde routes en/of API-endpoints.
      - text: TypeScript Hono Better-Auth Drizzle ORM
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/auth-server
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Game Collection":
        - /url: /covers/game-collection.png
        - img "Game Collection cover"
      - heading "Game Collection" [level=2]
      - paragraph: Een website om mijn gamecollectie te tonen aan vrienden en om multiplayer sessies te plannen.
      - paragraph: Gebruikers kunnen filters toepassen om te zien welke games speelbaar zijn met de op dat moment beschikbare middelen.
      - text: TypeScript CSS HTML React
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/game-collection
        - img "GitHub logo"
        - text: GitHub
      - link "Bekijk live":
        - /url: https://game-collection.jefvanzanten.dev/
        - img "Bekijk live logo"
        - text: Bekijk live
    - article:
      - link "Open screenshot van Task Manager":
        - /url: /covers/task-manager-cover.png
        - img "Task Manager cover"
      - heading "Task Manager" [level=2]
      - paragraph: Een taak- en projectbeheerder met Notion/TickTick als voorbeeld. Projecten en taken zijn gebruikersspecifiek en worden ingeladen op basis van het ingelogde profiel.
      - paragraph: Gebouwd met Next.js en TypeScript; alle database-operaties zijn server-side en de data wordt lokaal opgeslagen.
      - text: TypeScript HTML CSS Nextjs React TailwindCSS Drizzle ORM Better-Auth
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/task-manager-nextjs
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Make24":
        - /url: /covers/make24_cover.png
        - img "Make24 cover"
      - heading "Make24" [level=2]
      - paragraph: Een wiskunde spel waarbij de speler de som van 24 moet maken door alle 4 getallen met operatoren te gebruiken.
      - text: TypeScript CSS HTML React
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/make24
        - img "GitHub logo"
        - text: GitHub
      - link "Bekijk live":
        - /url: https://jefvanzanten.github.io/make24/
        - img "Bekijk live logo"
        - text: Bekijk live
    - article:
      - link "Open screenshot van Portfolio - React":
        - /url: /covers/portfolio_cover.png
        - img "Portfolio - React cover"
      - heading "Portfolio - React" [level=2]
      - paragraph: Mijn persoonlijke, statische, client-side gerenderde website. Het toont een overzicht van mijn openbare GitHub-projecten met korte toelichtingen en links.
      - paragraph: Hoofddoel is het delen van projecten gefilterd op relevante programmeertalen/tech stack.
      - text: TypeScript CSS HTML React React-Router
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/portfolio-react/
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Todo client (mobile)":
        - /url: /covers/todo_client_cover.png
        - img "Todo client (mobile) cover"
      - heading "Todo client (mobile)" [level=2]
      - paragraph: De mobiele app die de Todo REST API gebruikt. Hiermee kunnen gebruikers todo’s aanmaken, bewerken (titel/status aanpassen) en de lijst visueel scheiden op basis van voltooide status.
      - text: TypeScript React-Native Better-Auth TanStack Query
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/TodoRN
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Todo server (REST API)":
        - /url: /covers/express_custom_cover.png
        - img "Todo server (REST API) cover"
      - heading "Todo server (REST API)" [level=2]
      - paragraph: Dit project is mijn eerste zelfgemaakte server en draait nu live sinds mid mei. Het is een REST API met een beveiligde POST endpoint. Hierdoor is het maken van todo’s alleen mogelijk met het juiste account.
      - paragraph: De REST API wordt gebruikt voor de mobile app en de web client.
      - text: TypeScript Express Drizzle ORM Better-Auth
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/todobackend
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van Reeksenspel":
        - /url: /covers/reeksenspel_cover.png
        - img "Reeksenspel cover"
      - heading "Reeksenspel" [level=2]
      - paragraph: Dit is een project waarbij ik heb geprobeerd een spel te maken met React, TypeScript en Tailwind CSS.
      - paragraph: De reeksenspellen zijn bedoeld om het werkgeheugen te trainen door de reeksen te onthouden en de juiste volgorde in te vullen.
      - text: TypeScript CSS HTML React TailwindCSS
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/reeksenspel/
        - img "GitHub logo"
        - text: GitHub
      - link "Bekijk live":
        - /url: https://jefvanzanten.github.io/reeksenspel/
        - img "Bekijk live logo"
        - text: Bekijk live
    - article:
      - 'link "Open screenshot van Schoolproject: OV app (backend)"':
        - /url: /covers/hu_cover.png
        - 'img "Schoolproject: OV app (backend) cover"'
      - 'heading "Schoolproject: OV app (backend)" [level=2]'
      - paragraph: De backend REST API voor de OV-applicatie uit de tweede projectfase. Dit was mijn eerste kennismaking met het bouwen van een REST API (bevat geen POST functionaliteit).
      - text: TypeScript Express Jest
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/ADSD-Fase2-OV-app/tree/main/backend
        - img "GitHub logo"
        - text: GitHub
    - article:
      - 'link "Open screenshot van Schoolproject: OV app (frontend)"':
        - /url: /covers/hu_cover.png
        - 'img "Schoolproject: OV app (frontend) cover"'
      - 'heading "Schoolproject: OV app (frontend)" [level=2]'
      - paragraph: Dit is de frontend van de OV applicatie van het project van de 2e fase. Deze frontend is geoptimaliseerd voor blinde mensen en is volledig toegankelijk.
      - text: TypeScript CSS HTML React
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/ADSD-Fase2-OV-app/tree/main/frontend
        - img "GitHub logo"
        - text: GitHub
    - article:
      - link "Open screenshot van SupplementTracker":
        - /url: /covers/supplement_tracker_cover.png
        - img "SupplementTracker cover"
      - heading "SupplementTracker" [level=2]
      - paragraph: Dit is een van de eerste native Android apps die ik heb gemaakt. Een basis app waarmee je items in een lokale database kan opslaan en kan terugkijken per dag.
      - text: Kotlin Jetpack Compose RoomDB
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/Supplement-Tracker-Android-
        - img "GitHub logo"
        - text: GitHub
    - article:
      - 'link "Open screenshot van Schoolproject: Picit"':
        - /url: /covers/hu_cover.png
        - 'img "Schoolproject: Picit cover"'
      - 'heading "Schoolproject: Picit" [level=2]'
      - paragraph: Dit is het eerste schoolproject waarbij we in teamverband werkten. Gemaakt met Java en JavaFX.
      - paragraph: Met deze applicatie kan de gebruiker fruit in een winkelwagentje plaatsen en de bestelling afronden.
      - text: Java JavaFX
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/ADSD-Fase1-Picit-app
        - img "GitHub logo"
        - text: GitHub
    - article:
      - 'link "Open screenshot van Schoolproject: Fitness app"':
        - /url: /covers/hu_cover.png
        - 'img "Schoolproject: Fitness app cover"'
      - 'heading "Schoolproject: Fitness app" [level=2]'
      - paragraph: Dit is het eerste schoolproject. Een console applicatie voor de gebruikers van een fitnessschool. Ik was tijdens dit project aan het inlezen over design patterns en had besloten voor dit project voor de state pattern te kiezen.
      - paragraph: Met deze applicatie was het de bedoeling dat de gebruiker zijn fitnessschema kon maken en aanpassen. Zo kon je bestaande lijstjes gebruiken of een nieuwe maken.
      - text: Java
      - link "GitHub":
        - /url: https://github.com/jefvanzanten/ADSD-Fase1-Fitness-app
        - img "GitHub logo"
        - text: GitHub
```

# Test source

```ts
  36  |   await expect(page.locator(".carousel-fallback-navigation")).toBeHidden();
  37  | });
  38  | 
  39  | test("projects become a snap carousel with counter navigation on mobile", async ({
  40  |   browser,
  41  | }) => {
  42  |   const context = await browser.newContext({
  43  |     viewport: { width: 390, height: 844 },
  44  |     hasTouch: true,
  45  |     isMobile: true,
  46  |   });
  47  |   const page = await context.newPage();
  48  |   await page.goto("http://localhost:4321/projects");
  49  | 
  50  |   const track = page.locator(".project-container");
  51  |   const items = page.locator("[data-snap-item]");
  52  |   const current = page.locator("[data-snap-current]");
  53  |   const total = page.locator("[data-snap-total]");
  54  |   const previous = page.getByRole("button", { name: "Vorig project" });
  55  |   const next = page.getByRole("button", { name: "Volgend project" });
  56  | 
  57  |   await expect(track).toHaveCSS("display", "flex");
  58  |   await expect(track).toHaveCSS("scroll-snap-type", "x mandatory");
  59  |   await expect(page.locator("[data-snap-marker]")).toHaveCount(0);
  60  |   await expect(current).toHaveText("1");
  61  |   await expect(total).toHaveText(String(await items.count()));
  62  |   await expect(previous).toBeDisabled();
  63  | 
  64  |   await next.tap();
  65  |   await expect(current).toHaveText("2");
  66  |   await expect(previous).toBeEnabled();
  67  | 
  68  |   await context.close();
  69  | });
  70  | 
  71  | test("project filter controls display as compact dropdowns", async ({
  72  |   page,
  73  | }) => {
  74  |   await page.goto("/projects");
  75  | 
  76  |   await expect(page.locator("[data-filter-panel]")).toBeVisible();
  77  |   await expect(page.getByLabel("Categorie", { exact: true })).toHaveCount(1);
  78  |   await expect(page.getByLabel("Programmeertaal", { exact: true })).toHaveCount(
  79  |     1,
  80  |   );
  81  |   await expect(
  82  |     page.getByText("Kies frameworks / libraries", { exact: true }),
  83  |   ).toBeVisible();
  84  |   await expect(page.getByLabel("Zoek framework of library")).toBeHidden();
  85  | 
  86  |   await page.getByText("Kies frameworks / libraries", { exact: true }).click();
  87  |   await expect(page.getByLabel("Zoek framework of library")).toBeVisible();
  88  | 
  89  |   await page.getByLabel("Categorie", { exact: true }).click();
  90  |   await expect(page.getByLabel("Zoek framework of library")).toBeHidden();
  91  | });
  92  | 
  93  | test("mobile filters start closed and toggle from the filter action", async ({
  94  |   browser,
  95  | }) => {
  96  |   const context = await browser.newContext({
  97  |     viewport: { width: 390, height: 844 },
  98  |     hasTouch: true,
  99  |     isMobile: true,
  100 |   });
  101 |   const page = await context.newPage();
  102 |   await page.goto("http://localhost:4321/projects?category=Frontend");
  103 | 
  104 |   const panel = page.locator("[data-filter-panel]");
  105 |   const showFilters = page.getByRole("button", { name: "Toon filters" });
  106 |   await expect(panel).toBeHidden();
  107 |   await expect(showFilters).toBeVisible();
  108 | 
  109 |   await showFilters.tap();
  110 |   await expect(panel).toBeVisible();
  111 | 
  112 |   const hideFilters = page.getByRole("button", { name: "Verberg filters" });
  113 |   await hideFilters.tap();
  114 |   await expect(panel).toBeHidden();
  115 | 
  116 |   await page.getByRole("button", { name: "Toon filters" }).tap();
  117 |   const category = page.getByLabel("Categorie", { exact: true });
  118 |   const menu = page.locator("#project-category-menu");
  119 |   await category.tap();
  120 |   await expect(menu).toBeVisible();
  121 |   await category.tap();
  122 |   await expect(menu).toBeHidden();
  123 | 
  124 |   await context.close();
  125 | });
  126 | 
  127 | test("category and language dynamically limit downstream options", async ({
  128 |   page,
  129 | }) => {
  130 |   await page.goto("/projects");
  131 | 
  132 |   const visibleCards = getVisibleProjectCards(page);
  133 |   const initialCount = await visibleCards.count();
  134 | 
  135 |   await chooseFilterOption(page, "Categorie", "Frontend");
> 136 |   await expect(page).toHaveURL(/category=Frontend/);
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  137 |   await expect(page.locator("#project-language-menu button")).toHaveText([
  138 |     "Alle programmeertalen",
  139 |     "CSS",
  140 |     "HTML",
  141 |     "TypeScript",
  142 |   ]);
  143 |   await expect(
  144 |     page.getByRole("button", { name: /Categorie: Frontend/ }),
  145 |   ).toBeVisible();
  146 |   expect(await visibleCards.count()).toBeLessThan(initialCount);
  147 | 
  148 |   await chooseFilterOption(page, "Programmeertaal", "TypeScript");
  149 |   await expect(page).toHaveURL(/language=TypeScript/);
  150 |   await expect(
  151 |     page.getByRole("button", { name: /Taal: TypeScript/ }),
  152 |   ).toBeVisible();
  153 | });
  154 | 
  155 | test("library dropdown searches, multi-selects, and applies AND filtering", async ({
  156 |   page,
  157 | }) => {
  158 |   await page.goto("/projects");
  159 |   await chooseFilterOption(page, "Categorie", "Fullstack");
  160 |   await chooseFilterOption(page, "Programmeertaal", "TypeScript");
  161 |   await page.getByText("Kies frameworks / libraries", { exact: true }).click();
  162 | 
  163 |   const search = page.getByLabel("Zoek framework of library");
  164 |   await search.fill("eact");
  165 |   await expect(page.getByLabel("React", { exact: true })).toBeVisible();
  166 |   await expect(page.getByLabel("React-Router", { exact: true })).toBeVisible();
  167 |   await expect(page.getByLabel("Hono", { exact: true })).toHaveCount(0);
  168 | 
  169 |   await page.getByLabel("React", { exact: true }).check();
  170 |   await expect(page).toHaveURL(/library=React/);
  171 |   await expect(
  172 |     page.getByRole("button", { name: "React", exact: true }),
  173 |   ).toBeVisible();
  174 | 
  175 |   await search.fill("Hono");
  176 |   await page.getByLabel("Hono", { exact: true }).check();
  177 |   await expect(page).toHaveURL(/library=React.*library=Hono/);
  178 | 
  179 |   const visibleCards = getVisibleProjectCards(page);
  180 |   await expect(visibleCards).toHaveCount(1);
  181 |   await expect(visibleCards.first()).toContainText("React");
  182 |   await expect(visibleCards.first()).toContainText("Hono");
  183 | });
  184 | 
  185 | test("changing an upstream filter removes incompatible filters", async ({
  186 |   page,
  187 | }) => {
  188 |   await page.goto(
  189 |     "/projects?category=Fullstack&language=TypeScript&library=React&library=Hono",
  190 |   );
  191 |   await expect(
  192 |     page.getByRole("button", { name: /Categorie: Fullstack/ }),
  193 |   ).toBeVisible();
  194 |   await expect(
  195 |     page.getByRole("button", { name: "React", exact: true }),
  196 |   ).toBeVisible();
  197 |   await expect(
  198 |     page.getByRole("button", { name: "Hono", exact: true }),
  199 |   ).toBeVisible();
  200 | 
  201 |   await chooseFilterOption(page, "Categorie", "Mobile");
  202 | 
  203 |   await expect(page).toHaveURL(/category=Mobile&language=TypeScript$/);
  204 |   await expect(
  205 |     page.getByRole("button", { name: "React", exact: true }),
  206 |   ).toHaveCount(0);
  207 |   await expect(
  208 |     page.getByRole("button", { name: "Hono", exact: true }),
  209 |   ).toHaveCount(0);
  210 |   await expect(page.getByRole("button", { name: "Reset filters" })).toHaveCount(
  211 |     0,
  212 |   );
  213 | });
  214 | 
```