import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export type JWTUser = Pick<User, 'id' | 'email' | 'name'>;

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not provided');
    }
    return secret;
};

export const createJWT = (user: JWTUser): string => {
    return jwt.sign(user, getJwtSecret(), { expiresIn: '1h' });
};

export const getUser = (token: string): JWTUser | null => {
    try {
        return jwt.verify(token, getJwtSecret()) as JWTUser;
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            console.error('JWT verification error: Token has expired');
        } else {
            console.error('JWT verification error:', e);
        }
        return null;
    }
};

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 5);
};

export const comparePassword = (
    password: string,
    hash: string,
): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
