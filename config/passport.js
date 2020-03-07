// 검증, 압
const { Strategy, ExtractJwt } = require('passport-jwt');
const userModel = require('../model/user');

const opts = {};
//헤어에 있는 토큰으로 부터 압축을 푼다.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
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
    )
}
