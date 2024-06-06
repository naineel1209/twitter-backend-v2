export {default as authRouter} from './auth/auth.route'
export {default as tweetRouter} from './tweet/tweet.route'
export {default as followerRouter} from './follower/follower.route'
export {default as userRouter} from './user/user.route'
export {default as retweetRouter} from './/retweet/retweet.route'

//TODO generic post engagements details like retweets, quotes, likes - get the post engagements details
//TODO:Lower remove the keys - liked_tweets_counts, tweets_count from the user object
//TODO optimize the returns from the functions in the service layer and dal layer
//TODO notification service
