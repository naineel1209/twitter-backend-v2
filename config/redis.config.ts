import Redis from 'ioredis'
import logger from './winston.config';

const redisClient = new Redis("redis-16157.c301.ap-south-1-1.ec2.cloud.redislabs.com:16157",{
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
