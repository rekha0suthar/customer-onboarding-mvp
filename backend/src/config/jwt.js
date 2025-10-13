import dotenv from 'dotenv';
dotenv.config();

export const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

