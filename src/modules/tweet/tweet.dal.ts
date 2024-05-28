import pg from 'pg';
import {ICreateTweet, IGetFeed, IGetFollowingFeed, IUpdateTweet} from './tweet';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export class TweetDal {
    static async getFeed(client: pg.PoolClient, userId: number = -1, feedQuery: IGetFeed) {
        try {
            const getFeedQueryValues = [];
            let getFeedQueryText = `
                SELECT t.*,
                       u.username,
                       u.profile_pic,
                       u.name,
                       u.bio,
                       u.created_at as user_created_at
                FROM tweets t
                         INNER JOIN
                     users u
                     ON t.user_id = u.id
                WHERE t.is_deleted = false
            `;

            if (feedQuery.search) {
                getFeedQueryText += `AND t.tweet ILIKE $${getFeedQueryValues.length + 1} `
                getFeedQueryValues.push(`%${feedQuery.search}%`)
            }

            getFeedQueryText += `ORDER BY CASE WHEN t.user_id != $${getFeedQueryValues.length + 1} THEN 0 ELSE 1 END, t.created_at DESC `
            getFeedQueryValues.push(userId);

            if (feedQuery.limit) {
                getFeedQueryText += `LIMIT $${getFeedQueryValues.length + 1} `
                getFeedQueryValues.push(feedQuery.limit);
            }

            if (feedQuery.offset) {
                getFeedQueryText += `OFFSET $${getFeedQueryValues.length + 1} `
                getFeedQueryValues.push(feedQuery.offset);
            }

            const getFeedQuery = {
                text: getFeedQueryText,
                values: getFeedQueryValues,
            }

            const result = await client.query(getFeedQuery);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getTweet(client: pg.PoolClient, tweetId: number) {
        try {
            const getTweetQuery = {
                text: `SELECT t.*, u.username, u.profile_pic, u.name, u.bio, u.created_at as user_created_at
                       FROM (
                                tweets t
                                    INNER JOIN
                                    users u
                                ON t.user_id = u.id
                                )
                       WHERE t.id = $1
                         AND t.is_deleted = false;
                `,
                values: [tweetId]
            }

            const result = await client.query(getTweetQuery);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

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
                } else if (key === 'tweet') {
                    updateTweetQueryFields.push(`tweet = $${updateTweetQueryValues.length + 1}`)
                    updateTweetQueryValues.push(data[key])
                } else if (key === 'delete' && data[key] === true) {
                    updateTweetQueryFields.push(`is_deleted = true`)
                    updateTweetQueryFields.push(`deleted_at = NOW()`)
                }
            }

            updateTweetQueryFields.push(`updated_at = NOW()`)
            updateTweetQueryText += `SET ${updateTweetQueryFields.join(', ')} WHERE id = $${updateTweetQueryValues.length + 1} 
            AND 
            is_deleted = false
            AND
            user_id = $${updateTweetQueryValues.length + 2} 
            RETURNING *;`
            updateTweetQueryValues.push(data.tweetId)
            updateTweetQueryValues.push(data.userId)

            const updateTweetQuery = {
                text: updateTweetQueryText,
                values: updateTweetQueryValues,
            }

            const result = await client.query(updateTweetQuery)

            if (result.rowCount === 0) {
                throw new CustomError('Tweet not found', httpStatus.NOT_FOUND, {
                    message: 'Tweet not found',
                    error: 'Tweet not found',
                    details: data
                })
            }

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

    static async getFollowingFeed(client: pg.PoolClient, userId: number, feedQuery: IGetFollowingFeed) {
        try {

            const getFollowingFeedQueryValues = [];

            let getFollowingIdSubQueryText = `SELECT following_id
                                              FROM follower_following
                                              WHERE follower_id = $${getFollowingFeedQueryValues.length + 1}`;
            getFollowingFeedQueryValues.push(userId);

            let getFollowingFeedQueryText = `SELECT t.*,
                                                    u.username,
                                                    u.profile_pic,
                                                    u.name,
                                                    u.bio,
                                                    u.created_at as user_created_at
                                             FROM (
                                                      tweets t
                                                          INNER JOIN
                                                          (${getFollowingIdSubQueryText}) f
                                                      ON t.user_id = f.following_id
                                                      )
                                                      INNER JOIN users u ON t.user_id = u.id
                                             WHERE t.is_deleted = false
                                             ORDER BY t.created_at DESC 
            `;

            if (feedQuery.limit) {
                getFollowingFeedQueryText += `LIMIT $${getFollowingFeedQueryValues.length + 1} `;
                getFollowingFeedQueryValues.push(feedQuery.limit);
            }

            if (feedQuery.offset) {
                getFollowingFeedQueryText += `OFFSET $${getFollowingFeedQueryValues.length + 1} `;
                getFollowingFeedQueryValues.push(feedQuery.offset);
            }

            const getFollowingFeedQuery = {
                text: getFollowingFeedQueryText,
                values: getFollowingFeedQueryValues,
            }

            const result = await client.query(getFollowingFeedQuery)

            return result.rows;
        } catch (err) {
            throw err;
        }
    }
}
