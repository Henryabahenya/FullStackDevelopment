import { useCreateAnecdoteMutation } from "../hooks/useAnecdoteQueries";
import { useNotificationDispatch } from "../context/NotificationContext";

const AnecdoteForm = () => {
  const newAnecdoteMutation = useCreateAnecdoteMutation();
  const dispatch = useNotificationDispatch();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatch({ type: "SET_NOTIFICATION", payload: `you created '${content}'` });
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
