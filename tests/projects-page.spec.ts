import { expect, test } from "@playwright/test";

const getVisibleProjectCards = (page: import("@playwright/test").Page) =>
  page.locator("[data-project-card]:visible");

test("projects filters toggle and layout work", async ({ page }) => {
  await page.goto("/projects");

  const toggle = page.getByRole("button", { name: /verberg filters|toon filters/i });
  const panel = page.locator("[data-filter-panel]");

  await expect(toggle).toBeVisible();
  await expect(panel).toBeVisible();

  await toggle.click();
  await expect(panel).toBeHidden();
  await expect(toggle).toHaveText("Toon filters");

  await toggle.click();
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveText("Verberg filters");

  const groups = page.locator(".filter-group");
  await expect(groups).toHaveCount(3);

  const boxes = await groups.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    }),
  );

  expect(boxes[0].height).toBe(boxes[1].height);
  expect(boxes[1].height).toBe(boxes[2].height);
  expect(boxes[2].width).toBeGreaterThan(boxes[1].width);
  expect(boxes[1].width).toBeGreaterThan(boxes[0].width);

  const libraryOptionXs = await page
    .locator(".filter-options-libraries .filter-option")
    .evaluateAll((elements) => {
      const rounded = (value: number) => Math.round(value);
      return [...new Set(elements.map((element) => rounded(element.getBoundingClientRect().left)))];
    });

  expect(libraryOptionXs.length).toBeGreaterThanOrEqual(3);
});

test("projects filters change the visible project set", async ({ page }) => {
  await page.goto("/projects");

  const visibleCards = getVisibleProjectCards(page);
  const initialCount = await visibleCards.count();
  expect(initialCount).toBeGreaterThan(0);

  await page.locator('input[name="category"][value="Frontend"]').check();

  const frontendCount = await visibleCards.count();
  expect(frontendCount).toBeGreaterThan(0);
  expect(frontendCount).toBeLessThan(initialCount);

  const frontendCategories = await visibleCards.evaluateAll((elements) =>
    elements.map((element) => (element as HTMLElement).dataset.category),
  );

  expect(frontendCategories.every((category) => category === "Frontend")).toBe(
    true,
  );

  await page.locator('input[name="language"][value="TypeScript"]').check();

  const frontendTypeScriptCards = await visibleCards.evaluateAll((elements) =>
    elements.map((element) => {
      const card = element as HTMLElement;
      return {
        category: card.dataset.category,
        languages: (card.dataset.languages ?? "").split(",").filter(Boolean),
      };
    }),
  );

  expect(frontendTypeScriptCards.length).toBeGreaterThan(0);
  expect(
    frontendTypeScriptCards.every(
      (card) =>
        card.category === "Frontend" &&
        card.languages.includes("TypeScript"),
    ),
  ).toBe(true);

  await page.locator('input[name="category"][value="Frontend"]').uncheck();
  await page.locator('input[name="language"][value="TypeScript"]').uncheck();

  await expect(visibleCards).toHaveCount(initialCount);
});
