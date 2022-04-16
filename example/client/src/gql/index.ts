import { loader } from 'graphql.macro';

const usersQuery = loader('./usersQuery.graphql');
const userQuery = loader('./userQuery.graphql');
const createUserMutation = loader('./createUserMutation.graphql');
const deleteUserMutation = loader('./deleteUserMutation.graphql');
const bookQuery = loader('./bookQuery.graphql');

export { usersQuery, userQuery, createUserMutation, deleteUserMutation, bookQuery };
