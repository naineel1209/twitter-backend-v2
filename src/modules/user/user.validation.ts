import Joi from 'joi';

export const GetAllUsersQueryParamsSchema = Joi.object({
    limit: Joi.number().integer().optional(),
    offset: Joi.number().integer().optional(),
    search: Joi.string().trim().optional(),
});

export const GetSingleUserParamsSchema = Joi.object({
    userId: Joi.number().integer().required(),
});
