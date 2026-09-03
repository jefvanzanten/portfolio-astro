import { expect, test } from "@playwright/test";

/**
 * Returns project cards that are currently visible.
 *
 * @param page - Active Playwright page.
 * @returns Locator for visible project cards.
 */
function getVisibleProjectCards(page: import("@playwright/test").Page) {
  return page.locator("[data-project-card]:visible");
}

/**
 * Opens a project filter and selects one of its options.
 *
 * @param page - Active Playwright page.
 * @param filterLabel - Accessible label of the filter trigger.
 * @param option - Exact option text to select.
 * @returns Promise that resolves after selecting the option.
 */
async function chooseFilterOption(
  page: import("@playwright/test").Page,
  filterLabel: string,
  option: string,
): Promise<void> {
  await page.getByLabel(filterLabel, { exact: true }).click();
  await page.getByRole("button", { name: option, exact: true }).click();
}

test("project filter controls display as compact dropdowns", async ({
  page,
}) => {
  await page.goto("/projects");

  await expect(page.locator("[data-filter-panel]")).toBeVisible();
  await expect(page.getByLabel("Categorie", { exact: true })).toHaveCount(1);
  await expect(page.getByLabel("Programmeertaal", { exact: true })).toHaveCount(
    1,
  );
  await expect(
    page.getByText("Kies frameworks / libraries", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Zoek framework of library")).toBeHidden();

  await page.getByText("Kies frameworks / libraries", { exact: true }).click();
  await expect(page.getByLabel("Zoek framework of library")).toBeVisible();

  await page.getByLabel("Categorie", { exact: true }).click();
  await expect(page.getByLabel("Zoek framework of library")).toBeHidden();
});

test("mobile filters start closed and toggle from the filter action", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4321/projects?category=Frontend");

  const panel = page.locator("[data-filter-panel]");
  const showFilters = page.getByRole("button", { name: "Toon filters" });
  await expect(panel).toBeHidden();
  await expect(showFilters).toBeVisible();

  await showFilters.tap();
  await expect(panel).toBeVisible();

  const hideFilters = page.getByRole("button", { name: "Verberg filters" });
  await hideFilters.tap();
  await expect(panel).toBeHidden();

  await page.getByRole("button", { name: "Toon filters" }).tap();
  const category = page.getByLabel("Categorie", { exact: true });
  const menu = page.locator("#project-category-menu");
  await category.tap();
  await expect(menu).toBeVisible();
  await category.tap();
  await expect(menu).toBeHidden();

  await context.close();
});

test("category and language dynamically limit downstream options", async ({
  page,
}) => {
  await page.goto("/projects");

  const visibleCards = getVisibleProjectCards(page);
  const initialCount = await visibleCards.count();

  await chooseFilterOption(page, "Categorie", "Frontend");
  await expect(page).toHaveURL(/category=Frontend/);
  await expect(page.locator("#project-language-menu button")).toHaveText([
    "Alle programmeertalen",
    "CSS",
    "HTML",
    "TypeScript",
  ]);
  await expect(
    page.getByRole("button", { name: /Categorie: Frontend/ }),
  ).toBeVisible();
  expect(await visibleCards.count()).toBeLessThan(initialCount);

  await chooseFilterOption(page, "Programmeertaal", "TypeScript");
  await expect(page).toHaveURL(/language=TypeScript/);
  await expect(
    page.getByRole("button", { name: /Taal: TypeScript/ }),
  ).toBeVisible();
});

test("library dropdown searches, multi-selects, and applies AND filtering", async ({
  page,
}) => {
  await page.goto("/projects");
  await chooseFilterOption(page, "Categorie", "Fullstack");
  await chooseFilterOption(page, "Programmeertaal", "TypeScript");
  await page.getByText("Kies frameworks / libraries", { exact: true }).click();

  const search = page.getByLabel("Zoek framework of library");
  await search.fill("eact");
  await expect(page.getByLabel("React", { exact: true })).toBeVisible();
  await expect(page.getByLabel("React-Router", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Hono", { exact: true })).toHaveCount(0);

  await page.getByLabel("React", { exact: true }).check();
  await expect(page).toHaveURL(/library=React/);
  await expect(
    page.getByRole("button", { name: "React", exact: true }),
  ).toBeVisible();

  await search.fill("Hono");
  await page.getByLabel("Hono", { exact: true }).check();
  await expect(page).toHaveURL(/library=React.*library=Hono/);

  const visibleCards = getVisibleProjectCards(page);
  await expect(visibleCards).toHaveCount(1);
  await expect(visibleCards.first()).toContainText("React");
  await expect(visibleCards.first()).toContainText("Hono");
});

test("changing an upstream filter removes incompatible filters", async ({
  page,
}) => {
  await page.goto(
    "/projects?category=Fullstack&language=TypeScript&library=React&library=Hono",
  );
  await expect(
    page.getByRole("button", { name: /Categorie: Fullstack/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "React", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Hono", exact: true }),
  ).toBeVisible();

  await chooseFilterOption(page, "Categorie", "Mobile");

  await expect(page).toHaveURL(/category=Mobile&language=TypeScript$/);
  await expect(
    page.getByRole("button", { name: "React", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Hono", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reset filters" })).toHaveCount(
    0,
  );
});
