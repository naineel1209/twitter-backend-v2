import Redis from 'ioredis';
import httpStatus from 'http-status';
import {CustomError} from '../../errors/custom-error';
import {SERVICE_NAME, USER_PASSWORD_UPDATED} from '../../modules/user/user.helper';

export class ResetPasswordDal {
    static async checkUserPasswordUpdateStatus(redisClient: Redis, userId: number) {
        try {
            const res = await redisClient.get(`${SERVICE_NAME}:${USER_PASSWORD_UPDATED}:${userId}`);

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
            const res = await redisClient.del(`${SERVICE_NAME}:${USER_PASSWORD_UPDATED}:${userId}`);

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
