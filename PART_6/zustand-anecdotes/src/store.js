import { create } from "zustand";

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  voteAnecdote: (updatedAnecdote) =>
    set((state) => ({
      anecdotes: state.anecdotes.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote,
      ),
    })),
  createAnecdote: (anecdote) =>
    set((state) => ({
      anecdotes: state.anecdotes.concat(anecdote),
    })),
  setAnecdotes: (anecdotes) =>
    set(() => ({
      anecdotes,
    })),
  setFilter: (query) =>
    set(() => ({
      filter: query,
    })),
}));

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);

export const useVoteAnecdote = () =>
  useAnecdoteStore((state) => state.voteAnecdote);

export const useCreateAnecdote = () =>
  useAnecdoteStore((state) => state.createAnecdote);

export const useSetAnecdotes = () =>
  useAnecdoteStore((state) => state.setAnecdotes);

export const useFilter = () => useAnecdoteStore((state) => state.filter);

export const useSetFilter = () => useAnecdoteStore((state) => state.setFilter);
