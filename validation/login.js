const Validator = require('validator');
const isEmpty = require('./is-empty');
const validateLoginInput = data => {
    let errors = {};
    data.email = isEmpty(data.email)? '': data.email;
    data.password = isEmpty(data.password)? '': data.password;

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Do not allow blank email.';
    } else {
        if(!Validator.isEmail(data.email)) {
            errors.email = 'Invalid email.';
        }
    }
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Do not allow blank password.';
    } else {
        if (!Validator.isLength(data.password, {min: 6, max: 30})) {
            errors.password = 'The length of password should be 6 at least and 30 at most.';
        }
    }

    return {errors, isValid: isEmpty(errors)};
};
module.exports = validateLoginInput;