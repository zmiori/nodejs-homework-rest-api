const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaUser = Joi.object({
  password: Joi.string().required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),

  subscription: Joi.string(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: HttpCode.BAD_REQUEST, message: err.message });
  }
};

module.exports.validateUser = (req, _res, next) => {
  return validate(schemaUser, req.body, next);
};
