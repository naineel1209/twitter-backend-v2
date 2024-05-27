import {Router} from 'express';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {UserController} from './user.controller';
import {QueryParamsRequestValidator, RequestParamsValidator} from '../../providers/validator';
import {GetAllUsersQueryParamsSchema, GetSingleUserParamsSchema} from './user.validation';

const router: Router = Router();

//PATH: /api/user/

router
    .get('/my-profile', checkAuthenticated, UserController.myProfile)
    .get('/followers', checkAuthenticated, UserController.getFollowers)
    .get('/following', checkAuthenticated, UserController.getFollowing)

    //TODO User management routes - updates, delete, password change, etc.
    .get('/', QueryParamsRequestValidator(GetAllUsersQueryParamsSchema), UserController.getAllUsers)
    .get('/:userId', RequestParamsValidator(GetSingleUserParamsSchema), UserController.getSingleUser)

export default router;
