import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../App";

const mockAnecdotes = [
  {
    content: "React is awesome",
    id: "1",
    votes: 3,
  },
  {
    content: "Redux is great",
    id: "2",
    votes: 1,
  },
  {
    content: "Zustand is light",
    id: "3",
    votes: 2,
  },
];

describe("Anecdotes filter", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockAnecdotes),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("filters anecdotes based on text input", async () => {
    render(<App />);

    expect(await screen.findByText(/React is awesome/i)).toBeTruthy();
    expect(await screen.findByText(/Redux is great/i)).toBeTruthy();
    expect(await screen.findByText(/Zustand is light/i)).toBeTruthy();

    const inputs = screen.getAllByRole("textbox");
    const filterInput = inputs[0];
    fireEvent.change(filterInput, { target: { value: "React" } });

    expect(screen.getByText(/React is awesome/i)).toBeTruthy();
    expect(screen.queryByText(/Redux is great/i)).toBeNull();
    expect(screen.queryByText(/Zustand is light/i)).toBeNull();
  });
});
