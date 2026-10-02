import { test, expect } from "@playwright/test";
test("logo is visible", async ({ page }) => {
  await page.goto("http://localhost:5173/MathTestReact/");
  await expect(
    page.getByRole("banner").getByRole("img", { name: "MathTest" }),
  ).toBeVisible();
});
