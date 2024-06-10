import Redis from 'ioredis';
import logger from './winston.config';
import processEnv from '../constants/env/env.constants';
import {performance} from 'node:perf_hooks';

const redisClient = new Redis(`rediss://default:${processEnv.REDIS_PASSWORD}@${processEnv.REDIS_HOST}:${processEnv.REDIS_PORT}`, {
    autoResubscribe: true,
    autoResendUnfulfilledCommands: true,
    connectTimeout: 10000, //10s
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
    }
});

redisClient.on('connect', async () => {
    logger.info('Connected to Redis');

    const startTime = performance.now();

    await redisClient.ping((err, _) => {
        if (err) {
            logger.error(`Error pinging Redis: ${err}`);
        } else {
            const endTime = performance.now();
            logger.info(`Redis pinged successfully in ${endTime - startTime}ms`);
        }
    });
});

redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
});

redisClient.on('close', () => {
    logger.info('Redis connection closed');
});

redisClient.on('reconnecting', () => {
    logger.info('Reconnecting to Redis');
});

redisClient.on('end', () => {
    logger.info('Redis connection ended');
});

export default redisClient;
