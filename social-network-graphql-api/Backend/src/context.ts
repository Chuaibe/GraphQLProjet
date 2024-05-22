import { PrismaClient } from '@prisma/client';
import { JWTUser } from './module/auth.module.js';

export type DataSourceContext = {
    dataSources: {
        client: PrismaClient;
    };
    user: JWTUser | null;
};
