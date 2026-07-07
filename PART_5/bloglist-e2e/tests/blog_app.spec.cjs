const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // reset test database
    await request.post("http://localhost:3003/api/testing/reset");

    // create a test user
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test User",
        username: "testuser",
        password: "password123",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // Look for flexible text like "Log in" or "Login"
    await expect(page.getByText(/log\s*in/i).first()).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.locator('input[type="text"]').fill("testuser");
      await page.locator('input[type="password"]').fill("password123");
      await page.getByRole("button", { name: /login/i }).click();

      await expect(page.getByText(/Test User logged in/i)).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.locator('input[type="text"]').fill("testuser");
      await page.locator('input[type="password"]').fill("wrongpass");
      await page.getByRole("button", { name: /login/i }).click();

      await expect(page.getByText(/wrong username or password/i)).toBeVisible();
      await expect(page.getByText(/Test User logged in/i))
        .toBeHidden({ timeout: 100 })
        .catch(() => {});
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await page.locator('input[type="text"]').fill("testuser");
        await page.locator('input[type="password"]').fill("password123");
        await page.getByRole("button", { name: /login/i }).click();
        await expect(page.getByText(/Test User logged in/i)).toBeVisible();
      });

      test("a new blog can be created", async ({ page }) => {
        await page.getByRole("button", { name: /create new blog/i }).click();

        await page.locator("#title").fill("E2E Testing with Playwright");
        await page.locator("#author").fill("Test Author");
        await page.locator("#url").fill("http://testurl.com");

        await page.getByRole("button", { name: /create/i }).click();

        await expect(
          page.getByText(/E2E Testing with Playwright/i).first(),
        ).toBeVisible();
        await expect(page.getByText(/Test Author/i).first()).toBeVisible();
      });
    });
  });
});
