import { create } from "zustand";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  voteAnecdote: (id) =>
    set((state) => ({
      anecdotes: state.anecdotes.map((anecdote) =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote,
      ),
    })),
  createAnecdote: (content) =>
    set((state) => ({
      anecdotes: state.anecdotes.concat(asObject(content)),
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
