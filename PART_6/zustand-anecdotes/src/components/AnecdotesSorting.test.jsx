import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "../App";

const mockAnecdotes = [
  {
    content: "Medium votes anecdote",
    id: "2",
    votes: 2,
  },
  {
    content: "Highest votes anecdote",
    id: "1",
    votes: 10,
  },
  {
    content: "Zero votes anecdote",
    id: "3",
    votes: 0,
  },
];

describe("Anecdotes sorting", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockAnecdotes),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("renders anecdotes sorted by vote count descending", async () => {
    render(<App />);

    const voteNodes = await screen.findAllByText(/has \d+/i);
    const voteCounts = voteNodes.map((node) => {
      const match = node.textContent.match(/\d+/);
      return match ? parseInt(match[0], 10) : NaN;
    });

    expect(voteCounts).toEqual([10, 2, 0]);
  });
});
