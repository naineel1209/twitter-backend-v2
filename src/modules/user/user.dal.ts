import {IGetAllUsersQueryParams, IUpdateUser} from './user';
import pg from 'pg';
import {CustomError} from '../../errors/custom-error';
import httpStatus from 'http-status';

export class UserDal {
    static async updateUser(client: pg.PoolClient, data: IUpdateUser) {
        try {
            let updateUserQueryText = `UPDATE users `;
            let updateUserQueryFields = [];
            let updateUserQueryValues = [];

            for (const key in data) {
                switch (key) {
                    case 'followers_count':
                        if (data.followers_count) {
                            updateUserQueryFields.push('followers_count = followers_count + 1');
                        } else if (data.followers_count === false) {
                            updateUserQueryFields.push('followers_count = followers_count - 1');
                        }
                        break;
                    case 'following_count':
                        if (data.following_count) {
                            updateUserQueryFields.push('following_count = following_count + 1');
                        } else if (data.following_count === false) {
                            updateUserQueryFields.push('following_count = following_count - 1');
                        }
                        break;
                    case 'tweets_count':
                        if (data.tweets_count) {
                            updateUserQueryFields.push('tweets_count = tweets_count + 1');
                        } else if (data.tweets_count === false) {
                            updateUserQueryFields.push('tweets_count = tweets_count - 1');
                        }
                        break;
                    case 'liked_tweets_count':
                        if (data.liked_tweets_count) {
                            updateUserQueryFields.push('liked_tweets_count = liked_tweets_count + 1');
                        } else if (data.liked_tweets_count === false) {
                            updateUserQueryFields.push('liked_tweets_count = liked_tweets_count - 1');
                        }
                        break;
                    case 'userId':
                        break;
                    default:
                        updateUserQueryFields.push(`${key} = $${updateUserQueryValues.length + 1}`);
                        updateUserQueryValues.push(data[(key as keyof IUpdateUser)]);
                }
            }

            updateUserQueryFields.push('updated_at = NOW()');
            updateUserQueryText += `SET ${updateUserQueryFields.join(', ')} WHERE id = $${updateUserQueryValues.length + 1} RETURNING *;`;
            updateUserQueryValues.push(data.userId);

            const updateUserQuery = {
                text: updateUserQueryText,
                values: updateUserQueryValues,
            };

            const updatedUser = await client.query(updateUserQuery);

            if (updatedUser.rowCount === 0) {
                throw new CustomError('User not found', httpStatus.BAD_REQUEST, {
                    error: 'User not found',
                    details: data
                })
            }

            return updatedUser.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getFollowers(client: pg.PoolClient, userId: number) {
        try {
            const getFollowersQuery = {
                text: `SELECT users.* --details of the users following the current user
                       FROM (
                                follower_following ff
                                    INNER JOIN public.users users on
                                    ff.follower_id = users.id)
                       WHERE following_id = $1;`,
                values: [userId]
            };

            const result = await client.query(getFollowersQuery);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getFollowing(client: pg.PoolClient, userId: number) {
        try {
            const getFollowingQuery = {
                text: `SELECT users.* --details of the users the current user is following
                       FROM (follower_following ff INNER JOIN public.users users on ff.following_id = users.id)
                       WHERE follower_id = $1;`,
                values: [userId]
            };

            const result = await client.query(getFollowingQuery);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsers(client: pg.PoolClient, queryParams: IGetAllUsersQueryParams) {
        try {
            let getAllUsersQueryText = `SELECT *
                                        FROM users `;
            let getAllUsersQueryValues = [];

            if (queryParams.search) {
                getAllUsersQueryText += `WHERE username ILIKE $${getAllUsersQueryValues.length + 1} OR name ILIKE $${getAllUsersQueryValues.length + 1}`;
                getAllUsersQueryValues.push(`%${queryParams.search}%`);

                if (queryParams.limit) {
                    getAllUsersQueryText += ` LIMIT $${getAllUsersQueryValues.length + 1}`;
                    getAllUsersQueryValues.push(queryParams.limit);
                }

                if (queryParams.offset) {
                    getAllUsersQueryText += ` OFFSET $${getAllUsersQueryValues.length + 1}`;
                    getAllUsersQueryValues.push(queryParams.offset); //for the first page offset = 0, for the second page offset = previous offset + limit
                }
            } else if (queryParams.userId) {
                getAllUsersQueryText += ` WHERE id = $${getAllUsersQueryValues.length + 1}`;
                getAllUsersQueryValues.push(queryParams.userId);
            }

            getAllUsersQueryText += ';';

            const getAllUsersQuery = {
                text: getAllUsersQueryText,
                values: getAllUsersQueryValues,
            };

            const result = await client.query(getAllUsersQuery);

            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    static async findUserByEmailOrUsername(client: pg.PoolClient, userIdentity: string) {
        try{
            const findUserQuery = {
                text: `SELECT * FROM users WHERE username = $1 OR email = $1`,
                values: [userIdentity]
            };

            const result = await client.query(findUserQuery);

            if(result.rowCount === 0){
                throw new CustomError('User not found', httpStatus.NOT_FOUND, {
                    error: 'User not found',
                    details: userIdentity
                })
            }

            return result.rows[0];
        }catch(err){
            throw err;
        }
    }
}
