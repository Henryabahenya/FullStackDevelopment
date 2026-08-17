import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

const App = () => {
  const [page, setPage] = useState("authors");
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const token = localStorage.getItem("library-user-token");
  const { data: meData } = useQuery(ME, {
    skip: !token,
    fetchPolicy: "no-cache",
  });
  const [login] = useMutation(LOGIN);

  const user = meData?.me || null;

  const handleLogin = async (username, password) => {
    try {
      const result = await login({ variables: { username, password } });
      const value = result.data?.login?.value;

      if (!value) {
        throw new Error("Missing token");
      }

      localStorage.setItem("library-user-token", value);
      setLoginError("");
      setShowLogin(false);
      setPage("authors");
      window.location.reload();
    } catch (error) {
      setLoginError("login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("library-user-token");
    window.location.reload();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && (
          <button onClick={() => setShowLogin((prev) => !prev)}>login</button>
        )}
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommend
            </button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>

      {showLogin && !token && (
        <LoginForm onSubmit={handleLogin} error={loginError} />
      )}

      <Authors
        show={page === "authors"}
        isLoggedIn={Boolean(token)}
        currentUser={user}
      />
      <Books
        show={page === "books"}
        isLoggedIn={Boolean(token)}
        favoriteGenre={user?.favoriteGenre}
      />
      <Books
        show={page === "recommendations"}
        isLoggedIn={Boolean(token)}
        favoriteGenre={user?.favoriteGenre}
        recommendations
      />
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
