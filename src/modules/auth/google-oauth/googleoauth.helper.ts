import GoogleOAuthService from "./googleoauth.service";

export const passportSerializeCallback = (user: Express.User, done: (err: any, id?: unknown) => void) :void => {
    console.log('Serializing User')
    console.log(user)
    return done(null, user)
}

export const passportDeSerializeCallback = async (user: any, done: (err: any, user?: any) => void) => {
    console.log('Deserializing User')

    const deSerializedUser = await GoogleOAuthService.findUserById(user.id)

    return done(null, deSerializedUser)
}
