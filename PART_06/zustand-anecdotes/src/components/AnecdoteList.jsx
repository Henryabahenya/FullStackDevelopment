import {
  useAnecdotes,
  useVoteAnecdote,
  useFilter,
  useRemoveAnecdote,
} from "../store";
import useNotificationStore from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const voteAnecdote = useVoteAnecdote();
  const removeAnecdote = useRemoveAnecdote();
  const filter = useFilter();
  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );
  const clearNotification = useNotificationStore(
    (state) => state.clearNotification,
  );

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
    setNotification(`You voted '${savedAnecdote.content}'`);
    setTimeout(() => {
      clearNotification();
    }, 5000);
  };

  const handleDelete = async (anecdote) => {
    await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
      method: "DELETE",
    });

    removeAnecdote(anecdote.id);
    setNotification(`You deleted '${anecdote.content}'`);
    setTimeout(() => {
      clearNotification();
    }, 5000);
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
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
