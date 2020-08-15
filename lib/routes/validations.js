const Joi = require('@hapi/joi')

const creationSchema = Joi.object({
  message: {
    messageType: Joi.string().valid('PRAYER', 'PRAISE').required(),
    messageText: Joi.string().required(),
    sharedStatus: Joi.string()
      .valid(
        'SHARED_WITH_EVERYONE',
        'SHARED_WITH_PRAYER_TEAM',
        'SHARED_WITH_NOONE'
      )
      .required()
  }
})

const updateSchema = Joi.object({
  message: {
    messageText: Joi.string().required(),
    sharedStatus: Joi.string()
      .valid(
        'SHARED_WITH_EVERYONE',
        'SHARED_WITH_PRAYER_TEAM',
        'SHARED_WITH_NOONE'
      )
      .required()
  }
})

module.exports = {
  creationSchema,
  updateSchema
}
