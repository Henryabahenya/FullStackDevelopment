import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
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
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Typography
          variant="body1"
          component="a"
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "block",
            mt: 1,
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          {blog.url}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Added by {createdBy}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <Typography variant="body1">likes {blog.likes}</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleLikeBlog(blog)}
          >
            LIKE
          </Button>
          {isOwner && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteBlog(blog)}
            >
              REMOVE
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
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
    navigate("/");
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Blogs
            </Button>
            {user && (
              <Button color="inherit" component={Link} to="/create">
                New Blog
              </Button>
            )}
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Notification message={message} />
      <h2>blog app</h2>

      <Routes>
        <Route
          path="/login"
          element={
            <div className="form-card">
              <h2 className="form-title">Login</h2>
              <form onSubmit={handleLogin} className="stack">
                <div className="form-field">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <input
                    type="password"
                    className="text-input"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  LOGIN
                </button>
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
          path="/create"
          element={
            user ? <BlogForm createBlog={addBlog} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={
            <div>
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
