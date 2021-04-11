const Joi = require('joi');
const uuidRegEx = require('./base');

const Class = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('class')).required(),
    teacherID: Joi.string().pattern(uuidRegEx('profile')).required(),
    students: Joi.array().items(Joi.object({
        teacherID: Joi.string().required()
    })),
    classTitle: Joi.string().optional(),
    classSubTitle: Joi.string().optional(),
    classDescription: Joi.string().optional(),
    classJoinCode: Joi.string().optional(),
    isDeleted: Joi.boolean().required().default(false),
    classProfileImage: Joi.string().required(),
});

module.export = Class;
