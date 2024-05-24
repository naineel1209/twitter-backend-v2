import {Router} from 'express';
import {RequestParamsValidator} from '../../providers/validator';
import {FollowUserParamSchema} from './follower.validation';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {FollowerController} from './follower.controller';

const router: Router = Router();

// Path: /api/follower

router
    .post('/:followUserId/follow', checkAuthenticated, RequestParamsValidator(FollowUserParamSchema), FollowerController.followUser)
    .post('/:followUserId/unfollow', checkAuthenticated, RequestParamsValidator(FollowUserParamSchema), FollowerController.unfollowUser)

export default router;
