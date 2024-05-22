import pg, {PoolClient} from 'pg';
import {IGoogleUserObj} from './googleoauth';

export class GoogleOAuthDal {

    static async findUserByGoogleId(client: pg.PoolClient, googleId: string) {
        try {
            //1. Write a query to find a user by googleId
            const userByGoogleIdQuery = {
                text: 'SELECT * FROM users WHERE google_id = $1',
                values: [googleId]
            };

            //2. Execute the query
            const result = await client.query(userByGoogleIdQuery)

            //3. Return the user
            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async createGoogleUser(client: PoolClient, googleUserObj: IGoogleUserObj) {
        try {
            const {username, name, googleId, googleRefreshToken, profilePicture, loginType, email} = googleUserObj
            const createGoogleUserQuery = {
                text: `INSERT INTO users
                    (username, name, google_id, google_refresh_token, profile_pic, login_type, email) 
                    VALUES
                    ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *
                    `,
                values: [username, name, googleId, googleRefreshToken, profilePicture, loginType, email]
            };

            const queryResult = await client.query(createGoogleUserQuery)

            if (queryResult.rowCount === 0) {
                throw new Error(`Error in creating google user with googleId: ${googleId}`)
            }

            return queryResult.rows[0]
        } catch (error) {
            throw error
        }
    }
}
