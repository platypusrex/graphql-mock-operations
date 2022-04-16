import { GraphQLError, GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Book = {
  __typename?: 'Book';
  authorId: Scalars['ID'];
  id: Scalars['ID'];
  numPages: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  deleteUser?: Maybe<User>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Book>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryBookArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type BookFragment = { __typename?: 'Book', id: string, title: string, numPages: number, authorId: string };

export type BookQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BookQuery = { __typename?: 'Query', book?: { __typename?: 'Book', id: string, title: string, numPages: number, authorId: string } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'User', id: string, name: string } | null };

export type UserFragment = { __typename?: 'User', id: string, name: string };

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name: string } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string }> };


export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphQLError[] | Error;

type ResolverType<TResult, TArgs> = Record<keyof TResult, ResolverFn<TResult[keyof TResult], {}, {}, TArgs>>;  
  
export type BookMockOperationArgs = Exact<{
  id: Scalars['ID'];
}>;

export type BookMockOperationResult = {
	book: { __typename?: 'Book', id: string, title: string, numPages: number, authorId: string } | null
};

export type BookMockOperation = ResolverType<BookMockOperationResult, BookMockOperationArgs>;

export type CreateUserMockOperationArgs = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMockOperationResult = {
	createUser: { __typename?: 'User', id: string, name: string }
};

export type CreateUserMockOperation = ResolverType<CreateUserMockOperationResult, CreateUserMockOperationArgs>;

export type DeleteUserMockOperationArgs = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteUserMockOperationResult = {
	deleteUser: { __typename?: 'User', id: string, name: string } | null
};

export type DeleteUserMockOperation = ResolverType<DeleteUserMockOperationResult, DeleteUserMockOperationArgs>;

export type UserMockOperationArgs = Exact<{
  id: Scalars['ID'];
}>;

export type UserMockOperationResult = {
	user: { __typename?: 'User', id: string, name: string } | null
};

export type UserMockOperation = ResolverType<UserMockOperationResult, UserMockOperationArgs>;

export type UsersMockOperationArgs = Exact<{ [key: string]: never; }>;

export type UsersMockOperationResult = {
	users: Array<{ __typename?: 'User', id: string, name: string }>
};

export type UsersMockOperation = ResolverType<UsersMockOperationResult, UsersMockOperationArgs>;

export type QueryMockOperations = BookMockOperation
	 & UserMockOperation
	 & UsersMockOperation;

export type MutationMockOperations = CreateUserMockOperation
	 & DeleteUserMockOperation;

export type MockOperations = {
	Query: Partial<QueryMockOperations>;
	Mutation: Partial<MutationMockOperations>;
};
