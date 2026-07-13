import {
  useAnecdotesQuery,
  useVoteAnecdoteMutation,
} from "./hooks/useAnecdoteQueries";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./context/NotificationContext";

const App = () => {
  const result = useAnecdotesQuery();
  const updateAnecdoteMutation = useVoteAnecdoteMutation();
  const dispatch = useNotificationDispatch();

  if (result.isPending) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch({
      type: "SET_NOTIFICATION",
      payload: `you voted '${anecdote.content}'`,
    });
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  };

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />

      <AnecdoteForm />

      <div>
        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
