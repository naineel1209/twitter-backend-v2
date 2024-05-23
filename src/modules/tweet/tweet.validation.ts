import Joi from 'joi';

export const createTweetSchema = Joi.object({
    tweet: Joi.string().trim().required().min(1).max(280)
})

export const updateTweetSchema = Joi.object({
    tweet: Joi.string().trim().required().min(1).max(280)
})

export const likeTweetParamSchema = Joi.object({
    id: Joi.number().required()
})

export const unlikeTweetParamSchema = Joi.object({
    id: Joi.number().required()
})
