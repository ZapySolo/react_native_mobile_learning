const Joi = require('joi');
const uuidRegEx = require('./base');

const User = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('profile')).required(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    password: Joi.object({
        salt: Joi.string().required(),
        hash: Joi.string().required()
    }).required(),
    profileImageUrl:Joi.string().optional(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    allowPushNotification: Joi.boolean().required(),
    allowEmailNotification: Joi.boolean().required(),
    type: Joi.string().valid('ADMIN', 'USER').required(),
    isDeleted: Joi.boolean().required().default(false),
    created: Joi.date().iso().optional()
});

module.export = User;

// let user1 = User.validate({
//     _id: 'profile:6deb7af5-10b0-4a17-b995-31b684e71ce4',
//     username: 'abc',
//     password: {
//         salt: 'abc',
//         hash:'abc'
//     },
//     profileImageUrl:'abc.com/img',
//     email:'email@e.com',
//     allowPushNotification: true,
//     allowEmailNotification: false,
//     isDeleted: false,
//     created: new Date().toISOString(),
//     type: 'USER'
// })

// console.log(user1);