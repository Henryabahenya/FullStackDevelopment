import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // 1. ADDED HERE: Set token when restoring user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
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
        'loggedBlogappUser',
        JSON.stringify(loggedInUser),
      );
      setUser(loggedInUser);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('login failed:', error);
      setMessage({
        text: 'wrong username or password',
        type: 'error',
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
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
  };

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.create(blogObject);

    setBlogs(blogs.concat(newBlog));
    setMessage({
      text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: 'success',
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    if (blogFormRef.current) {
      blogFormRef.current.toggleVisibility();
    }
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

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={handleLikeBlog}
            removeBlog={handleDeleteBlog}
            currentUser={user}
          />
        ))}
    </div>
  );
};

export default App;
