import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

const initialAnecdotes = [
  {
    content: "Testing is vital",
    id: "1",
    votes: 0,
  },
];

const updatedAnecdote = {
  content: "Testing is vital",
  id: "1",
  votes: 1,
};

describe("Anecdotes vote", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          json: () => Promise.resolve(initialAnecdotes),
        });
      }

      if (options.method === "PUT" || options.method === "PATCH") {
        return Promise.resolve({
          json: () => Promise.resolve(updatedAnecdote),
        });
      }

      return Promise.resolve({
        json: () => Promise.resolve(initialAnecdotes),
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("increments vote count when the vote button is clicked", async () => {
    render(<App />);

    expect(await screen.findByText(/Testing is vital/i)).toBeTruthy();
    expect(await screen.findByText(/has 0/i)).toBeTruthy();

    const voteButton = screen.getByRole("button", { name: /vote/i });
    fireEvent.click(voteButton);

    expect(await screen.findByText(/has 1/i)).toBeTruthy();
  });
});
