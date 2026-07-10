import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div className="form-card">
      <h3 className="form-title">Create new</h3>
      <form onSubmit={handleSubmit} className="stack">
        <div className="form-field">
          <input
            id="title"
            className="text-input"
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            id="author"
            className="text-input"
            type="text"
            placeholder="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            id="url"
            className="text-input"
            type="text"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          CREATE
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
