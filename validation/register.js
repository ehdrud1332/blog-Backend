//회원가입시 사용자입력값에대한 설정, 지정
const Validator = require('validator');
const isEmpty = require('./is-empty');

// 회원가입시 필요한 정보를 data라고 지칭
module.exports = function validateRegisterInput(data) {
    const errors = {};

    // ?
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    //컴펌 패스워드
    data.password2 = !isEmpty(data.password2) ? data.password : '';

    // 여기서 isEmpty는 validator안에 들어 있는 함수이다.
    if (Validator.isEmpty(data.name)) {
        errors.msg = "name field is required";
    }
    if (Valitator.isEmpty(data.email)) {
        errors.msg = "email is required";
    }
    if (Valitator.isEmpty(data.password)) {
        errors.msg = "password is required";
    }
    if (Valitator.isEmpty(data.password2)) {
        errors.msg = "password2 is required";
    }

    if (!Valitator.isLength(data.name, { min:2, max: 30})) {
        errors.name = "Name must be between 2 and 30 characters";
    }
    if (!Valitator.isEmail(data.email)) {
        errors.email = "Email is required";
    }
    if (!Valitator.isLength(data.password, { min:6, max: 30})) {
        errors.password = "password must be at least 6 characters";
    }
    if (!Valitator.equals(data.password, data.password2)) {
        errors.password2 = "password much match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
