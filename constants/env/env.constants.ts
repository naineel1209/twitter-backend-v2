import env from './env.validation';
import {IEnv} from './env';

//freezing the object makes it immutable - this is a good practice to prevent accidental changes
const processEnv: Readonly<IEnv> = Object.freeze({
    PORT: env.PORT as string,
    NODE_ENV: env.NODE_ENV as string,
    DATABASE_URL: env.DATABASE_URL as string,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID as string,
    GOOGLE_API_KEY: env.GOOGLE_API_KEY as string,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET as string,
    JWT_SECRET: env.JWT_SECRET as string,
    JWT_EXPIRATION: env.JWT_EXPIRATION as string,
})

export default processEnv;
