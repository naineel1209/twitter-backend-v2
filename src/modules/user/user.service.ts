import pool from '../../../config/pg.config';
import pg from 'pg';
import {UserDal} from './user.dal';
import {IGetAllUsersQueryParams, IUpdateUser} from './user';
import {UtilsService} from '../../utils/utils.service';
import mailService from '../mail/mail.service';
import Redis from 'ioredis';
import redisClient from '../../../config/redis.config';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

class UserService {
    constructor(private pgPool: pg.Pool, private redisClient: Redis) {
    }

    async getFollowers(userId: number, currentUserId: number) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.getFollowers(client, userId, currentUserId);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getFollowing(userId: number, currentUserId: number) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.getFollowing(client, userId, currentUserId);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getAllUsers(queryParams: IGetAllUsersQueryParams) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.getAllUsers(client, queryParams)
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getSingleUser(userId: number) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.getAllUsers(client, {userId: userId})
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async updateUser(data: IUpdateUser) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.updateUser(client, data);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async forgotPassword(data: { userIdentity: string }) {
        const client = await this.pgPool.connect();

        try {
            //find the user details from the unique user identity
            const user = await UserDal.findUserByEmailOrUsername(client, data.userIdentity);

            //check if the user-reset token exists or not
            await UserDal.checkIfUserResetTokenExists(redisClient, user.id)

            //error is inherently handled - so move to sending the email to the user
            //generate a reset token for the user to be validated
            const resetToken = await UtilsService.generateResetToken();


            //encrypt the user details along with the token
            const encryptedToken = await UtilsService.encryptUserDetails({userId: user.id, token: resetToken})

            //send the email to the user with the encryptedToken which will be decrypted and validated when the user clicks on the link
            await mailService.sendForgotPasswordMail({
                email: user.email,
                username: user.username,
                userId: user.id,
                name: user.name,
                token: encryptedToken
            });

            //save the reset token in redis for the user
            await UserDal.saveResetToken(redisClient, user.id, resetToken)

            return;
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async verifyToken(token: string) {
        try {
            //decrypt the token to get the user details and the token
            const userDetails = await UtilsService.decryptUserDetails(token) as { userId: number, token: string };

            //now we have to match the token with the one saved in redis
            const savedToken = await UserDal.getResetToken(redisClient, userDetails.userId);

            if (savedToken !== userDetails.token) {
                throw new CustomError('Token mismatch', httpStatus.UNAUTHORIZED, {
                    error: 'Token mismatch',
                    details: userDetails
                })
            }

            //if the token matches, then we can proceed to update the user's password - so we can delete the token from redis
            await UserDal.deleteResetToken(redisClient, userDetails.userId);

            //update the user's password update status to true - which allows the user to update the password
            await UserDal.updateUserPasswordUpdateStatus(redisClient, userDetails.userId);

            return userDetails.userId;
        } catch (err) {
            throw err;
        }
    }

    async resetPassword(data: { password: string; userId: number }) {
        const client = await this.pgPool.connect();

        try {
            data.password = await UtilsService.hashPassword(data.password);

            //update the user's password
            await UserDal.updateUser(client, data);

            return;
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new UserService(pool, redisClient)
