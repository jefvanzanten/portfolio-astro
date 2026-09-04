# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects-page.spec.ts >> mobile filters start closed and toggle from the filter action
- Location: tests/projects-page.spec.ts:93:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('[data-filter-panel]')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-filter-panel]')
    14 × locator resolved to <form data-open="false" data-filter-panel="" id="project-filter-panel" class="filter-form svelte-k6wpgr">…</form>
       - unexpected value "hidden"

```

```yaml
- main:
  - navigation:
    - button "Menu"
    - link "JEFVANZANTEN.DEV":
      - /url: /
    - link "Projecten":
      - /url: /projects
    - link "Projecten":
      - /url: /projects
    - link "Contact":
      - /url: /contact
  - button "Toon filters"
  - 'button "Categorie: Frontend"'
  - region "Projecten":
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
  - navigation "Kies een project":
    - button "Vorig project" [disabled]: <
    - text: 1/6
    - button "Volgend project": ">"
```

# Test source

```ts
  10  |   return page.locator("[data-project-card]:visible");
  11  | }
  12  | 
  13  | /**
  14  |  * Opens a project filter and selects one of its options.
  15  |  *
  16  |  * @param page - Active Playwright page.
  17  |  * @param filterLabel - Accessible label of the filter trigger.
  18  |  * @param option - Exact option text to select.
  19  |  * @returns Promise that resolves after selecting the option.
  20  |  */
  21  | async function chooseFilterOption(
  22  |   page: import("@playwright/test").Page,
  23  |   filterLabel: string,
  24  |   option: string,
  25  | ): Promise<void> {
  26  |   await page.getByLabel(filterLabel, { exact: true }).click();
  27  |   await page.getByRole("button", { name: option, exact: true }).click();
  28  | }
  29  | 
  30  | test("projects keep their desktop grid without carousel controls", async ({
  31  |   page,
  32  | }) => {
  33  |   await page.goto("/projects");
  34  | 
  35  |   await expect(page.locator(".project-container")).toHaveCSS("display", "grid");
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
> 110 |   await expect(panel).toBeVisible();
      |                       ^ Error: expect(locator).toBeVisible() failed
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
  136 |   await expect(page).toHaveURL(/category=Frontend/);
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
```