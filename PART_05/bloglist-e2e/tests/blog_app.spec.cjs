const { test, expect, beforeEach, describe } = require("@playwright/test");

const BASE_URL = "http://localhost:5173";

// Helper to robustly fill inputs that may be detached/re-rendered briefly.
const stableFill = async (page, selector, value, attempts = 3) => {
  const locator = page.locator(selector);
  for (let i = 0; i < attempts; i++) {
    try {
      // wait longer for visibility to handle slow renders
      await locator.waitFor({ state: "visible", timeout: 5000 });
      await locator.fill(value);
      return;
    } catch (e) {
      if (i === attempts - 1) throw e;
      await page.waitForTimeout(300);
    }
  }
};

const login = async (page, username, password) => {
  await page.goto(`${BASE_URL}/login`);
  await page.locator('input[type="text"]').fill(username);
  await page.locator('input[type="password"]').fill(password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/`);
  await expect(page.getByText("logged in")).toBeVisible();
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "testuser",
        name: "Test User",
        password: "password123",
      },
    });
  });

  test("Login succeeds with the correct username/password combination", async ({
    page,
  }) => {
    await login(page, "testuser", "password123");
    await expect(page.getByText("Test User logged in")).toBeVisible();
  });

  test("Login fails if the username/password is incorrect", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="text"]').fill("testuser");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.getByText("wrong username or password")).toBeVisible();
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await login(page, "testuser", "password123");
      // Wait for a stable logged-in dashboard before proceeding.
      await page.waitForSelector('button:has-text("logout")', {
        state: "visible",
        timeout: 10000,
      });
      await page.waitForSelector('a:has-text("new blog")', {
        state: "visible",
        timeout: 10000,
      });
    });

    test("A logged-in user can create a blog", async ({ page }) => {
      // beforeEach already logged in via UI; open the create page from the dashboard
      await page.goto(`${BASE_URL}/`);
      await page.waitForURL(`${BASE_URL}/`);
      await page.waitForLoadState("networkidle");
      await page.click('a:has-text("new blog")');
      // Ensure the create form is visible and stable before filling inputs
      await page.waitForSelector("#title", { state: "visible", timeout: 5000 });
      await stableFill(page, "#title", "New Router Blog");
      await stableFill(page, "#author", "Router Author");
      await stableFill(page, "#url", "http://testurl.com");

      await page.click('button[type="submit"]');
      await page.goto(`${BASE_URL}/`);
      await expect(
        page
          .getByRole("link", { name: /New Router Blog by Router Author/ })
          .first(),
      ).toBeVisible();
    });

    test("A logged-in user can like blogs", async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await page.waitForURL(`${BASE_URL}/`);
      await page.waitForLoadState("networkidle");
      await page.click('a:has-text("new blog")');
      await page.waitForSelector("#title", { state: "visible", timeout: 5000 });
      await stableFill(page, "#title", "Router Like Blog");
      await stableFill(page, "#author", "Like Tester");
      await stableFill(page, "#url", "http://testurl.com");
      await page.click('button[type="submit"]');
      await page.goto(`${BASE_URL}/`);

      await page
        .getByRole("link", { name: /Router Like Blog/i })
        .first()
        .click();
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/blogs/`));

      await page.click('button:has-text("like")');
      await expect(page.getByText(/likes/i)).toBeVisible();
    });

    test("A logged-in user can delete a blog", async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await page.waitForURL(`${BASE_URL}/`);
      await page.waitForLoadState("networkidle");
      await page.click('a:has-text("new blog")');
      await page.waitForSelector("#title", { state: "visible", timeout: 5000 });
      await stableFill(page, "#title", "Delete Target Blog");
      await stableFill(page, "#author", "Delete Tester");
      await stableFill(page, "#url", "http://testurl.com");
      await page.click('button[type="submit"]');
      await page.goto(`${BASE_URL}/`);

      await page
        .getByRole("link", { name: /Delete Target Blog/i })
        .first()
        .click();
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/blogs/`));

      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });

      await page.click('button:has-text("remove")');
      await page.goto(`${BASE_URL}/`);
      await expect(page.getByText("Delete Target Blog")).not.toBeVisible();
    });
  });
});
