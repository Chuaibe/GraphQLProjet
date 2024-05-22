import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import express from 'express';
import http from 'http';

import { DataSourceContext } from './context.js';
import { getUser, JWTUser } from './module/auth.module.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import client from './infrastructure/client.js';

const startServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);

    const server: ApolloServer<DataSourceContext> =
        new ApolloServer<DataSourceContext>({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ['http://localhost:3000'],
            credentials: true,
        }),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }): Promise<DataSourceContext> => {
                const authHeader = req.headers.authorization || '';
                const token = authHeader.startsWith('Bearer ')
                    ? authHeader.split(' ')[1]
                    : null;
                if (token) {
                    try {
                        const user: JWTUser | null = getUser(token);
                        return {
                            dataSources: {
                                client: client,
                            },
                            user,
                        };
                    } catch (error) {
                        console.error('Error while verifying token:', error);
                    }
                }
                return {
                    dataSources: {
                        client: client,
                    },
                    user: null,
                };
            },
        }),
    );

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve),
    );
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
});
