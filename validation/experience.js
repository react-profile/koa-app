const Validator = require('validator');
const isEmpty = require('./is-empty');
const validateExperienceInput = data => {
    let errors = {};
    data.title = isEmpty(data.title)? '': data.title;
    data.company = isEmpty(data.company)? '': data.company;
    data.from = isEmpty(data.from)? '': data.from;

    if(Validator.isEmpty(data.title)) {
        errors.title = 'Do not allow blank title.';
    } 
    if(Validator.isEmpty(data.company)) {
        errors.company = 'Do not allow blank company.';
    }
    if(Validator.isEmpty(data.from)) {
        errors.from = 'Do not allow blank from.';
    }

    return {errors, isValid: isEmpty(errors)};
};
module.exports = validateExperienceInput;