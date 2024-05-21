import {GoogleCallbackParameters, Profile, Strategy as GoogleStrategy, VerifyCallback} from 'passport-google-oauth20';
import processEnv from '../../../../constants/env/env.constants';
import {CALLBACK_URL, GOOGLE_SCOPES} from '../../../../constants/constants';
import googleoauthService from "./googleoauth.service";

export const googleoauthStrategy = new GoogleStrategy({
        clientID: processEnv.GOOGLE_CLIENT_ID,
        clientSecret: processEnv.GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
        scope: GOOGLE_SCOPES,
    },
    async (accessToken: string,
           refreshToken: string,
           params: GoogleCallbackParameters,
           profile: Profile,
           done: VerifyCallback,) => {
        try {
            const user = await googleoauthService.findOrCreateGoogleUser(profile, refreshToken)

            const cookieUser = {
                id: user.id,
                username: user.username,
                accessToken: accessToken,
            }
            if (user) {
                return done(null, cookieUser)
            }

            return done(null, false, {
                message: 'User not found'
            })
        } catch (error) {
            done(error, false, {
                message: 'Error in Google OAuth Strategy',
                error: error
            })
        }
    })
