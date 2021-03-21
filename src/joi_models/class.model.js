const Joi = require('joi');
const uuidRegEx = require('./base');

const Class = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('class')).required(),
    teachers: Joi.array().items(Joi.object({
        teacherID: Joi.string().required()
    })),
    students: Joi.array().items(Joi.object({
        teacherID: Joi.string().required()
    })),
    classTitle: Joi.string().optional(),
    classSubTitle: Joi.string().optional(),
    classDescription: Joi.string().optional(),
    classJoinCode: Joi.string().optional(),
    isDeleted: Joi.boolean().required().default(false)
});

module.export = Class;
