import { useApolloClient, useQuery } from "@apollo/client/react";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import Notify from "./components/Notify";
import { ALL_BOOKS, ALL_AUTHORS } from "./queries";
import Books from "./components/Books";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const result = useQuery(ALL_BOOKS);
  const authorsResult = useQuery(ALL_AUTHORS);
  const client = useApolloClient();

  if (result.loading || authorsResult.loading) {
    return <div>Loading library...</div>;
  }

  if (result.error) {
    return <div>Error loading books: {result.error.message}</div>;
  }

  if (authorsResult.error) {
    return <div>Error loading authors: {authorsResult.error.message}</div>;
  }

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
    setPage("authors");
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={onLogout}>logout</button>
          </>
        )}
      </div>

      {page === "authors" && (
        <div>
          <h2>Authors</h2>
          {authorsResult.data?.allAuthors.map((a) => (
            <div key={a.id}>
              {a.name} {a.born ? `(${a.born})` : ""}
            </div>
          ))}
        </div>
      )}

      {page === "books" && <Books books={result.data?.allBooks} />}

      {page === "login" && (
        <LoginForm
          show={true}
          setToken={(t) => setToken(t)}
          setPage={setPage}
          setError={notify}
        />
      )}

      {page === "add" && token && (
        <div>
          <h2>Add book</h2>
          <div>Feature not implemented in this exercise.</div>
        </div>
      )}
    </div>
  );
};

export default App;
