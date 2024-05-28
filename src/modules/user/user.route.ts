import {Router} from 'express';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {UserController} from './user.controller';
import {QueryParamsRequestValidator, RequestBodyValidator, RequestParamsValidator} from '../../providers/validator';
import {
    GetAllUsersQueryParamsSchema,
    GetSingleUserParamsSchema,
    UpdateUserSchema,
    UserForgotPasswordSchema
} from './user.validation';

const router: Router = Router();

//PATH: /api/user/

router
    .get('/my-profile', checkAuthenticated, UserController.myProfile)
    .get('/followers', checkAuthenticated, UserController.getFollowers)
    .get('/following', checkAuthenticated, UserController.getFollowing)
    .get('/forgot-password', RequestBodyValidator(UserForgotPasswordSchema), UserController.forgotPassword)

    //TODO User management routes - updates, delete, password change, etc.
    .get('/', QueryParamsRequestValidator(GetAllUsersQueryParamsSchema), UserController.getAllUsers)
    .get('/:userId', RequestParamsValidator(GetSingleUserParamsSchema), UserController.getSingleUser)
    .get('/:userId/followers', checkAuthenticated, RequestParamsValidator(GetSingleUserParamsSchema), UserController.getUserFollowers)
    .get('/:userId/following', checkAuthenticated, RequestParamsValidator(GetSingleUserParamsSchema), UserController.getUserFollowing)
    .patch('/:userId', checkAuthenticated, RequestBodyValidator(UpdateUserSchema), UserController.updateUser)

export default router;
