import pg from 'pg';
import {LocalAuthDal} from './localauth.dal';
import pool from '../../../../config/pg.config';
import {ILocalUserObj} from './localauth';
import {UtilsService} from '../../../utils/utils.service';

class LocalAuthService {
    private pgPool: pg.Pool;

    constructor(pool: pg.Pool) {
        this.pgPool = pool;
    }

    async registerLocalUser(data: ILocalUserObj) {
        const client = await this.pgPool.connect();

        try {
            data.password = await UtilsService.hashPassword(data.password)

            return await LocalAuthDal.registerLocalUser(client, data);
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    async findUserByUsername(username: string) {
        const client = await this.pgPool.connect();

        try {
            return await LocalAuthDal.findUserByUsername(client, username);
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }
}

export default new LocalAuthService(pool)
