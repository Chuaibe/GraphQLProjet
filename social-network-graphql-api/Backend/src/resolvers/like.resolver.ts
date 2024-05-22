import { Resolvers } from '../types.js';
import { AuthenticationError } from 'apollo-server';

const likeResolvers: Resolvers = {
    Query: {
        postLikes: async (_parent, { postId }, context) => {
            return context.dataSources.client.like.findMany({
                where: { postId: Number(postId) },
            });
        },
    },
    Mutation: {
        likePost: async (_parent, { postId }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');

            return context.dataSources.client.like.create({
                data: { postId: Number(postId), userId },
            });
        },
        deleteLike: async (_parent, { id }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');

            const like = await context.dataSources.client.like.findUnique({
                where: { id: Number(id) },
            });

            if (like?.userId !== userId) {
                throw new AuthenticationError(
                    'You are not authorized to delete this like',
                );
            }
            return context.dataSources.client.like.delete({
                where: { id: Number(id) },
            });
        },
    },
    Like: {
        user: async (parent, _args, context) => {
            return context.dataSources.client.like
                .findUnique({ where: { id: parent.id } })
                .user();
        },
        post: async (parent, _args, context) => {
            return context.dataSources.client.like
                .findUnique({ where: { id: parent.id } })
                .post();
        },
    },
};

export default likeResolvers;
