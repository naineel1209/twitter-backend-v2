import {IUpdateUser} from './user';
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
}
