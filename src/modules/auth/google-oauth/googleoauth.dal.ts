import pg, {PoolClient} from 'pg';
import {IGoogleUserObj} from './googleoauth';
import httpStatus from 'http-status';
import {CustomError} from '../../../errors/custom-error';

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
                throw new CustomError('Could not create google user', httpStatus.INTERNAL_SERVER_ERROR, {
                    message: 'Could not create google user',
                    error: 'Could not create google user',
                    details: queryResult
                })
            }

            return queryResult.rows[0]
        } catch (error) {
            throw error
        }
    }
}
