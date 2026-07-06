import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("renders URL and number of likes when the view button is clicked", async () => {
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
  const user = userEvent.setup();

  const button = screen.getByText(/view/i);
  await user.click(button);

  expect(screen.getByText(blog.url)).toBeInTheDocument();
  expect(screen.getByText(/likes 10/i)).toBeInTheDocument();
});
