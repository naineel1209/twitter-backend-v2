import Joi from 'joi';

export const FollowUserParamSchema = Joi.object({
    followUserId: Joi.string().trim().required()
});
