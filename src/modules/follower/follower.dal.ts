import {IFollowUser} from './follower';
import pg from 'pg';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export class FollowerDal {
    static async followUser(client: pg.PoolClient, data: IFollowUser) {
        try {
            const followUserQuery = {
                text: `INSERT INTO follower_following (follower_id, following_id)
                       VALUES ($1, $2)
                       RETURNING *;`,
                values: [data.userId, data.followUserId]
            }

            const result = await client.query(followUserQuery);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async unfollowUser(client: pg.PoolClient, data: IFollowUser) {
        try {
            const unfollowUserQuery = {
                text: 'DELETE FROM follower_following WHERE follower_id = $1 AND following_id = $2 RETURNING *;',
                values: [data.userId, data.followUserId]
            }

            const result  = await client.query(unfollowUserQuery);

            if(result.rowCount === 0){
                throw new CustomError('Could not unfollow user', httpStatus.INTERNAL_SERVER_ERROR, {
                    message: 'Could not unfollow user',
                    error: 'Could not unfollow user'
                })
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}
