import { useEffect } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import { useSetAnecdotes } from "./store";

const App = () => {
  const setAnecdotes = useSetAnecdotes();

  useEffect(() => {
    const fetchAnecdotes = async () => {
      const response = await fetch("http://localhost:3001/anecdotes");
      const data = await response.json();
      setAnecdotes(data);
    };

    fetchAnecdotes();
  }, [setAnecdotes]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
