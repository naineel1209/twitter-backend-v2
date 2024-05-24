export type IUpdateUser = {
    userId : number
    username?: string
    email?: string
    password?: string
    profile_pic?: string
    bio?: string
    dob?: string
    cover_pic?: string
    is_deleted?: boolean
    followers_count?: boolean
    following_count?: boolean
    tweets_count?: boolean
    liked_tweets_count?: boolean
}
