import pool from '../../../config/pg.config';
import pg from 'pg';
import {IFollowUser} from './follower';
import httpStatus from 'http-status';
import {CustomError} from '../../errors/custom-error';
import {AuthDal} from '../auth/auth.dal';
import {UtilsService} from '../../utils/utils.service';
import {UserDal} from '../user/user.dal';
import {FollowerDal} from './follower.dal';

class FollowerService {
    constructor(private pgPool: pg.Pool) {
    }

    async followUser(data: IFollowUser) {
        if (data.userId === data.followUserId) {
            throw new CustomError('You cannot follow yourself', httpStatus.BAD_REQUEST, {
                error: 'You cannot follow yourself',
            });
        }

        const client = await this.pgPool.connect();

        try {
            const followUserExists = await AuthDal.findUserById(client, data.followUserId);

            if (!followUserExists) {
                throw new CustomError('User not found', httpStatus.NOT_FOUND, {
                    error: 'User not found',
                });
            }

            const ops = async () => {
                const finalResultOps = [];

                //UPDATE following count in current user
                const updatedUser = await UserDal.updateUser(client, {userId: data.userId, following_count: true});
                finalResultOps.push(updatedUser);

                //UPDATE followers count in follow user
                const updatedFollowUser = await UserDal.updateUser(client, {userId: data.followUserId, followers_count: true})

                //INSERT into followers table
                const followUser = await FollowerDal.followUser(client, data);

                return finalResultOps;
            }

            const finalResultOps = await UtilsService.transactionWrapper(client, ops);

            return finalResultOps[finalResultOps.length - 1]; //return the last operation result
        } catch (err) {
            throw err;
        }finally {
            client.release();
        }
    }

    async unfollowUser(data: IFollowUser) {
        if(data.userId  === data.followUserId){
            throw new CustomError('You cannot unfollow yourself', httpStatus.BAD_REQUEST, {
                error: 'You cannot unfollow yourself',
            });
        }

        const client = await this.pgPool.connect();

        try{
            const followUserExists = await AuthDal.findUserById(client, data.followUserId);

            if(!followUserExists){
                throw new CustomError('User not found', httpStatus.NOT_FOUND, {
                    error: 'User not found',
                });
            }

            const ops = async () => {
                const finalResultOps = [];

                //UPDATE following count in current user
                const updatedUser = await UserDal.updateUser(client, {userId: data.userId, following_count: false});
                finalResultOps.push(updatedUser);

                //UPDATE followers count in follow user
                const updateFollowUser = await UserDal.updateUser(client, {userId: data.followUserId, followers_count: false});

                //DELETE from followers table
                const unfollowUser = await FollowerDal.unfollowUser(client, data);

                return finalResultOps;
            }

            const finalResultOps = await UtilsService.transactionWrapper(client, ops);

            return finalResultOps[finalResultOps.length - 1]; //return the last operation result
        }catch(err){
            throw err;
        }finally{
            client.release();
        }
    }
}

export default new FollowerService(pool)
