import { useState } from "react";

const LoginForm = ({ onSubmit, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">username</label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      {error && <div>login failed</div>}
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
