const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Empty the DB
    await request.post("http://localhost:3003/api/testing/reset");
    // Create a backend user
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
    await expect(page.getByText(/log\s*in/i).first()).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.locator('input[type="text"]').first().fill("testuser");
      await page.locator('input[type="password"]').fill("password123");
      await page.getByRole("button", { name: /login/i }).click();

      await expect(page.getByText(/logged in/i).first()).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.locator('input[type="text"]').first().fill("testuser");
      await page.locator('input[type="password"]').fill("wrongpass");
      await page.getByRole("button", { name: /login/i }).click();

      await expect(page.getByText(/wrong|invalid/i).first()).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[type="text"]').first().fill("testuser");
      await page.locator('input[type="password"]').fill("password123");
      await page.getByRole("button", { name: /login/i }).click();
      // Ensure the UI reflects the login state before proceeding
      await expect(page.getByText(/logged in/i).first()).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await page
        .getByRole("button", { name: /new blog|create|add/i })
        .first()
        .click();

      // FIX: Use sequential index or placeholders to safely target inputs
      const inputs = page.locator('input[type="text"]');

      // If your page has multiple inputs, let's look for matching placeholders first, falling back to layout index
      if (
        await page
          .getByPlaceholder("title")
          .isVisible()
          .catch(() => false)
      ) {
        await page
          .getByPlaceholder("title")
          .fill("E2E Testing with Playwright");
        await page.getByPlaceholder("author").fill("Test Author");
        await page.getByPlaceholder("url").fill("http://testurl.com");
      } else {
        // Fallback: Fill inputs in order of appearance within the creation form area
        await inputs.nth(0).fill("E2E Testing with Playwright"); // title field
        await inputs.nth(1).fill("Test Author"); // author field
        await inputs.nth(2).fill("http://testurl.com"); // url field
      }

      await page
        .getByRole("button", { name: /create|submit/i })
        .first()
        .click();

      await expect(
        page.getByText(/E2E Testing with Playwright/i).first(),
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page
        .getByRole("button", { name: /new blog|create|add/i })
        .first()
        .click();

      const inputs = page.locator('input[type="text"]');
      if (
        await page
          .getByPlaceholder("title")
          .isVisible()
          .catch(() => false)
      ) {
        await page.getByPlaceholder("title").fill("Liking E2E Post");
        await page.getByPlaceholder("author").fill("Test Author");
        await page.getByPlaceholder("url").fill("http://testurl.com");
      } else {
        await inputs.nth(0).fill("Liking E2E Post");
        await inputs.nth(1).fill("Test Author");
        await inputs.nth(2).fill("http://testurl.com");
      }

      await page
        .getByRole("button", { name: /create|submit/i })
        .first()
        .click();

      // Find the specific blog's view button by scanning all view buttons
      const title = "Liking E2E Post";
      // Alternative: find the title node(s) and locate the nearest ancestor blog container that has a view button
      const titles = page.getByText(title);
      const tCount = await titles.count();
      let liked = false;
      for (let i = 0; i < tCount; i++) {
        const t = titles.nth(i);
        // find an ancestor div that contains a view button
        const container = t
          .locator("xpath=ancestor::div[.//button[contains(., 'view')]]")
          .first();
        if ((await container.count()) === 0) continue;
        // click view within that container
        await container.getByRole("button", { name: /view/i }).first().click();
        // find like button inside the same container
        const likeBtn = container
          .getByRole("button", { name: /like/i })
          .first();
        try {
          await likeBtn.waitFor({ state: "visible", timeout: 10000 });
          await likeBtn.click();
          await expect(container).toContainText("1");
          liked = true;
          break;
        } catch (e) {
          // try next match
        }
      }
      if (!liked) throw new Error('Could not like the blog "' + title + '"');
    });
  });
});
