import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // 1. ADDED HERE: Set token when restoring user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // <--- Crucial fix!
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await loginService.login({
        username: username,
        password: password,
      });

      // 2. ADDED HERE: Set token upon new successful login
      blogService.setToken(loggedInUser.token); // <--- Crucial fix!

      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedInUser),
      );
      setUser(loggedInUser);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("login failed:", error);
      setMessage({
        text: "wrong username or password",
        type: "error",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const newBlog = await blogService.create({
      title,
      author,
      url,
    });

    setBlogs(blogs.concat(newBlog));
    setMessage({
      text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: "success",
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  if (user === null) {
    // ... (Login form stays exactly the same)
    return (
      <div>
        <Notification message={message} />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  // Your JSX structure here perfectly matches Screenshot from 2026-07-06 13-11-59.png!
  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <h3>create new</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          title
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
