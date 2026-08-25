import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";
import blogService from "./services/blogs";

vi.mock("./services/blogs", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    setToken: vi.fn(),
  },
}));

const sampleBlog = {
  id: "1",
  title: "Test Blog",
  author: "Jane Doe",
  url: "http://example.com",
  likes: 7,
  user: {
    id: "user-1",
    username: "jane",
    name: "Jane Doe",
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  blogService.getAll.mockResolvedValue([sampleBlog]);
});

afterEach(() => {
  window.localStorage.clear();
});

describe("Blog detail view", () => {
  it("shows blog information and likes count for unauthenticated users without buttons", async () => {
    render(
      <MemoryRouter initialEntries={["/blogs/1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Blog by Jane Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("http://example.com")).toBeInTheDocument();
    expect(screen.getByText("likes 7")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /like/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("shows only the like button for authenticated users who are not the creator", async () => {
    window.localStorage.setItem(
      "loggedBlogappUser",
      JSON.stringify({
        username: "otheruser",
        name: "Other User",
        token: "fake-token",
      }),
    );

    render(
      <MemoryRouter initialEntries={["/blogs/1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Blog by Jane Doe")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("shows both like and remove buttons for the blog creator", async () => {
    window.localStorage.setItem(
      "loggedBlogappUser",
      JSON.stringify({
        username: "jane",
        name: "Jane Doe",
        token: "fake-token",
      }),
    );

    render(
      <MemoryRouter initialEntries={["/blogs/1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Blog by Jane Doe")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });
});
