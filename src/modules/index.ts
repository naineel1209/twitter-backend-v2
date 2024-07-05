export {default as authRouter} from './auth/auth.route';
export {default as tweetRouter} from './tweet/tweet.route';
export {default as followerRouter} from './follower/follower.route';
export {default as userRouter} from './user/user.route';
export {default as retweetRouter} from './/retweet/retweet.route';

//TODO remove create a requestHandler middleware and validate function from the express-validation
//TODO remove the try catch block from the controllers, services and dal and use the requestHandler middleware
//TODO remove the try catch block from the routes and use the requestHandler middleware
// TODO ensure dependency injection at all places in the code
//TODO:Lower remove the keys - liked_tweets_counts, tweets_count from the user object
//TODO optimize the returns from the functions in the service layer and dal layer
//TODO notification service
