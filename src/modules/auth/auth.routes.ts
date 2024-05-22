import {Router} from 'express';
import googleOAuthRouter from './/google-oauth/googleoauth.routes'
import localAuthRoutes from './local-auth/localauth.routes';
import {checkAuthenticated} from '../../middlewares/auth.middleware';
import {AuthController} from './auth.controller';

const router: Router = Router()

//Path : /api/auth

router.use(localAuthRoutes)
router.use('/google-oauth', googleOAuthRouter)

router.use('/logout', checkAuthenticated, AuthController.logoutController)

export default router
