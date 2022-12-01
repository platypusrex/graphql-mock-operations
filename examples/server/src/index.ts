import { ApolloServer, gql } from 'apollo-server';
import { Book, Resolvers, User } from './generated';

let users = [
  { id: '1', name: 'Frank', email: 'frank@email.comd' },
  { id: '2', name: 'Jen', email: 'jen@email.comd' },
  { id: '3', name: 'Dylan', email: 'dylan@email.comd' },
];

let books = [
  { id: '1', title: 'Book One', numPages: 200, authorId: '1' },
  { id: '2', title: 'Book Two', numPages: 240, authorId: '3' },
  { id: '3', title: 'Book Three', numPages: 180, authorId: '1' },
];

const typeDefs = gql`
  type Address {
    addressLineOne: String!
    addressLineTwo: String
    city: String!
    state: String!
    zip: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    address: [Address!]
    books: [Book!]
  }

  type Book {
    id: ID!
    title: String!
    numPages: Int!
    authorId: ID!
    author: User
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreateBookInput {
    title: String!
    numPages: Int!
    authorId: ID!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    book(id: ID!): Book
    books: [Book!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    deleteUser(id: ID!): User
    createBook(input: CreateBookInput!): Book!
    deleteBook(id: ID!): Book
  }
`;

const resolvers: Resolvers = {
  Query: {
    user: (_, { id }) => users.find((user) => user.id === id) as User,
    users: () => users,
    book: (_, { id }) => books.find((book) => book.id === id) as Book,
    books: () => books,
  },
  Mutation: {
    createUser: (_, { input: { name, email } }) => {
      const newUser = { id: String(users.length + 1), name, email };
      users = [...users, newUser];
      return newUser;
    },
    deleteUser: (_, { id }) => {
      const userToDelete = users.find((user) => user.id === id);
      users = users.filter((user) => user.id !== id);
      return userToDelete as User;
    },
    createBook: (_, { input: { title, numPages, authorId } }) => {
      const newBook = { id: String(books.length + 1), title, numPages, authorId };
      books = [...books, newBook];
      return newBook;
    },
    deleteBook: (_, { id }) => {
      const bookToDelete = books.find((book) => book.id === id);
      books = books.filter((book) => book.id !== id);
      return bookToDelete as Book;
    },
  },
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(function() {
  const server = new ApolloServer({
    typeDefs: typeDefs as any,
    resolvers,
  });

  server.listen({ port: 4001 }).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
  });
})();
