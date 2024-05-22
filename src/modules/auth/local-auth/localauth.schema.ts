import Joi from 'joi';

export const LocalRegisterSchema = Joi.object({
    username: Joi.string().trim().required(),
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().optional(),
    password: Joi.string().trim().required(),
})

export const LocalLoginSchema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
})
