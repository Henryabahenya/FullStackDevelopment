const { test, expect, describe, beforeEach } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
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
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
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
      await expect(page.getByText(/logged in/i).first()).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
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
        await page
          .getByPlaceholder("title")
          .fill("E2E Testing with Playwright");
        await page.getByPlaceholder("author").fill("Test Author");
        await page.getByPlaceholder("url").fill("http://testurl.com");
      } else {
        await inputs.nth(0).fill("E2E Testing with Playwright");
        await inputs.nth(1).fill("Test Author");
        await inputs.nth(2).fill("http://testurl.com");
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

      // Use the same scoped filter approach as the delete test
      const blogElement = page
        .locator("div")
        .filter({ hasText: /^Liking E2E Post/ })
        .first();

      // Expand details
      await blogElement.getByRole("button", { name: /view/i }).click();

      // Get initial like count
      const likesLocator = blogElement.getByText(/likes/i).first();
      const likesText = await likesLocator.textContent();
      const initialLikes = parseInt(likesText.match(/\d+/)[0], 10);

      // Click like button
      const likeBtn = blogElement
        .getByRole("button", { name: /like/i })
        .first();
      await likeBtn.waitFor({ state: "visible", timeout: 10000 });
      await likeBtn.click();

      // Verify the like count increased by 1
      await expect(likesLocator).toHaveText(
        new RegExp(`likes[:\\s]*${initialLikes + 1}`, "i"),
        { timeout: 10000 },
      );
    });

    test("blogs are arranged in the order of most likes first", async ({
      page,
      request,
    }) => {
      const loginResponse = await request.post(
        "http://localhost:3003/api/login",
        {
          data: {
            username: "testuser",
            password: "password123",
          },
        },
      );
      const loginData = await loginResponse.json();
      const token = loginData.token;

      const createBlog = async (title, author, url, likes = 0) => {
        await request.post("http://localhost:3003/api/blogs", {
          data: { title, author, url, likes },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      };

      await createBlog(
        "Blog with zero likes",
        "Test Author",
        "http://zero.com",
        0,
      );
      await createBlog(
        "Blog with three likes",
        "Test Author",
        "http://three.com",
        3,
      );
      await createBlog(
        "Blog with one like",
        "Test Author",
        "http://one.com",
        1,
      );

      await page.goto("http://localhost:5173");
      await expect(page.getByText(/Blog with zero likes/i).first()).toBeVisible(
        {
          timeout: 10000,
        },
      );

      const titleDivs = page.locator(
        'xpath=//div[div[starts-with(normalize-space(.), "Blog with three likes Test Author")] or div[starts-with(normalize-space(.), "Blog with one like Test Author")] or div[starts-with(normalize-space(.), "Blog with zero likes Test Author")]]',
      );
      const orderedTitles = [];
      const titleCount = await titleDivs.count();
      for (let i = 0; i < titleCount; i += 1) {
        const text = await titleDivs.nth(i).textContent();
        if (!text) continue;

        if (
          text.includes("Blog with three likes") &&
          !orderedTitles.includes("Blog with three likes")
        ) {
          orderedTitles.push("Blog with three likes");
        } else if (
          text.includes("Blog with one like") &&
          !orderedTitles.includes("Blog with one like")
        ) {
          orderedTitles.push("Blog with one like");
        } else if (
          text.includes("Blog with zero likes") &&
          !orderedTitles.includes("Blog with zero likes")
        ) {
          orderedTitles.push("Blog with zero likes");
        }
      }

      expect(orderedTitles).toEqual([
        "Blog with three likes",
        "Blog with one like",
        "Blog with zero likes",
      ]);
    });

    test("only the user who created the blog sees the delete button", async ({
      page,
      request,
    }) => {
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
        await page
          .getByPlaceholder("title")
          .fill("Authorized Delete Only Blog");
        await page.getByPlaceholder("author").fill("Test Author");
        await page.getByPlaceholder("url").fill("http://testurl.com");
      } else {
        await inputs.nth(0).fill("Authorized Delete Only Blog");
        await inputs.nth(1).fill("Test Author");
        await inputs.nth(2).fill("http://testurl.com");
      }

      await page
        .getByRole("button", { name: /create|submit/i })
        .first()
        .click();

      const blogElement = page
        .locator("div")
        .filter({ hasText: /^Authorized Delete Only Blog/ })
        .first();
      await blogElement.getByRole("button", { name: /view/i }).click();

      await page.getByRole("button", { name: /logout/i }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Second User",
          username: "seconduser",
          password: "password123",
        },
      });

      await page.locator('input[type="text"]').first().fill("seconduser");
      await page.locator('input[type="password"]').fill("password123");
      await page.getByRole("button", { name: /login/i }).click();
      await expect(page.getByText(/logged in/i).first()).toBeVisible();

      const secondUserBlogElement = page
        .locator("div")
        .filter({ hasText: /^Authorized Delete Only Blog/ })
        .first();
      await secondUserBlogElement
        .getByRole("button", { name: /view/i })
        .click();

      const deleteButton = secondUserBlogElement
        .locator("button")
        .filter({ hasText: /delete|remove/i })
        .first();
      await expect(deleteButton).toBeHidden();
    });

    test("a blog can be deleted by the user who created it", async ({
      page,
    }) => {
      // 1. Create a blog specifically for deletion
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
        await page.getByPlaceholder("title").fill("Blog to be deleted");
        await page.getByPlaceholder("author").fill("Delete Author");
        await page.getByPlaceholder("url").fill("http://deleteurl.com");
      } else {
        await inputs.nth(0).fill("Blog to be deleted");
        await inputs.nth(1).fill("Delete Author");
        await inputs.nth(2).fill("http://deleteurl.com");
      }
      await page
        .getByRole("button", { name: /create|submit/i })
        .first()
        .click();

      // 2. Ensure it is rendered on screen
      const blogTitle = page.getByText("Blog to be deleted").first();
      await expect(blogTitle).toBeVisible();

      // 3. Setup the dialog listener BEFORE clicking delete to automatically accept window.confirm
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });

      // 4. Find the specific container for this blog to avoid strict mode issues
      const blogElement = page
        .locator("div")
        .filter({ hasText: /^Blog to be deleted/ })
        .first();

      // 5. Expand details
      await blogElement.getByRole("button", { name: /view/i }).click();

      // 6. Find and click the delete/remove button inside this blog container
      const deleteButton = blogElement
        .locator("button")
        .filter({ hasText: /delete|remove|remove/i })
        .first();
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      // 7. Verify that the blog is no longer present on the page
      await expect(page.getByText(/^Blog to be deleted$/)).toHaveCount(0);
    });
  });
});
