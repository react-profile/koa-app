const Validator = require('validator');
const isEmpty = require('./is-empty');
const validateRegisterInput = data => {
    let errors = {};
    data.name = isEmpty(data.name)? '': data.name;
    data.email = isEmpty(data.email)? '': data.email;
    data.password = isEmpty(data.password)? '': data.password;
    data.password2 = isEmpty(data.password2)? '': data.password2;

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Do not allow blank name.';
    } else {
        if (!Validator.isLength(data.name, {min: 3, max: 8})) {
            errors.name = 'The length of name should be 3 at least and 8 at most.';
        }
    }
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
    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Do not allow blank password2.';
    } else {
        if(!Validator.equals(data.password, data.password2)) {
            errors.password2 = 'password2 does not match password.';
        }
    }

    return {errors, isValid: isEmpty(errors)};
};
module.exports = validateRegisterInput;