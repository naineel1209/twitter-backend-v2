import pg from 'pg';
import {ICreateTweet, IGetFeed, IGetFollowingFeed, IQuoteTweet, IUpdateTweet} from './tweet';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export class TweetDal {
    static async getFeed(client: pg.PoolClient, userId: number = -1, feedQuery: IGetFeed) {
        try {
            const getFeedQueryValues = [];
            let getFeedQueryText = `
                SELECT t1.*,
                       u1.username,
                       u1.profile_pic,
                       u1.name,
                       u1.bio,
                       u1.created_at  AS user_created_at,
                       t2.tweet       AS attachment_tweet,
                       u2.username    AS attachment_tweet_username,
                       u2.profile_pic AS attachment_tweet_profile_pic,
                       u2.name        AS attachment_tweet_user_name,
                       u2.bio         AS attachment_tweet_bio,
                       u2.created_at  AS attachment_tweet_user_created_at
                FROM tweets t1
                         LEFT JOIN tweets t2 ON t1.attachment_tweet_id = t2.id
                         INNER JOIN users u1 ON t1.user_id = u1.id
                         LEFT JOIN users u2 ON t2.user_id = u2.id
                WHERE t1.is_deleted = false
            `;

            if (feedQuery.search) {
                getFeedQueryText += `AND t1.tweet ILIKE $${getFeedQueryValues.length + 1} `
                getFeedQueryValues.push(`%${feedQuery.search}%`)
            }

            getFeedQueryText += `ORDER BY CASE WHEN t1.user_id != $${getFeedQueryValues.length + 1} THEN 0 ELSE 1 END, t1.created_at DESC `
            getFeedQueryValues.push(userId);

            if (feedQuery.limit) {
                getFeedQueryText += `LIMIT $${getFeedQueryValues.length + 1} `
                getFeedQueryValues.push(feedQuery.limit);
            }

            if (feedQuery.offset) {
                getFeedQueryText += `OFFSET $${getFeedQueryValues.length + 1} ;`
                getFeedQueryValues.push(feedQuery.offset);
            } else {
                getFeedQueryText += `;`
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

    static async createTweet(client: pg.PoolClient, data: ICreateTweet | IQuoteTweet) {
        try {
            const createTweetQueryFields: string[] = [];
            const createTweetQueryValues: any[] = [];
            const createTweetParameters: string[] = [];

            Object.keys(data).forEach((key, index) => {
                if (key === 'attachmentTweetId') {
                    createTweetQueryFields.push('attachment_tweet_id')
                    createTweetParameters.push(`$${createTweetQueryValues.length + 1}`)
                    createTweetQueryValues.push((data as IQuoteTweet)[key])

                    createTweetQueryFields.push('is_quote_tweet')
                    createTweetParameters.push(`$${createTweetQueryValues.length + 1}`)
                    createTweetQueryValues.push(true)
                } else if (key === 'userId') {
                    createTweetQueryFields.push('user_id')
                    createTweetParameters.push(`$${createTweetQueryValues.length + 1}`)
                    createTweetQueryValues.push((data as IQuoteTweet)[key])
                } else if (key === 'tweet') {
                    createTweetQueryFields.push('tweet')
                    createTweetParameters.push(`$${createTweetQueryValues.length + 1}`)
                    createTweetQueryValues.push((data as IQuoteTweet)[key])
                }
            })

            const createTweetQueryText = `INSERT INTO tweets (${createTweetQueryFields.join(',')})
                                          VALUES (${createTweetParameters.join(',')});
            `;

            const createTweetQuery = {
                text: createTweetQueryText,
                values: createTweetQueryValues,
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
                } else if (key === 'retweet' && data[key] === true) {
                    updateTweetQueryFields.push(`retweets_count = retweets_count + 1`)
                } else if (key === 'retweet' && data[key] === false) {
                    updateTweetQueryFields.push(`retweets_count = retweets_count - 1`)
                } else if (key === 'quote' && data[key] === true) {
                    updateTweetQueryFields.push(`quotes_count = quotes_count + 1`)
                } else if (key === 'quote' && data[key] === false) {
                    updateTweetQueryFields.push(`quotes_count = quotes_count - 1`)
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
            ${((data.tweet || data.delete) && data.userId) ? `AND user_id = $${updateTweetQueryValues.length + 2}` : ''} 
            RETURNING *;`
            updateTweetQueryValues.push(data.tweetId)
            if ((data.tweet || data.delete) && data.userId){
                updateTweetQueryValues.push(data.userId)
            }

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
