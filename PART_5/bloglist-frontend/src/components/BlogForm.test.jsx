import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("form calls the event handler it received as props with the right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole("textbox");
  const [titleInput, authorInput, urlInput] = inputs;

  await user.type(titleInput, "Testing React Forms");
  await user.type(authorInput, "Full Stack Developer");
  await user.type(urlInput, "https://fullstackopen.com");

  const submitButton = screen.getByRole("button", { name: "create" });
  await user.click(submitButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Testing React Forms",
    author: "Full Stack Developer",
    url: "https://fullstackopen.com",
  });
});
