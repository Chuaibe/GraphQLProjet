import { Resolvers } from '../types.js';
import { AuthenticationError, UserInputError } from 'apollo-server';
import {
    hashPassword,
    comparePassword,
    createJWT,
} from '../module/auth.module.js';

const userResolvers: Resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            const userId = context.user?.id;
            if (!userId)
                throw new AuthenticationError('You are not authenticated');
            return context.dataSources.client.user.findUnique({
                where: { id: userId },
            });
        },
        users: async (_parent, _args, context) => {
            return context.dataSources.client.user.findMany();
        },
    },
    Mutation: {
        signup: async (_parent, { email, name, password }, context) => {
            const hashedPassword = await hashPassword(password);

            const user = await context.dataSources.client.user.create({
                data: { email, name, password: hashedPassword },
            });

            const token = createJWT({
                id: user.id,
                email: user.email,
                name: user.name,
            });
            return { token, user };
        },
        login: async (_parent, { email, password }, context) => {
            const user = await context.dataSources.client.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new UserInputError('No user found with this email');
            }

            const valid = await comparePassword(password, user.password);
            if (!valid) {
                throw new UserInputError('Invalid password');
            }

            const token = createJWT({
                id: user.id,
                email: user.email,
                name: user.name,
            });
            return { token, user };
        },
    },
    User: {
        posts: async (parent, _args, context) => {
            return context.dataSources.client.user
                .findUnique({ where: { id: parent.id } })
                .posts();
        },
        comments: async (parent, _args, context) => {
            return context.dataSources.client.user
                .findUnique({ where: { id: parent.id } })
                .comments();
        },
        likes: async (parent, _args, context) => {
            return context.dataSources.client.user
                .findUnique({ where: { id: parent.id } })
                .likes();
        },
    },
};

export default userResolvers;
