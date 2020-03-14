const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../model/user');
//session : DB의 캐시메모리
const checkAuth = passport.authenticate('jwt', {session: false});
//회원가입
// @route POST http://localhost:2055/user/signup
// @desc user signup
// @access Public
router.post('/signup', (req, res) => {
    

    // 유저모델에서 유저이메일 유무체크 -> 있으면 이메일있다 출력 -> 없다면 회원가입 사용자입력값 넣기 ->
    const { username, email, password } = req.body;



    userModel
        .findOne({"local.email": email})
        .then(user => {
            if(user) {
                return res.json({
                    msg: "다른 이메일로 부탁드립니다.."
                });
            }
            //저장
            const newUser = new userModel({
                method: 'local',
                local: {
                    username: username,
                    email: email,
                    password: password
                }

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
    // DB에 이메일 유무확인 -> 패스워드 매칭 여부 -> 메시지 출력(token)
    const { email, password } = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(!user) {
                return res.json({
                    msg: "이메일을 찾을 수 없습니다."
                });
            }
            console.log(user);
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        console.log(isMatch)
                        // 로그인 성공 return jwt 
                        const payload = { id: user._id, name: user.username, email: user.email, avatar: user.avatar };
                        jwt.sign(
                            payload,
                            process.env.SECRET_KEY,
                            { expiresIn: 36000 },
                            (err, token) => {
                        
                                res.json({
                                    succese: true,
                                    token: "Bearer " + token
                                });
                            }
                        );
                    

                    } else {
                        res.json({
                            msg: "패스워드가 틀립니다."
                        });
                    }
                });
            
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
})

//회원 정보
// @route GET http://localhost:2055/user
// @desc Return Current user
// @access Private
router.get('/', checkAuth, (req, res) => {
    res.json({
        msg: "successful current user",
        userInfo : {
            id: req.user.id,
            name: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar
        }
        
    });
});

// 회원 정보 수정
// @route GET http://localhost:2055/user
// @desc user update
// @access Private
router.patch('/:userID', checkAuth, (req, res) => {
    
    const id = req.params.id

    userModel
        .findByIdAndUpdate()
        .then()
        .catch()
});

//탈퇴
// @route GET http://localhost:2055/user
// @desc user delete
// @access Private
router.delete('/', checkAuth, (req, res) => {
    
    userModel
        .findByIdAndDelete(req.user.id)
        .then(result => {
            res.json({
                msg: "계정이 삭제가 완료되었습니다."
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
});

//등등


module.exports = router;