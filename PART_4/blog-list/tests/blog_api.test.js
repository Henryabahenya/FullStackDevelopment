const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

describe("blog api tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    // Create a default seed user for the blogs to attach to
    const defaultUser = new User({
      username: "testuser",
      passwordHash: "hashedpassword",
    });
    await defaultUser.save();

    // Attach this user ID to your initial seed blogs array
    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: defaultUser._id,
    }));

    await Blog.insertMany(blogsWithUser);
  });

  test("blogs have a unique identifier property named id", async () => {
    const response = await api.get("/api/blogs");
    const firstBlog = response.body[0];

    assert.ok(firstBlog.id);
    assert.strictEqual(firstBlog._id, undefined);
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Async/Await simplifies asynchronous code",
      author: "Henry Abahenya",
      url: "https://fullstackopen.com/",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert.ok(titles.includes("Async/Await simplifies asynchronous code"));
  });

  test("if the likes property is missing, it defaults to 0", async () => {
    const newBlogWithoutLikes = {
      title: "Understanding Default Values in Mongoose",
      author: "Henry Abahenya",
      url: "https://fullstackopen.com/",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("blog without title is not added", async () => {
    const newBlogWithoutTitle = {
      author: "Henry Abahenya",
      url: "https://fullstackopen.com/",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlogWithoutTitle).expect(400);
  });

  test("blog without url is not added", async () => {
    const newBlogWithoutUrl = {
      title: "Testing Missing URL Validation",
      author: "Henry Abahenya",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlogWithoutUrl).expect(400);
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert.ok(!titles.includes(blogToDelete.title));
  });

  test("a blog post can have its likes updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlogData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 10,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10);

    const blogsAtEnd = await helper.blogsInDb();
    const finalBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
    assert.strictEqual(finalBlog.likes, blogToUpdate.likes + 10);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
