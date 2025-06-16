import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders form fields and sign-in button", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("shows validation message for short passwords", async ({ page }) => {
    await page.getByPlaceholder("Enter your email").fill("test@example.com");
    await page.getByPlaceholder("Enter your password").fill("123");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.locator("text=Password must be at least 6 characters.")
    ).toBeVisible();
  });

  test("remembers email when checkbox is checked", async ({ page }) => {
    const emailField = page.getByPlaceholder("Enter your email");

    await emailField.fill("rememberme@example.com");
    await page.getByPlaceholder("Enter your password").fill("securepass");
    await page.check('input[type="checkbox"]#remember');
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.reload();

    await expect(emailField).toHaveValue("rememberme@example.com");
  });

  test("does not remember email when checkbox is not checked", async ({
    page,
  }) => {
    const emailField = page.getByPlaceholder("Enter your email");

    await emailField.fill("forgetme@example.com");
    await page.getByPlaceholder("Enter your password").fill("securepass");
    await page.uncheck('input[type="checkbox"]#remember');
    await page.getByRole("button", { name: "Sign In" }).click();

    // Simulate page reload
    await page.reload();

    await expect(emailField).toHaveValue("");
  });
});
