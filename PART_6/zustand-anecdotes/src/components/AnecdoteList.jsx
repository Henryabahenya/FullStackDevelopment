import { useAnecdotes, useVoteAnecdote, useFilter } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const voteAnecdote = useVoteAnecdote();
  const filter = useFilter();

  const vote = async (id) => {
    const anecdote = anecdotes.find((a) => a.id === id);
    if (!anecdote) {
      return;
    }

    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };

    const response = await fetch(`http://localhost:3001/anecdotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAnecdote),
    });

    const savedAnecdote = await response.json();
    voteAnecdote(savedAnecdote);
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
