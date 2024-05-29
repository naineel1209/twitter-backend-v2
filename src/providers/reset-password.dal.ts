import Redis from 'ioredis';
import httpStatus from 'http-status';
import {CustomError} from '../errors/custom-error';

export class ResetPasswordDal {
    static async checkUserPasswordUpdateStatus(redisClient: Redis, userId: number) {
        try {
            //TODO - rewrite the keys of all the redis keys as constants in a separate file for more maintainability
            const res = await redisClient.get(`twitter-backend-v2:user-password-updated:${userId}`);

            if (res === null || !res || res !== 'true') {
                return false;
            }

            return true;
        } catch (err) {
            throw err;
        }
    }

    static async deleteUserPasswordUpdateStatus(redisClient: Redis, userId: number) {
        try {
            const res = await redisClient.del(`twitter-backend-v2:user-password-updated:${userId}`);

            if (res === 0) {
                throw new CustomError('Token not found', httpStatus.NOT_FOUND, {
                    error: 'Token not found',
                    details: userId
                })
            }

            return res;
        } catch (err) {
            throw err;
        }
    }
}
