import Joi from 'joi';

export const createTweetSchema = Joi.object({
    tweet: Joi.string().trim().required().min(1).max(280)
})

export const updateTweetSchema = Joi.object({
    tweet: Joi.string().trim().required().min(1).max(280)
})

export const updateTweetParamSchema = Joi.object({
    id: Joi.number().integer().required()
})

export const likeTweetParamSchema = Joi.object({
    id: Joi.number().integer().required()
})

export const unlikeTweetParamSchema = Joi.object({
    id: Joi.number().integer().required()
})

export const deleteTweetParamSchema = Joi.object({
    id: Joi.number().integer().required()
})

export const getTweetParamSchema = Joi.object({
    tweetId: Joi.number().integer().required(),
})

export const getFeedQuerySchema = Joi.object({
    limit: Joi.number().integer().default(10),
    offset: Joi.number().integer().default(0),
    search: Joi.string().trim().min(1).optional(),
})

export const getFollowingFeedQuerySchema  = Joi.object({
    limit: Joi.number().integer().default(10),
    offset: Joi.number().integer().default(0),
})
