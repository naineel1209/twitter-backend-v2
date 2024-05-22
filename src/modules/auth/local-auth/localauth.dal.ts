import pg from 'pg';
import {ILocalUserObj} from './localauth';

export class LocalAuthDal {
    static async findUserByUsername(client: pg.PoolClient, username: string) {
        try {
            const findUserQuery = {
                text: 'SELECT * FROM users WHERE username = $1',
                values: [username]
            }

            const result = await client.query(findUserQuery);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async registerLocalUser(client: pg.PoolClient, data: ILocalUserObj) {
        try {
            const {username, name, email, password} = data;

            const registerUserQuery = {
                text: `INSERT INTO users(${Object.keys(data).join(', ')})
                       VALUES (${Object.keys(data).map((_, index) => `$${index + 1}`).join(', ')})
                `,
                values: Object.values(data)
            }

            const result = await client.query(registerUserQuery);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}
