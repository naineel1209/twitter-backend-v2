import pg from 'pg';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export class RetweetDal {
    static async createRetweet(client: pg.PoolClient, tweetId: number, userId: number) {
        try {
            const createRetweetQuery = {
                text: 'INSERT INTO retweets(tweet_id, user_id) VALUES($1, $2) RETURNING *',
                values: [tweetId, userId],
            }

            const result = await client.query(createRetweetQuery);

            if (result.rowCount === 0) {
                throw new CustomError('Could not retweet the tweet', httpStatus.BAD_REQUEST);
            }

            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async undoRetweet(client: pg.PoolClient, tweetId: number, userId: number) {
        try {
            const undoRetweetQuery = {
                text: 'DELETE FROM retweets WHERE tweet_id = $1 AND user_id = $2 RETURNING *',
                values: [tweetId, userId],
            }
            const result = await client.query(undoRetweetQuery);

            if (result.rowCount === 0) {
                throw new CustomError('Could not undo the retweet', httpStatus.BAD_REQUEST);
            }

            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }
}
