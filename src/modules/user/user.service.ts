import pool from '../../../config/pg.config';
import pg from 'pg';
import {UserDal} from './user.dal';
import {IGetAllUsers} from './user';

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

    async getAllUsers(queryParams: IGetAllUsers) {
        const client = await this.pgPool.connect();

        //TODO remove the errors handling from the service files and try to move to the DAL files

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
}

export default new UserService(pool)
