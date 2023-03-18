import { config as initEnv } from 'dotenv';

initEnv();

export const Config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
};