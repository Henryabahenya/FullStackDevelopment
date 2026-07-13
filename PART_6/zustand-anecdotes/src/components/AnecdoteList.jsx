import { useAnecdotes, useVoteAnecdote, useFilter } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const voteAnecdote = useVoteAnecdote();
  const filter = useFilter();

  const vote = (id) => {
    voteAnecdote(id);
  };

  const filteredAnecdotes = anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase()),
  );

  const sortedAnecdotes = filteredAnecdotes.toSorted(
    (a, b) => b.votes - a.votes,
  );

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
