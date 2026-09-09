import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`;

const Authors = ({ show, isLoggedIn, currentUser }) => {
  const result = useQuery(ALL_AUTHORS, {
    fetchPolicy: "no-cache",
  });
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    awaitRefetchQueries: true,
  });
  const [selectedName, setSelectedName] = useState("");
  const [born, setBorn] = useState("");

  if (!show) {
    return null;
  }

  if (result.loading) return <div>Loading authors...</div>;
  if (result.error) return <div>Error: {result.error.message}</div>;

  const authors = result.data?.allAuthors || [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedName) {
      return;
    }

    await editAuthor({
      variables: { name: selectedName, setBornTo: Number(born) },
    });
    setBorn("");
    setSelectedName("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoggedIn && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">name</label>
              <select
                id="name"
                name="name"
                value={selectedName}
                onChange={({ target }) => setSelectedName(target.value)}
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born">born</label>
              <input
                id="born"
                name="born"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
