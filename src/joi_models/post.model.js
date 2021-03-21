const Joi = require('joi');
const uuidRegEx = require('./base');

const Post = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('post')).required(),
    classID: Joi.string().required(),
    postTitle:Joi.string().required(),
    postDescription:Joi.string().optional(),
    postSubtitle:Joi.string().optional(),
    type: Joi.string().valid('COMPLETED_LECTURE', 'NEW_ASSIGNMET', 'POST').required(),
    isDeleted: Joi.boolean().required().default(false)
});

module.export = Post;
