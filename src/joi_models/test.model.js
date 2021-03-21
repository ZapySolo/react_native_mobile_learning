const Joi = require('joi');
const uuidRegEx = require('./base');

const Test = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('test')).required(),
    type: Joi.string().valid('QUIZ', 'EXAM', 'ASSIGNMENT').required(),
    duration: Joi.date().iso().required(),
    data: Joi.array().items(Joi.object({
        _id: Joi.string().required(),
        question: Joi.string().required(),
        questionType: Joi.string().valid('STRING', 'IMAGE'),
        answerType: Joi.string().valid('RADIO_BUTTON', 'FILE_UPLOAD', 'TEXT_INPUT', 'CHECKBOX'),
        answer: Joi.string().optional(),
        options: Joi.array().items({
            _id: Joi.string().required(),
            text: Joi.string().required(),
            isAnswer: Joi.boolean().required()
        }).optional(),
    })),
    isDeleted: Joi.boolean().required().default(false)
});

module.export = Test;
