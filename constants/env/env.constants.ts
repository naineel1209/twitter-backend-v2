import env from './env.validation';

//freezing the object makes it immutable - this is a good practice to prevent accidental changes
const processEnv = Object.freeze({
    PORT: env.PORT as string,
    NODE_ENV: env.NODE_ENV as string,
    DATABASE_URL: env.DATABASE_URL as string,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID as string,
    GOOGLE_API_KEY: env.GOOGLE_API_KEY as string,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET as string,
    JWT_SECRET: env.JWT_SECRET as string,
    JWT_EXPIRATION: env.JWT_EXPIRATION as string,
    EMAIL: env.EMAIL as string,
    APP_PASSWORD: env.APP_PASSWORD as string,
    ENCRYPTION_KEY: env.ENCRYPTION_KEY as string,
    ENCRYPTION_IV: env.ENCRYPTION_IV as string,
    REDIS_PASSWORD: env.REDIS_PASSWORD as string,
    REDIS_PORT: env.REDIS_PORT as string,
    REDIS_HOST: env.REDIS_HOST as string,
    CONSOLE_LOG: env.CONSOLE_LOG as string,
    FILE_LOG: env.FILE_LOG as string,
    DISCORD_LOG: env.DISCORD_LOG as string,
    DISCORD_WEBHOOK: env.DISCORD_WEBHOOK as string,
})

export default processEnv;
