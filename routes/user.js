const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY)

const {
    user_signUp,
    user_login,
    user_google_login,
    user_facebook_login,
    user_current,
    user_update,
    user_delete,
    user_get_all
} = require('../controller/user');
const userModel = require('../model/user');
//session : DB의 캐시메모리
const checkAuth = passport.authenticate('jwt', {session: false});

router.post('/signup', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
      return res.json(errors);
    }

    // 유저모델에서 유저이메일 유무체크 -> 있으면 이메일있다 출력 -> 없다면 회원가입 사용자입력값 넣기 ->
    const { username, email, password } = req.body;

    userModel
      .findOne({email})
      .then(user => {
          if(user) {
              errors.msg = "다른 이메일로 부탁드립니"
              return res.json(errors);
          } else {
            const payload = {username, email, password};
            const token = jwt.sign(
                payload,
                process.env.SECRET_KEY,
                {expiresIn: "20m"}
            )

            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Account activation link",
                html: `
                     <h1>Please use the following to activate your account</h1>
                     <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                     <hr />
                     <p>This email may containe sensetive information</p>
                     <p>${process.env.CLIENT_URL}</p>
                `
            }
            sgMail
                .send(emailData)
                .then(() => {
                    res.status(200).json({
                        message: `Email has been send to ${email}`
                    })
                })
                .catch(err => {
                    res.status(404).json({
                        errors: err
                    })
                })
});

router.post('/login',user_login);

router.get('/google', passport.authenticate("googleToken", {session: false}), user_google_login);

router.get('/facebook', passport.authenticate("facebookToken", {session: false}), user_facebook_login);

router.get('/current', checkAuth, user_current);

router.patch('/:userID', checkAuth, user_update);

router.delete('/', checkAuth, user_delete);

router.get('/list', user_get_all);

module.exports = router;
