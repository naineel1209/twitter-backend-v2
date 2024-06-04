import Joi from 'joi';

export const createRetweetSchema = Joi.object({
    tweetId: Joi.number().integer().required()
});

export const undoRetweetSchema = Joi.object({
    tweetId: Joi.number().integer().required(),
});
