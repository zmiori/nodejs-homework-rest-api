const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(60).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: [Joi.string().min(4).max(20), Joi.number().min(4).max(10)],
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(2).max(60).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: [Joi.string().min(4).max(10), Joi.number().min(4).max(10)],
  favorite: Joi.boolean().optional(),
});

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.boolean().required(),
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

module.exports.validateStatusFavorite = (req, _res, next) => {
  return validate(schemaUpdateFavorite, req.body, next);
};
