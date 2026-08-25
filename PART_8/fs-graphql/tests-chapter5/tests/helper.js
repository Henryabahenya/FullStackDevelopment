const GRAPHQL_URL = "http://localhost:4000";

const TEST_USER = { username: "testuser", favoriteGenre: "refactoring" };
const TEST_PASSWORD = "secret";

const initialBooks = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
];

const gql = async (request, query, variables, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await request.post(GRAPHQL_URL, {
    data: { query, variables },
    headers,
  });
  return response.json();
};

const seedDatabase = async (request) => {
  try {
    await gql(request, "mutation { _resetDatabase }");
  } catch (error) {
    try {
      await request.post(`${GRAPHQL_URL}/testing/reset`);
    } catch (resetError) {
      // ignore if test route doesn't exist; reset mutation should work in the real backend
    }
  }

  await gql(
    request,
    `mutation($username: String!, $favoriteGenre: String!, $password: String!) {
      createUser(username: $username, favoriteGenre: $favoriteGenre, password: $password) { id }
    }`,
    {
      username: TEST_USER.username,
      favoriteGenre: TEST_USER.favoriteGenre,
      password: TEST_PASSWORD,
    },
  );

  const loginResult = await gql(
    request,
    `mutation($username: String!, $password: String!) {
      login(username: $username, password: $password) { value }
    }`,
    { username: TEST_USER.username, password: TEST_PASSWORD },
  );
  const token = loginResult.data.login.value;

  for (const book of initialBooks) {
    await gql(
      request,
      `mutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) { id }
      }`,
      book,
      token,
    );
  }

  const authorBirthYears = [
    { name: "Robert Martin", setBornTo: 1952 },
    { name: "Martin Fowler", setBornTo: 1963 },
    { name: "Fyodor Dostoevsky", setBornTo: 1821 },
  ];

  for (const author of authorBirthYears) {
    await gql(
      request,
      `mutation($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) { id }
      }`,
      author,
      token,
    );
  }
};

const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "login" }).first().click();

  const form = page.locator("form").last();
  await form.waitFor({ state: "visible" });

  const usernameInput = form.locator("input").first();
  await usernameInput.fill(username);

  const passwordInput = form.locator("input").nth(1);
  await passwordInput.fill(password);

  await form.getByRole("button", { name: "login" }).click();
};

const createBook = async (page, { title, author, published, genres }) => {
  await page.getByRole("button", { name: "add book" }).click();

  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill(author);
  await page.getByLabel("published").fill(String(published));

  for (const genre of genres) {
    await page.getByLabel("genre").fill(genre);
    await page.getByRole("button", { name: "add genre" }).click();
  }

  await page.getByRole("button", { name: "create book" }).click();

  // Wait for form to reset (title input to be empty), indicating mutation completed
  await page.getByLabel("title").waitFor({ state: "attached" });
  await page.waitForTimeout(500);
};

module.exports = { GRAPHQL_URL, loginWith, createBook, seedDatabase };
