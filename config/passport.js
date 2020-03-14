// 검증, 압축풀기


const { Strategy, ExtractJwt } = require('passport-jwt');
const GooglePlusTokenStragey = require('passport-google-plus-token');
const FacebookTokenStragey = require('passport-facebook-token');
const userModel = require('../model/user');

const opts = {};
//헤더에 있는 토큰으로 부터 압축을 푼다.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//내가 입력한 secret 값을 opts로 상수화
opts.secretOrKey = process.env.SECRET_KEY;


module.exports = passport => {
    passport.use(
        new Strategy(opts, (jwt_payload, done) => {
            userModel
                .findById(jwt_payload.id)
                .then(user => {
                    if(!user) {
                        return done(null, false);
                    }
                    done(null, user);
                })
                .catch(err => console.log(err.message));

        })
    ),

        // google login 검증
    passport.use('googleToken', new GooglePlusTokenStragey({
        // 이 API를 사용하려면 구글에서 아이디 비번을
        clientID: "",
        clientSecret: ""
    }, async (accessToken, refreshToken, profile, cb) => {

        console.log("accessToken ", accessToken);
        console.log("refreshToken", refreshToken);
        console.log('profile', profile);

    }))
        // facebook login 검증


}
