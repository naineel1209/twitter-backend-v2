import Redis from 'ioredis';
import redisClient from '../../config/redis.config';
import {ResetPasswordDal} from './reset-password.dal';

class ResetPasswordService {
    constructor(private redisClient: Redis) {
    }

    async checkUserPasswordUpdateStatus(userId: number): Promise<boolean> {
        try {
            return await ResetPasswordDal.checkUserPasswordUpdateStatus(this.redisClient, userId); // !! converts the value to a boolean
        } catch (err) {
            throw err;
        }
    }

    async deleteUserPasswordUpdateStatus(userId: number) {
        try {
            return await ResetPasswordDal.deleteUserPasswordUpdateStatus(this.redisClient, userId);
        } catch (err) {
            throw err;
        }
    }
}

export default new ResetPasswordService(redisClient)
