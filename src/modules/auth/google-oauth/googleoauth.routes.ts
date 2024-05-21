import {Router} from 'express';
import passport from 'passport';
import {googleoauthStrategy} from './googleoauth.strategy';

const router = Router()

//PATH: /api/auth/google-oauth

//TODO: Cleanup the code here
passport.use('google', googleoauthStrategy)
passport.serializeUser((user, done) => {
    console.log('Serializing User')
    console.log(user)

    return done(null, user)
})

//deserialize user will be called when the user is authenticated and the user object is stored in the session
passport.deserializeUser((user, done) => {
    console.log('Deserializing User')
    console.log(user)

    return done(null, user as Express.User)
})

router.get('/', passport.authenticate('google'))

router.get('/success', (req, res) => {
    return res.send('Google OAuth Success')
})

router.get('/failure', (req, res) => {
    return res.send('Google OAuth Failure')
})

router.get('/callback', passport.authenticate('google', {
    successRedirect: '/api/auth/google-oauth/success',
    failureRedirect: '/api/auth/google-oauth/failure',
}))

export default router;
