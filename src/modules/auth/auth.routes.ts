import {Router} from 'express';
import googleOAuthRouter from './/google-oauth/googleoauth.routes'

const router = Router()

//Path : /api/auth

router.use('/google-oauth', googleOAuthRouter)

export default router
