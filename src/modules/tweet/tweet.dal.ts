import pg from 'pg';
import {ICreateTweet, IUpdateTweet} from './tweet';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export class TweetDal {
    static async createTweet(client: pg.PoolClient, data: ICreateTweet) {
        try {
            const {tweet, userId} = data;
            const createTweetQuery = {
                text: `INSERT INTO tweets
                           (tweet, user_id)
                       VALUES ($1, $2)
                       RETURNING *
                `,
                values: [tweet, userId]
            }

            const result = await client.query(createTweetQuery)

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async findTweetById(client: pg.PoolClient, tweetId: number) {
        try {
            const findTweetQuery = {
                text: `SELECT *
                       FROM tweets
                       WHERE id = $1`,
                values: [tweetId]
            }

            const result = await client.query(findTweetQuery)

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async updateTweet(client: pg.PoolClient, data: IUpdateTweet) {
        try {
            let updateTweetQueryText: string = `UPDATE tweets `;

            let updateTweetQueryFields = [];
            let updateTweetQueryValues = [];

            for (const key in data) {
                if (key === 'like' && data[key] === true) {
                    updateTweetQueryFields.push(`likes_count = likes_count + 1`)
                } else if (key === 'like' && data[key] === false) {
                    updateTweetQueryFields.push(`likes_count = likes_count - 1`)
                }

                if (key === 'tweet') {
                    updateTweetQueryFields.push(`tweet = $${updateTweetQueryValues.length + 1}`)
                    updateTweetQueryValues.push(data[key])
                }
            }

            updateTweetQueryText += `SET ${updateTweetQueryFields.join(', ')} WHERE id = $${updateTweetQueryValues.length + 1} RETURNING *;`
            updateTweetQueryValues.push(data.tweetId)

            const updateTweetQuery = {
                text: updateTweetQueryText,
                values: updateTweetQueryValues,
            }

            const result = await client.query(updateTweetQuery)

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async insertLike(client: pg.PoolClient, data: IUpdateTweet) {
        try {
            const insertLikeQuery = {
                text: `INSERT INTO likes
                           (user_id, tweet_id)
                       VALUES ($1, $2)
                       RETURNING *;
                `,
                values: [data.userId, data.tweetId]
            }

            const result = await client.query(insertLikeQuery)

            return result.rows[0]
        } catch (error) {
            throw error;
        }
    }

    static async deleteLike(client: pg.PoolClient, data: IUpdateTweet) {
        try {
            const deleteLikeQuery = {
                text: `DELETE
                       FROM likes
                       WHERE user_id = $1
                         AND tweet_id = $2
                       RETURNING *;
                `,
                values: [data.userId, data.tweetId]
            }

            const result = await client.query(deleteLikeQuery)

            if (result.rowCount === 0) {
                throw new CustomError('Could not delete like', httpStatus.INTERNAL_SERVER_ERROR, {
                    message: 'Could not delete like',
                    error: 'Could not delete like',
                    details: result
                })
            }

            return result.rows[0]
        } catch (error) {
            throw error;
        }
    }
}
