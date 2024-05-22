import pg from 'pg';
import {AuthDal} from './auth.dal';
import pool from '../../../config/pg.config';

class AuthService {
    private pgPool: pg.Pool;

    constructor(pgPoolService: pg.Pool) {
        this.pgPool = pgPoolService;
    }

    async findUserById(id: number) {
        const client = await this.pgPool.connect()

        try {
            return AuthDal.findUserById(client, id)
        } catch (error) {
            throw error
        } finally {
            client.release()
        }
    }
}

export default new AuthService(pool)
