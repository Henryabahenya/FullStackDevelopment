import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
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

export const useFilter = () => useAnecdoteStore((state) => state.filter);

export const useSetFilter = () => useAnecdoteStore((state) => state.setFilter);
