const express = require('express');
const router = express.Router();
const passport = require('passport');

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

router.post('/signup', user_signUp);

router.post('/login',user_login);

router.get('/google', passport.authenticate("googleToken", {session: false}), user_google_login);

router.get('/facebook', passport.authenticate("facebookToken", {session: false}), user_facebook_login);

router.get('/current', checkAuth, user_current);

router.patch('/:userID', checkAuth, user_update);

router.delete('/', checkAuth, user_delete);

router.get('/list', user_get_all);

module.exports = router;