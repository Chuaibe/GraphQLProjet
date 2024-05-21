import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import client from './infrastructure/client.js';
import { DataSourceContext } from './context.js';
import { getUser, JWTUser } from './module/auth.module.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';


  const server: ApolloServer<DataSourceContext> = new ApolloServer<DataSourceContext>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4444 },
    context: async ({ req }): Promise<DataSourceContext> => {

      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
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
  });


console.log(`🚀 Server ready at: ${url}`);
