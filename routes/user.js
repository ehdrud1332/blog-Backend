const express = require('express');
const router = express.Router();

//회원가입
router.post('/signup', (req, res) => {
    res.json({
        msg: "회원가입 성공"
    });
});

//로그인
router.post('/login', (req, res) => {
    res.json({
        msg: "로그인 성공"
    })
})
//회원 정보
router.get('/', (req, res) => {
    res.json({
        msg: "정보 불러오기 성공"
    });
});

// 회원 정보 수정
router.patch('/', (req, res) => {
    res.json({
        msg: "회원 정보 수정 성공"
    });
});
//탈퇴
router.delete('/', (req, res) => {
    res.json({
        msg: "회원 탈퇴"
    });
});

//등등


module.exports = router;