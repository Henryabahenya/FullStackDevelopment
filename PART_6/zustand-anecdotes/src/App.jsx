import { useAnecdotes, useVoteAnecdote, useCreateAnecdote } from "./store";

const App = () => {
  const anecdotes = useAnecdotes();
  const voteAnecdote = useVoteAnecdote();
  const createAnecdote = useCreateAnecdote();

  const vote = (id) => {
    voteAnecdote(id);
  };

  const handleCreateAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content.trim()) {
      createAnecdote(content);
      event.target.anecdote.value = "";
    }
  };

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={handleCreateAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default App;
