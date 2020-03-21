const Validator = require('validator');
const isEmpty = require('./is-empty');

//  로그인시 필요한 정보를 data 라고 지칭함
module.exports = function validateLoginInput(data) {
    const errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!Validator.isEmail(data.email)) {
        errors.email = "이메일 형식이 아닙니다."
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "eamil is required";
    }
    if (!Validator.isLength(data.password, { min:6, max: 30})) {
        errors.password = "패스워드는 최소 6글자를 충족시켜야 합니다.";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "패스워드가 틀립니다."
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};