import pg from 'pg';
import {ICreateTweet, ILikeTweet, IUpdateTweet} from './tweet';

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
            const updateTweetQuery = {
                text: `UPDATE tweets
                       SET tweet = $1
                       WHERE id = $2
                       RETURNING *`,
                values: [data.tweet, data.tweetId]
            }

            const result = await client.query(updateTweetQuery)

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    static async updateTweetLike(client: pg.PoolClient, data: { tweetId: number }) {
        try {
            const updateTweetLikeQuery = {
                text: `UPDATE tweets
                       SET likes_count = likes_count + 1
                       WHERE id = $1
                       RETURNING *;
                `,
                values: [data.tweetId]
            }

            const result = await client.query(updateTweetLikeQuery)

            return result.rows[0]
        } catch (error) {
            throw error;
        }
    }

    static async insertLike(client: pg.PoolClient, data: ILikeTweet) {
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
}
