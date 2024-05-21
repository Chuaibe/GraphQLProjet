import { PrismaClient } from '@prisma/client';
import { AuthenticationError, UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resolvers } from './generated/graphql';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret';

const getUserId = (authHeader: string | null): number | null => {
  if (!authHeader) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const { userId } = jwt.verify(token, JWT_SECRET) as { userId: number };
  return userId;
};

export const resolvers: Resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      return await context.prisma.user.findUnique({ where: { id: userId } });
    },
    users: async (_parent, _args, context) => {
      return await context.prisma.user.findMany();
    },
    posts: async (_parent, _args, context) => {
      return await context.prisma.post.findMany({ include: { author: true, comments: true, likes: true } });
    },
    post: async (_parent, { id }, context) => {
      return await context.prisma.post.findUnique({ where: { id: Number(id) }, include: { author: true, comments: true, likes: true } });
    },
    postComments: async (_parent, { postId }, context) => {
      return await context.prisma.comment.findMany({ where: { postId: Number(postId) } });
    },
    postLikes: async (_parent, { postId }, context) => {
      return await context.prisma.like.findMany({ where: { postId: Number(postId) } });
    },
  },
  Mutation: {
    signup: async (_parent, { email, name, password }, context) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await context.prisma.user.create({ data: { email, name, password: hashedPassword } });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
    login: async (_parent, { email, password }, context) => {
      const user = await context.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UserInputError('No user found with this email');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new UserInputError('Invalid password');
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
    createPost: async (_parent, { title, content }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      return await context.prisma.post.create({
        data: { title, content, authorId: userId },
      });
    },
    updatePost: async (_parent, { id, title, content }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      const post = await context.prisma.post.findUnique({ where: { id: Number(id) } });
      if (post?.authorId !== userId) {
        throw new AuthenticationError('You are not authorized to update this post');
      }
      return await context.prisma.post.update({
        where: { id: Number(id) },
        data: { title, content },
      });
    },
    deletePost: async (_parent, { id }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      const post = await context.prisma.post.findUnique({ where: { id: Number(id) } });
      if (post?.authorId !== userId) {
        throw new AuthenticationError('You are not authorized to delete this post');
      }
      return await context.prisma.post.delete({ where: { id: Number(id) } });
    },
    addComment: async (_parent, { postId, content }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      return await context.prisma.comment.create({
        data: { content, postId: Number(postId), authorId: userId },
      });
    },
    deleteComment: async (_parent, { id }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      const comment = await context.prisma.comment.findUnique({ where: { id: Number(id) } });
      if (comment?.authorId !== userId) {
        throw new AuthenticationError('You are not authorized to delete this comment');
      }
      return await context.prisma.comment.delete({ where: { id: Number(id) } });
    },
    likePost: async (_parent, { postId }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      return await context.prisma.like.create({
        data: { postId: Number(postId), userId },
      });
    },
    deleteLike: async (_parent, { id }, context) => {
      const userId = getUserId(context.req.headers.authorization);
      if (!userId) throw new AuthenticationError('You are not authenticated');
      const like = await context.prisma.like.findUnique({ where: { id: Number(id) } });
      if (like?.userId !== userId) {
        throw new AuthenticationError('You are not authorized to delete this like');
      }
      return await context.prisma.like.delete({ where: { id: Number(id) } });
    },
  },
  User: {
    posts: async (parent, _args, context) => {
      return await context.prisma.user.findUnique({ where: { id: parent.id } }).posts();
    },
    comments: async (parent, _args, context) => {
      return await context.prisma.user.findUnique({ where: { id: parent.id } }).comments();
    },
    likes: async (parent, _args, context) => {
      return await context.prisma.user.findUnique({ where: { id: parent.id } }).likes();
    },
  },
  Post: {
    author: async (parent, _args, context) => {
      return await context.prisma.post.findUnique({ where: { id: parent.id } }).author();
    },
    comments: async (parent, _args, context) => {
      return await context.prisma.post.findUnique({ where: { id: parent.id } }).comments();
    },
    likes: async (parent, _args, context) => {
      return await context.prisma.post.findUnique({ where: { id: parent.id } }).likes();
    },
  },
  Comment: {
    author: async (parent, _args, context) => {
      return await context.prisma.comment.findUnique({ where: { id: parent.id } }).author();
    },
    post: async (parent, _args, context) => {
      return await context.prisma.comment.findUnique({ where: { id: parent.id } }).post();
    },
  },
  Like: {
    user: async (parent, _args, context) => {
      return await context.prisma.like.findUnique({ where: { id: parent.id } }).user();
    },
    post: async (parent, _args, context) => {
      return await context.prisma.like.findUnique({ where: { id: parent.id } }).post();
    },
  },
};
