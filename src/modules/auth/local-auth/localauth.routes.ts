import {Router} from 'express'
import passport from 'passport';
import {localAuthStrategy} from './localauth.strategy';
import {LocalAuthController} from './localauth.controller';
import {RequestBodyValidator} from '../../../providers/validator.provider';
import {LocalLoginSchema, LocalRegisterSchema} from './localauth.schema';

const router = Router()

//Path: /api/auth/
passport.use('local', localAuthStrategy)

router.post('/login', RequestBodyValidator(LocalLoginSchema), passport.authenticate('local', {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/failure',
}))

router.post('/register'
    , RequestBodyValidator(LocalRegisterSchema)
    , LocalAuthController.localRegister
)

router.get('/success', LocalAuthController.success)

router.get('/failure', LocalAuthController.failure)

export default router
