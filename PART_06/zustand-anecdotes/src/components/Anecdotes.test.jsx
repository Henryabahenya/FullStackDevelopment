import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "../App";

const mockAnecdotes = [
  {
    content: "If it hurts, do it more often",
    id: "47145",
    votes: 0,
  },
  {
    content: "Adding manpower to a late software project makes it later!",
    id: "21149",
    votes: 0,
  },
];

describe("Anecdotes App", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockAnecdotes),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("initializes anecdotes from the backend on startup", async () => {
    render(<App />);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/anecdotes",
    );

    expect(
      await screen.findByText(/If it hurts, do it more often/i),
    ).toBeTruthy();
    expect(
      await screen.findByText(
        /Adding manpower to a late software project makes it later!/i,
      ),
    ).toBeTruthy();
  });
});
