const express = require('express');
const router = express.Router();

const userModel = require('../model/user');
//회원가입
// @route POST http://localhost:2055/user/signup
// @desc user signup
// @access Public
router.post('/signup', (req, res) => {
    

    // 유저모델에서 유저이메일 유무체크 -> 있으면 이메일있다 출력 -> 없다면 회원가입 사용자입력값 넣기 ->
    const { username, email, password } = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(user) {
                return res.json({
                    msg: "다른 이메일로 부탁드립니다.."
                });
            }
            //저장
            const newUser = new userModel({
                username, email, password
            });

            newUser
                .save()
                .then(user => {
                    res.json({
                        msg: "회원가입 되었습니다.",
                        userInfo: user
                    });
                })
                .catch(err => {
                    res.json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.json({
                error: err
            });
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