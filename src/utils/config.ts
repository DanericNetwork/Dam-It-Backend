import { config as initEnv } from 'dotenv';

initEnv();

export const Config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:8080",
};