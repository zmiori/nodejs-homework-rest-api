const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(60).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: [Joi.string().min(4).max(10), Joi.number().min(4).max(10)],
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(60).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: [Joi.string().min(4).max(10), Joi.number().min(4).max(10)],
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

module.exports.validateAddContact = (req, _res, next) => {
  return validate(schemaAddContact, req.body, next);
};
module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};