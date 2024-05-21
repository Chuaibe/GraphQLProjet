import { gql } from 'apollo-server';
import {DocumentNode} from "graphql/language/index.js";

export const typeDefs: DocumentNode = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
  }

  type Like {
    id: ID!
    user: User!
    post: Post!
  }

  type Query {
    me: User
    users: [User!]!
    posts: [Post!]!
    post(id: ID!): Post
    postComments(postId: ID!): [Comment!]!
    postLikes(postId: ID!): [Like!]!
  }

  type Mutation {
    signup(email: String!, name: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Post!
    addComment(postId: ID!, content: String!): Comment!
    deleteComment(id: ID!): Comment!
    likePost(postId: ID!): Like!
    deleteLike(id: ID!): Like!
  }

  type AuthPayload {
    token: String
    user: User
  }
`;
