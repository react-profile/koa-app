const Validator = require('validator');
const isEmpty = require('./is-empty');
const validatePostInput = data => {
    let errors = {};
    data.text = isEmpty(data.text) ? '': data.text;
    if(Validator.isEmpty(data.text)) {
        errors.text = `Do not allow blank text.`;
    }
    if(!Validator.isLength(data.text, {min: 10, max: 300})) {
        errors.text = `The length of text must be between 10 and 300.`;
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}
module.exports = validatePostInput;