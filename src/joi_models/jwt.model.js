const Joi = require('joi');
const uuidRegEx = require('./base');

const JWT = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('jwt')).required(),
    token: Joi.object().required(),
    isDeleted: Joi.boolean().required().default(false)
});

module.export = JWT;
