import Joi from "joi";

export default {
  create: {
    body: Joi.object({
      username: Joi.string().email().required(),
      password: Joi.string().min(5).max(255).required(),
      firstName: Joi.string()
        .regex(/^[A-Za-z]+$/)
        .required(),
      lastName: Joi.string()
        .regex(/^[A-Za-z]+$/)
        .required(),
    }),
  },

  get: {
    params: {
      id: Joi.number().required(),
    },
  },

  update: {
    params: {
      id: Joi.number().required(),
    },
    body: Joi.object({
      password: Joi.string().min(5).max(255).required(),
      firstName: Joi.string().regex(/^[A-Za-z]+$/),
      lastName: Joi.string().regex(/^[A-Za-z]+$/),
    }).or("password", "firstName", "lastName"),
  },

  delete: {
    params: {
      id: Joi.number().required(),
    },
  },
};
