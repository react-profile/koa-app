const Validator = require('validator');
const isEmpty = require('./is-empty');
const validateEducationInput = data => {
    let errors = {};
    data.school = isEmpty(data.school)? '': data.school;
    data.degree = isEmpty(data.degree)? '': data.degree;
    data.from = isEmpty(data.from)? '': data.from;
    data.fieldofstudy = isEmpty(data.fieldofstudy)? '': data.fieldofstudy;

    if(Validator.isEmpty(data.school)) {
        errors.school = 'Do not allow blank school.';
    } 
    if(Validator.isEmpty(data.degree)) {
        errors.degree = 'Do not allow blank degree.';
    }
    if(Validator.isEmpty(data.from)) {
        errors.from = 'Do not allow blank from.';
    }
    if(Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Do not allow blank fieldofstudy.';
    }


    return {errors, isValid: isEmpty(errors)};
};
module.exports = validateEducationInput;