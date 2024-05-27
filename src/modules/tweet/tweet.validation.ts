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
