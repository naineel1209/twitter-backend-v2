import pool from "../../../../config/pg.config";
import pg from "pg";
import {Profile} from "passport-google-oauth20";
import {GoogleOAuthDal} from "./googleoauth.dal";
import {UtilsService} from "../../../utils/utils.service";
import {IGoogleUserObj} from "./googleoauth.interface";

class GoogleOAuthService {
    private pgPool: pg.Pool;

    constructor(pgPoolService: pg.Pool) {
        this.pgPool = pgPoolService;
    }

    async findOrCreateGoogleUser(profile: Profile, refreshToken: string) {
        const client = await this.pgPool.connect()

        try {
            //1. Check if the user exists in the database
            const userExists = await GoogleOAuthDal.findUserByGoogleId(client, profile.id)
            //2. If the user exists, return the user
            if (userExists) {
                return userExists
            }

            const googleUserObj:IGoogleUserObj = {
                username: await UtilsService.generateUsername(profile.displayName),
                name: profile.displayName,
                // @ts-ignore
                email: profile.emails[0].value,
                // @ts-ignore
                profilePicture: (profile.photos && profile.photos[0].value) || '',
                googleRefreshToken: refreshToken,
                googleId: profile.id,
                loginType: 'google',
            }

            //3. If the user does not exist, create the user and return the user
            return await GoogleOAuthDal.createGoogleUser(client, googleUserObj)
        } catch (error) {

        } finally {
            client.release()
        }
    }

    async findUserById(id: number) {
        const client = await this.pgPool.connect()

        try {
            return GoogleOAuthDal.findUserById(client, id)
        } catch (error) {
            throw error
        } finally {
            client.release()
        }
    }
}

export default new GoogleOAuthService(pool)
