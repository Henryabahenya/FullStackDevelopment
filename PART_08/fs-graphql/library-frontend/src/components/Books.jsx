import { useMemo, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      genres
      author {
        name
      }
    }
  }
`;

const Books = ({
  show,
  isLoggedIn,
  favoriteGenre,
  recommendations = false,
}) => {
  const result = useQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache",
  });
  const [selectedGenre, setSelectedGenre] = useState("all");

  if (!show) {
    return null;
  }

  if (result.loading) return <div>Loading books...</div>;
  if (result.error) return <div>Error: {result.error.message}</div>;

  const books = result.data?.allBooks || [];
  const genres = useMemo(
    () => [...new Set(books.flatMap((book) => book.genres || []))],
    [books],
  );

  const visibleBooks =
    selectedGenre === "all" || !selectedGenre
      ? books
      : books.filter((book) => book.genres.includes(selectedGenre));

  const filteredBooks = recommendations
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : visibleBooks;

  return (
    <div>
      <h2>{recommendations ? "recommendations" : "books"}</h2>

      {!recommendations && isLoggedIn && (
        <div>
          {genres.map((genre) => (
            <button key={genre} onClick={() => setSelectedGenre(genre)}>
              {genre}
            </button>
          ))}
          <button onClick={() => setSelectedGenre("all")}>all genres</button>
        </div>
      )}

      {recommendations && (
        <div>
          <div>books in your favorite genre</div>
          <div>{favoriteGenre}</div>
        </div>
      )}

      {!recommendations && selectedGenre !== "all" && selectedGenre && (
        <div>in genre</div>
      )}

      <table>
        <tbody>
          {!recommendations && (
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
          )}
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
