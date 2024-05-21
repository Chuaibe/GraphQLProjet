import { Resolvers } from './types.js';
import userResolvers from "./resolvers/user.resolver.js";
import commentResolvers from "./resolvers/comment.resolver.js";
import postResolvers from "./resolvers/post.resolver.js";
import likeResolvers from "./resolvers/like.resolver.js";


export const resolvers: Resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...likeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Post: {
    ...postResolvers.Post,
  },
  Comment: {
    ...commentResolvers.Comment,
  },
  Like: {
    ...likeResolvers.Like,
  },
};
