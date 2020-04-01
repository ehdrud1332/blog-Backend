const jwt = require('jsonwebtoken');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');


const userModel = require('../model/user');

// token 발행 함수
function tokenGenerater(payload) {
    return jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: 36000 },
    )
};

//회원가입
// @route POST http://localhost:2055/user/signup
// @desc user signup
// @access Public
exports.user_signUp = (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
      return res.json(errors);
    }

    // 유저모델에서 유저이메일 유무체크 -> 있으면 이메일있다 출력 -> 없다면 회원가입 사용자입력값 넣기 ->
    const { username, email, password } = req.body;

    userModel
      .findOne({"local.email": email})
      .then(user => {
          if(user) {
              errors.msg = "다른 이메일로 부탁드립니"
              return res.json(errors);
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
                  errors.msg = err.message
                  res.json(errors);
              });
      })
      .catch(err => {
          errors.msg = err.message
          res.json(errors);
      });


    };

//로그인
// @route POST http://localhost:2055/user/login
// @desc user login(return jwt 토큰 발행 검사
// @access Public
exports.user_login = (req, res) => {
     // DB에 이메일 유무확인 -> 패스워드 매칭 여부 -> 메시지 출력(token)
     const {errors, isValid} = validateLoginInput(req.body);

     // check validation
     if (!isValid) {
         return res.json(errors);
     }
     const { email, password } = req.body;

     userModel
         .findOne({"local.email": email})
         .then(user => {
             if(!user) {
                 return res.json({
                     msg: "이메일을 찾을 수 없습니다."
                 });
             }
             console.log(user);
             user.comparePassword(password, (err, isMatch) => {
                 if(err) throw err;
                 // return token
                  const payload = { id: user._id, name: user.local.username, email: user.local.email, avatar: user.local.avatar };
                  res.json({
                     success: true,
                     tokenInfo: "Bearer " + tokenGenerater(payload)
                  });
             })
         })
         .catch(err => {
             errors.msg = err.message
             res.json(errors);
         });
 };

 // 구글 로그인
 // @route GET http://localhost:2055/user/google
 // @desc 구글 로그인
 // @access Public
 // passport.authenticate("googleToken", {session: false} : checkAuth로 상수화 했었던 것들
 // Authenticate : 진짜임을 증명하다
exports.user_google_login = (req, res) => {
    console.log(req.user);
    const payload = {id: req.user._id, name: req.user.google.name, email: req.user.google.email, avatar: req.user.google.avatar};
    res.json({
        success: true,
        tokenInfo: "Bearer " + tokenGenerater(payload)
    });
};

// 페이스북 로그인
// @route GET http://localhost:2055/user/facebook
// @desc 페이스북 로그인
// @access Public
exports.user_facebook_login = (req, res) => {
      console.log(req.user);
      const payload = { id: req.user._id, name: req.user.facebook.name, email: req.user.facebook.email, avatar: req.user.facebook.avatar };
      res.json({
          success: true,
          tokenInfo: "Bearer" + tokenGenerater(payload)
      })
    };

// @route GET http://localhost:2055/user/list
// @desc user get all
// @access private
exports.user_get_all = (req, res) => {

   userModel
       .find()
       .then(result => {
           res.json({
               msg: "불러오기를 성공했습니다",
               count : result.length,
               userInfo : result
           });
       })
       .catch(err => {
           res.json({
               error : err
           });
       });
};


//회원 정보
// @route GET http://localhost:2055/user
// @desc Return Current user
// @access Private\
// 하나의 API안에 넣어보기
exports.user_current = (req, res) => {
   res.json({
        msg: "successful current user",
        userInfo : req.user
    });
 };

// 회원 정보 수정
// @route GET http://localhost:2055/user
// @desc user update
// @access Private
exports.user_update = (req, res) => {

  const id = req.params.userID;

  const userFields = {};
  userFields.admin = req.user.id;
  if (req.body.email) userFields.email = req.body.email;
  if (req.body.password) userFields.password = req.body.password;

  userModel
       .findByIdAndUpdate(
            { _id: id},
            { $set: userFields },
            { new: true }
        )
       .then(result => {
            res.json(result)
       });
};
//탈퇴
// @route GET http://localhost:2055/user
// @desc user delete
// @access Private
exports.user_delete = (req, res) => {

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
};