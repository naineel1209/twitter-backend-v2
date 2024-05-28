import pool from '../../../config/pg.config';
import pg from 'pg';
import {UserDal} from './user.dal';
import {IGetAllUsersQueryParams, IUpdateUser} from './user';
import {UtilsService} from '../../utils/utils.service';
import mailService from '../mail/mail.service';

class UserService {
    constructor(private pgPool: pg.Pool) {
    }

    async getFollowers(userId: number) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.getFollowers(client, userId);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async getFollowing(userId: number) {
        const client = await this.pgPool.connect();

        try {
            return await UserDal.getFollowing(client, userId);
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
            const user = await UserDal.findUserByEmailOrUsername(client, data.userIdentity);

            //error is inherently handled - so move to sending the email to the user
            const resetToken = await UtilsService.generateResetToken();

            await mailService.sendForgotPasswordMail({
                email: user.email,
                username: user.username,
                userId: user.id,
                name: user.name,
                token: resetToken
            });
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new UserService(pool)
