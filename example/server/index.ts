import { ApolloServer, gql } from 'apollo-server';

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

const resolvers = {
  Query: {
    user: (_: any, { id }: any) => users.find((user) => user.id === id),
    users: () => users,
    book: (_: any, { id }: any) => books.find((book) => book.id === id),
    books: () => books,
  },
  Mutation: {
    createUser: (_: any, { input: { name, email } }: any) => {
      const newUser = { id: String(users.length + 1), name, email };
      users = [...users, newUser]
      return newUser;
    },
    deleteUser: (_: any, { id }: any) => {
      const userToDelete = users.find(user => user.id === id);
      users = users.filter(user => user.id !== id)
      return userToDelete;
    },
    createBook: (_: any, { input: { title, numPages, authorId } }: any) => {
      const newBook = { id: String(books.length + 1), title, numPages, authorId };
      books = [...books, newBook]
      return newBook;
    },
    deleteBook: (_: any, { id }: any) => {
      const bookToDelete = books.find(book => book.id === id);
      books = books.filter(book => book.id !== id)
      return bookToDelete;
    }
  }
};

(function() {
  const server = new ApolloServer({
    typeDefs: typeDefs as any,
    resolvers,
  });

  server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
