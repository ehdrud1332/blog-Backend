const express = require('express');
const router = express.Router();

//회원가입
// @route POST http://localhost:2055/user/signup
// @desc user signup
// @access Public
router.post('/signup', (req, res) => {
    res.json({
        msg: "회원가입 성공"
    });
});

//로그인
// @route POST http://localhost:2055/user/login
// @desc user login(return jsonwebtoken 토큰 발행 검사)
// @access Public
router.post('/login', (req, res) => {
    res.json({
        msg: "로그인 성공"
    })
})
//회원 정보
// @route GET http://localhost:2055/user
// @desc user get all
// @access Private
router.get('/', (req, res) => {
    res.json({
        msg: "정보 불러오기 성공"
    });
});

// 회원 정보 수정
// @route GET http://localhost:2055/user
// @desc user update
// @access Private
router.patch('/', (req, res) => {
    res.json({
        msg: "회원 정보 수정 성공"
    });
});
//탈퇴
// @route GET http://localhost:2055/user
// @desc user delete
// @access Private
router.delete('/', (req, res) => {
    res.json({
        msg: "회원 탈퇴"
    });
});

//등등


module.exports = router;