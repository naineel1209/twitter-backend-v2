import dotenv from 'dotenv'
import Joi from 'joi'
import logger from '../../config/winston.config';

dotenv.config()

const envValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    DATABASE_URL: Joi.string().trim().required(),
    GOOGLE_CLIENT_ID: Joi.string().trim().required(),
    GOOGLE_API_KEY: Joi.string().trim().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().trim().required(),
    JWT_SECRET: Joi.string().trim().required(),
    JWT_EXPIRATION: Joi.string().trim().required().default('1h'),
    EMAIL: Joi.string().email().required(),
    APP_PASSWORD: Joi.string().trim().required(),
    ENCRYPTION_KEY: Joi.string().trim().required(),
    ENCRYPTION_IV: Joi.string().trim().required()
})

//this will throw an error if any of the env variables are invalid
const env: {
    [p: string]: string
} = Object.fromEntries(Object.keys(envValidationSchema.describe().keys).map((key) => [key, '']))

try {
    const envVars: { [p: string]: string } = {}

    for (const key in env) {
        if (process.env[key] !== undefined) {
            envVars[key] = process.env[key] as string
        }
    }

    const {error} = envValidationSchema.validate(envVars, {stripUnknown: true, abortEarly: false})
    if (error) {
        throw error
    }

    Object.assign(env, envVars)
} catch (err) {
    if (err instanceof Joi.ValidationError) {
        logger.error(`Environment validation error: ${err.message}`)
        process.exit(1)
    } else if (err instanceof Error) {
        logger.error(`Environment validation error: ${err.message}`)
        process.exit(1)
    }
}

export default env
