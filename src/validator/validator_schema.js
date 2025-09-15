const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.base": "First name must be a string",
    "any.required": "First name is required"
  }),
  lastName: Joi.string().required().messages({
    "string.base": "Last name must be a string",
    "any.required": "Last name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required"
  })
});

const updateUserSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "User ID is required"
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});

function validate(schema, dto) {
  const { error, value } = schema.validate(dto, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map(d => d.message).join(", "));
  }
  return value;
}


module.exports = { createUserSchema,updateUserSchema,validate};
