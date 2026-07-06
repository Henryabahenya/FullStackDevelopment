import { useState } from "react";

const Blog = ({ blog, updateBlog, removeBlog, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const canRemove =
    currentUser &&
    blog.user &&
    typeof blog.user !== "string" &&
    blog.user.username === currentUser.username;

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => updateBlog(blog)}>like</button>
          </div>
          <div>{blog.user?.name || blog.user}</div>
          {canRemove && (
            <button
              style={{ backgroundColor: "blue", color: "white", marginTop: 5 }}
              onClick={() => removeBlog(blog)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
