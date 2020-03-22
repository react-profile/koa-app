const Validator = require('validator');
const isEmpty = require('./is-empty');
const validateProfileInput = data => {
    let errors = {};
    data.handle = isEmpty(data.handle) ? '' : data.handle;
    data.status = isEmpty(data.status) ? '' : data.status;
    data.skills = isEmpty(data.skills) ? '' : data.skills;

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Do not allow blank handle.';
    } else {
        if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
            errors.handle = 'The length of handle should be 2 at least and 40 at most.';
        }
    }
    if (Validator.isEmpty(data.status)) {
        errors.status = 'Do not allow blank status.';
    }
    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Do not allow blank skills.';
    }

    /* if (Validator.isEmpty(data.website)) {
        errors.website = 'Do not allow blank website.';
    } else { */
    if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
        errors.website = 'Invalid website.';
    }
    //}
    /* if (Validator.isEmpty(data.tengxunkt)) {
        errors.tengxunkt = 'Do not allow blank tengxunkt.';
    } else { */
    if (!isEmpty(data.tengxunkt) && !Validator.isURL(data.tengxunkt)) {
        errors.tengxunkt = 'Invalid tengxunkt.';
    }
    //}
    /* if(Validator.isEmpty(data.wangyiyunkt)) {
        errors.wangyiyunkt = 'Do not allow blank wangyiyunkt.';
    } else { */
    if (!isEmpty(data.wangyiyunkt) && !Validator.isURL(data.wangyiyunkt)) {
        errors.wangyiyunkt = 'Invalid wangyiyunkt.';
    }
    //}

    return { errors, isValid: isEmpty(errors) };
};
module.exports = validateProfileInput;