import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders title and author, but does not render URL or likes by default", () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "https://example.com",
    likes: 10,
    user: {
      username: "testuser",
      name: "Test User",
      id: "user123",
    },
  };

  render(<Blog blog={blog} />);

  expect(screen.getByText(/Test Title Test Author/i)).toBeDefined();
  expect(screen.queryByText(blog.url)).toBeNull();
  expect(screen.queryByText(/likes 10/i)).toBeNull();
});
