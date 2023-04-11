const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({ "any.required": "missing required name field" }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required()
    .messages({ "any.required": "missing required email field" }),
  phone: Joi.string()
    .min(10)
    .max(15)
    .required()
    .messages({ "any.required": "missing required phone field" }),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: [Joi.string(), Joi.number().min(10).max(15)],
});

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
};
