const Joi = require('joi');
const uuidRegEx = require('./base');

const Notification = Joi.object({
    _id: Joi.string().pattern(uuidRegEx('notification')).required(),
    notificatiionTitle:  Joi.string().required(),
    notificatiionSubTitle:  Joi.string().optional(),
    notificatiionDescription:  Joi.string().optional(),
    notificationType:  Joi.string().valid('UPCOMMING_LECTURE', 'UPCOMMING_TEST', 'PENDING_ASSIGNMENT', 'PENDING_TEST', 'NOTICE'),
    created: Joi.date().iso().required(),
    ackByUser: Joi.boolean().required(),
});

module.export = Notification;
