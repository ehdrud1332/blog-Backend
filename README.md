## 주요기능
* MERN(MongoDB - ExpressJS - ReactJS - NodeJS)
* CRUD(create,read,update,delete) 구축
* 회원가입시 gravatar를 이용한 avatar 생성 및 bcryptjs를 이용한 password 암호화
* sgMail을 이용한 회원가입 이메일 보내기
* facebook, google social login 구축
* 로그인 완료시 jsonwebtoken 발행
* 포스트/댓글/좋아요 기능


## 활용한기술
~~~ts
"packages": [
    "@sendgrid/mail"
    "bcryptjs"
    "body-parser"
    "dotenv"
    "express"
    "gravatar"
    "jsonwebtoken"
    "mongoose"
    "morgan"
    "multer"
    "passport"
    "passport-facebook-token"
    "passport-google-plus-token"
    "passport-jwt"
    "validator"
]
~~~

## STUDY NOTE
**0. 빌딩 후 성공 화면**
- 빌드에 성공하면 아래와 같은 화면(port number & MongoDB connect)이 나온다.

<img src="https://user-images.githubusercontent.com/60862525/92747695-6f4f6a00-f3bf-11ea-9e5e-d867d661b249.png" width="50%">

**1. 로그인시 Json-web-token을 이용한 token 발행**

~~~ts
router.post('/login', (req, res) => {

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

~~~

**2. 소셜로그인 검증**
- 소셜로그인시 입력DATA 검증 일치하면 유저정보(id, name, email, avatar) 저장

~~~ts
passport.use('facebookToken', new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET
    }, async (accessToken, refreshToken, profile, cb) => {
        try {
            const existingUser = await userModel.findOne({"facebook.id": profile.id});
            if(existingUser) {
                return cb(null, existingUser);
            }

            // 데이터베이스 저장, 페이스북 유저 내용을 DB에 저장
            const newUser = new userModel({
                method: 'facebook',
                facebook: {
                    id: profile.id,
                    name: profile.displayName,
                    //
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                }

            });
            await newUser.save();
            cb(null, newUser);

        } catch (error) {
            //cb = return
            cb(error, false, error.message);
        }
        
    }));


};
~~~
**3. 소셜로그인**
- facebook Login 완료시 token 발행
~~~ts
router.get('/facebook', passport.authenticate("facebookToken", {session: false}), (req, res) => {
    console.log(req.user);

     const payload = { id: req.user._id, name: req.user.facebook.name, email: req.user.facebook.email, avatar: req.user.facebook.avatar };

     // token create
     jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: 36000 },
        (err, token) => {
            res.json({
               seccess : true,
               tokenInfo: "Bearer " + token
            });
        }

     )


});

~~~

**4. 상품등록 및 이미지 업로드**
- 이미지 규격 및 타입 규정
- 업로드시 등록되는 정보 규정
~~~ts
const storage = multer.diskStorage({
    // 저장하는
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }  else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1025 * 5
    },
    fileFilter: fileFilter
});

router.post('/shoppost', checkAuth, upload.single('photos'), (req, res) => {

    userModel
        .findById(req.user.id)
        .then(user => {
            if(user.role !== "admin") {
                return res.json({
                    msg: "관리자가 아니다."
                })
            }
            //등록
            const newShop = new shopModel({
                admin : req.user.id,
                photos : req.file.path,
                shopName : req.body.shopName,
                address : req.body.address,
                location : req.body.location,
                openTime: req.body.openTime,
                closeTime: req.body.closeTime,
                shopPhoneNumber: req.body.shopPhoneNumber,
                parkingSpace: req.body.parkingSpace,

            });

            newShop
                .save()
                .then(result => {
                    res.json({
                        msg: "등록 되었습니다.",
                        shopInfo : result
                    });
                })
                .catch(err => {
                    res.json({
                        err: err.message
                    });
                })

        })

        .catch(err => {
            res.json({
                err: err.message
            });
        });
});
~~~
**5. sgMail을 이용한 회원가입 이메일 보내기**
- 회원가입 요청시 입력한 이메일로 회원가입확인 확인 이메일 보내기
- HTML 형식의 이메일 디자인 구축
~~~ts
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
~~~

## TO DO LIST
✔︎ sgMail 관련된 HTML 관련 공부
✔︎ MySQL 데이터베이스 변경
✔︎ 프론트 개발예정
            
