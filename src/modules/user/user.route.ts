import {Router} from 'express';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {UserController} from './user.controller';
import {QueryParamsRequestValidator, RequestBodyValidator, RequestParamsValidator} from '../../providers/validator';
import {
    GetAllUsersQueryParamsSchema,
    GetSingleUserParamsSchema,
    UpdateUserSchema,
    UserForgotPasswordQueryParamsSchema,
    UserForgotPasswordSchema,
    UserResetPasswordSchema
} from './user.validation';
import {allowResetPasswordMiddleware} from '../../providers/reset-password-middleware';

const router: Router = Router();

//PATH: /api/user/

router
    .get('/my-profile', checkAuthenticated, UserController.myProfile)
    .get('/followers', checkAuthenticated, UserController.getFollowers)
    .get('/following', checkAuthenticated, UserController.getFollowing)
    //forgot password routes
    .get('/forgot-password', QueryParamsRequestValidator(UserForgotPasswordSchema), UserController.forgotPassword)
    .get('/verify-token', QueryParamsRequestValidator(UserForgotPasswordQueryParamsSchema), UserController.verifyToken)
    .post('/reset-password', RequestBodyValidator(UserResetPasswordSchema), allowResetPasswordMiddleware, UserController.resetPassword)
    
    .get('/', QueryParamsRequestValidator(GetAllUsersQueryParamsSchema), UserController.getAllUsers)
    .get('/:userId', RequestParamsValidator(GetSingleUserParamsSchema), UserController.getSingleUser)
    .get('/:userId/followers', checkAuthenticated, RequestParamsValidator(GetSingleUserParamsSchema), UserController.getUserFollowers)
    .get('/:userId/following', checkAuthenticated, RequestParamsValidator(GetSingleUserParamsSchema), UserController.getUserFollowing)
    .patch('/:userId', checkAuthenticated, RequestBodyValidator(UpdateUserSchema), UserController.updateUser)

export default router;
