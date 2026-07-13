import { useAnecdotes, useVoteAnecdote } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const voteAnecdote = useVoteAnecdote();

  const vote = (id) => {
    voteAnecdote(id);
  };

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

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
