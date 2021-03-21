const Joi = require('joi');
const uuidRegEx = require('./base');

const Answer = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('answer')).required(),
    studentID: Joi.string().required(),
    testID: Joi.string().required(),
    answers: Joi.array().items(Joi.object({
        questionID: Joi.string().required(),
        type: Joi.string().valid('RADIO_BUTTON', 'FILE_UPLOAD', 'TEXT_INPUT', 'CHECKBOX'),
        
        answer: Joi.array().items(Joi.object({
            optionID: Joi.string().optional()
        })).optional(),

        answerText: Joi.string().optional(),
        
        answer: Joi.object({
            optionID: Joi.string().optional()
        }).optional(),

    })),
    isDeleted: Joi.boolean().required().default(false)
});

module.export = Answer;
