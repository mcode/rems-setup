import { test, expect } from "@playwright/test";

// Smoke test to ensure GUI is actually up and running.

test("checks if a page is visible at localhost:3000", async ({ page }) => {
  await page.goto("localhost:3000");
  await expect(page).toHaveTitle(/EHR/);
});
