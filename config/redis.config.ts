import Redis from 'ioredis'
import logger from './winston.config';

const redisClient = new Redis({
    autoResubscribe: true,
    autoResendUnfulfilledCommands: true,
    connectTimeout: 10000, //10s
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
    }
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
})

redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
})

redisClient.on('close', () => {
    logger.info('Redis connection closed');
})

redisClient.on('reconnecting', () => {
    logger.info('Reconnecting to Redis');
})

redisClient.on('end', () => {
    logger.info('Redis connection ended');
})

export default redisClient;