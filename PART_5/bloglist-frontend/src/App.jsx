import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const BlogView = ({ blogs, user, handleLikeBlog, handleDeleteBlog }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id || b.id?.toString() === id);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const createdBy = blog.user?.name || blog.user;
  const isOwner =
    user &&
    (blog.user?.username === user.username ||
      blog.user === user.id ||
      blog.user === user._id);

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        likes {blog.likes}{" "}
        {user && <button onClick={() => handleLikeBlog(blog)}>like</button>}
      </div>
      <div>added by {createdBy}</div>
      {isOwner && (
        <button onClick={() => handleDeleteBlog(blog)}>remove</button>
      )}
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const blogFormRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await loginService.login({
        username: username,
        password: password,
      });

      blogService.setToken(loggedInUser.token);

      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedInUser),
      );
      setUser(loggedInUser);
      setUsername("");
      setPassword("");
      navigate("/");
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
    navigate("/");
  };

  const handleLikeBlog = async (blog) => {
    const userId = blog.user?.id || blog.user?._id || blog.user;
    const updatedObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: userId,
    };
    await blogService.update(blog.id, updatedObject);
    setBlogs(
      blogs.map((b) =>
        b.id === blog.id ? { ...b, likes: b.likes + 1, user: b.user } : b,
      ),
    );
  };

  const handleDeleteBlog = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );
    if (!confirmDelete) {
      return;
    }
    await blogService.remove(blog.id);
    setBlogs(blogs.filter((b) => b.id !== blog.id));
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(newBlog));
    setMessage({
      text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: "success",
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    if (blogFormRef.current) {
      blogFormRef.current.toggleVisibility();
    }
  };

  const navStyle = {
    padding: 5,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  };

  return (
    <div>
      <div style={navStyle}>
        <Link style={{ padding: 5 }} to="/">
          blogs
        </Link>
        {user ? (
          <span>
            <em>{user.name} logged in</em>{" "}
            <button onClick={handleLogout}>logout</button>
          </span>
        ) : (
          <Link style={{ padding: 5 }} to="/login">
            login
          </Link>
        )}
      </div>

      <Notification message={message} />
      <h2>blog app</h2>

      <Routes>
        <Route
          path="/login"
          element={
            <div>
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
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              user={user}
              handleLikeBlog={handleLikeBlog}
              handleDeleteBlog={handleDeleteBlog}
            />
          }
        />
        <Route
          path="/"
          element={
            <div>
              {user && (
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
              )}

              <ul>
                {[...blogs]
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <li key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>
                        {blog.title} by {blog.author}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
