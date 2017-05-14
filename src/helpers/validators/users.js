const isEmpty = require('lodash.isempty')
const validator = require('validator')

module.exports = {
  validateRegisterUser (data) {
    const errors = {}

    if (!data.email) {
      errors.email = 'Is required'
    } else if (typeof data.email !== 'string') {
      errors.email = 'Should be a string'
    } else if (!validator.isEmail(data.email)) {
      errors.email = 'Should have an email format'
    }

    if (!data.intention) {
      errors.intention = 'Is required'
    } else if (typeof data.intention !== 'string') {
      errors.intention = 'Should be a string'
    }

    if (!data.name) {
      errors.name = 'Is required'
    } else if (typeof data.name !== 'string') {
      errors.name = 'Should be a string'
    }

    return { errors, isValid: isEmpty(errors) }
  }
}
