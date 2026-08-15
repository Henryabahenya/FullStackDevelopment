import { useState } from "react";

const Books = ({ books }) => {
  const [selected, setSelected] = useState("all genres");

  if (!books) return null;

  const genres = Array.from(new Set(books.flatMap((b) => b.genres))).sort();

  const options = ["all genres", ...genres];

  const shown =
    selected === "all genres"
      ? books
      : books.filter((b) => b.genres.includes(selected));

  return (
    <div>
      <h2>Books</h2>
      {selected !== "all genres" && <h3>in genre {selected}</h3>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {shown.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author?.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        {options.map((g) => (
          <button
            key={g}
            onClick={() => setSelected(g)}
            style={{ marginRight: 6 }}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
