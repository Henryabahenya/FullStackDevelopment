require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const typeDefs = `
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    bookCount: Int!
    authorCount: Int!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!, password: String!): User
    login(username: String!, password: String!): Token
    _resetDatabase: Boolean
  }
`;

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      const filter = {};

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      if (args.author) {
        filter.author = args.author;
      }

      return Book.find(filter).sort({ title: 1 });
    },
    allAuthors: async () => Author.find({}).sort({ name: 1 }),
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    me: async (root, args, context) => context.currentUser || null,
  },
  Mutation: {
    _resetDatabase: async () => {
      await Book.deleteMany({});
      await Author.deleteMany({});
      await User.deleteMany({});

      const initialBooks = [
        {
          title: "Clean Code",
          published: 2008,
          author: "Robert Martin",
          genres: ["refactoring"],
        },
        {
          title: "Agile software development",
          published: 2002,
          author: "Robert Martin",
          genres: ["agile", "patterns", "design"],
        },
        {
          title: "Refactoring, edition 2",
          published: 2018,
          author: "Martin Fowler",
          genres: ["refactoring"],
        },
        {
          title: "Refactoring to patterns",
          published: 2008,
          author: "Joshua Kerievsky",
          genres: ["refactoring", "patterns"],
        },
        {
          title: "Crime and punishment",
          published: 1866,
          author: "Fyodor Dostoevsky",
          genres: ["classic", "crime"],
        },
      ];

      for (const book of initialBooks) {
        let author = await Author.findOne({ name: book.author });
        if (!author) {
          author = new Author({ name: book.author });
          await author.save();
        }

        const newBook = new Book({
          title: book.title,
          published: book.published,
          author: book.author,
          genres: book.genres,
        });

        await newBook.save();
      }

      const testUser = new User({
        username: "testuser",
        favoriteGenre: "refactoring",
        password: "secret",
      });
      await testUser.save();

      return true;
    },
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: { code: "BAD_USER_INPUT", invalidArgs: args, error },
          });
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: args.author,
      });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args, error },
        });
      }

      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      try {
        return await author.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args, error },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        password: args.password,
      });

      try {
        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args, error },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== user.password) {
        throw new GraphQLError("wrong credentials");
      }

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_SECRET,
      );
      return { value: token };
    },
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root.name }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const MONGODB_URI = process.env.MONGODB_URI;
console.log("connecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connection to MongoDB:", error.message));

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7).trim();
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      } catch (error) {
        console.error("JWT Verification failed:", error.message);
      }
    }
    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
