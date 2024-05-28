import Joi from 'joi';

export const GetAllUsersQueryParamsSchema = Joi.object({
    limit: Joi.number().integer().default(10).optional(),
    offset: Joi.number().integer().default(0).optional(),
    search: Joi.string().trim().optional(),
});

export const GetSingleUserParamsSchema = Joi.object({
    userId: Joi.number().integer().required(),
});

export const UpdateUserSchema = Joi.object({
    username: Joi.string().trim().optional(),
    name: Joi.string().trim().optional(),
    email: Joi.string().email().optional(),
    bio: Joi.string().trim().optional(),
    dob: Joi.string().isoDate().optional(),
    profile_pic: Joi.string().uri().optional(),
    cover_pic: Joi.string().uri().optional(),
})

export const UserForgotPasswordSchema = Joi.object({
    userIdentity: Joi.string().trim().required(),
})
