import { useCreateAnecdote } from "../store";
import useNotificationStore from "../notificationStore";

const AnecdoteForm = () => {
  const createAnecdote = useCreateAnecdote();
  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );
  const clearNotification = useNotificationStore(
    (state) => state.clearNotification,
  );

  const handleCreateAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (!content.trim()) {
      return;
    }

    const response = await fetch("http://localhost:3001/anecdotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, votes: 0 }),
    });

    const savedAnecdote = await response.json();
    createAnecdote(savedAnecdote);
    setNotification(`You created '${savedAnecdote.content}'`);
    setTimeout(() => {
      clearNotification();
    }, 5000);
    event.target.anecdote.value = "";
  };

  return (
    <div>
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

export default AnecdoteForm;
