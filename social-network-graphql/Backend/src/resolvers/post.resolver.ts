import { Resolvers } from '../types.js';
import { AuthenticationError } from 'apollo-server';

const postResolvers: Resolvers = {
    Query: {
        posts: async (_parent, _args, context) => {
            return context.dataSources.client.post.findMany({
                include: {
                    author: true,
                    comments: true,
                    likes: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        },
        post: async (_parent, {id}, context) => {
            return context.dataSources.client.post.findUnique({
                where: {id: Number(id)},
                include: {author: true, comments: true, likes: true},
            });
        },
        postsByAuthor: async (_parent, {authorId}, context) => {
            return context.dataSources.client.post.findMany({
                where: {authorId: Number(authorId)},
                include: {
                    author: true,
                    comments: true,
                    likes: true,
                },
            });
        },
        postsByLikes: async (_parent, _args, context) => {
            return context.dataSources.client.post.findMany({
                include: {
                    author: true,
                    comments: true,
                    likes: true,
                },
                orderBy: {
                    likes: {
                        _count: 'desc',
                    },
                },
            });
        },
    },
    Mutation: {
        createPost: async (_parent, { title, content }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');

            return context.dataSources.client.post.create({
                data: { title, content, authorId: userId },
            });
        },
        updatePost: async (_parent, { id, title, content }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');

            const post = await context.dataSources.client.post.findUnique({
                where: { id: Number(id) },
            });
            if (post?.authorId !== userId) {
                throw new AuthenticationError(
                    'You are not authorized to update this post',
                );
            }

            return context.dataSources.client.post.update({
                where: { id: Number(id) },
                data: { title, content },
            });
        },
        deletePost: async (_parent, { id }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');
            const post = await context.dataSources.client.post.findUnique({
                where: { id: Number(id) },
            });

            if (post?.authorId !== userId) {
                throw new AuthenticationError(
                    'You are not authorized to delete this post',
                );
            }

            return context.dataSources.client.post.delete({
                where: { id: Number(id) },
            });
        },
    },
    Post: {
        author: async (parent, _args, context) => {
            return context.dataSources.client.post
                .findUnique({ where: { id: parent.id } })
                .author();
        },
        comments: async (parent, _args, context) => {
            return context.dataSources.client.post
                .findUnique({ where: { id: parent.id } })
                .comments();
        },
        likes: async (parent, _args, context) => {
            return context.dataSources.client.post
                .findUnique({ where: { id: parent.id } })
                .likes();
        },
    },
};

export default postResolvers;
