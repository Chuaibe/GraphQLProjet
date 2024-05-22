import { Resolvers } from '../types.js';
import { AuthenticationError } from 'apollo-server';

const commentResolvers: Resolvers = {
    Query: {
        postComments: async (_parent, { postId }, context) => {
            return context.dataSources.client.comment.findMany({
                where: { postId: Number(postId) },
            });
        },
    },
    Mutation: {
        addComment: async (_parent, { postId, content }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');

            return context.dataSources.client.comment.create({
                data: { content, postId: Number(postId), authorId: userId },
            });
        },
        deleteComment: async (_parent, { id }, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');

            const comment = await context.dataSources.client.comment.findUnique(
                { where: { id: Number(id) } },
            );
            if (comment?.authorId !== userId) {
                throw new AuthenticationError(
                    'You are not authorized to delete this comment',
                );
            }

            return context.dataSources.client.comment.delete({
                where: { id: Number(id) },
            });
        },
    },
    Comment: {
        author: async (parent, _args, context) => {
            return context.dataSources.client.comment
                .findUnique({ where: { id: parent.id } })
                .author();
        },
        post: async (parent, _args, context) => {
            return context.dataSources.client.comment
                .findUnique({ where: { id: parent.id } })
                .post();
        },
    },
};

export default commentResolvers;
