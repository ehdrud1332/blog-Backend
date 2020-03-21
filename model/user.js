const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const userSchema = mongoose.Schema(
    {

        method: {
            type: String,
            // enum객관식
            enum: ['local', 'google', 'facebook'],
            required: true
        },
        role : {
            type: String,
            //역할을 준 것 관리자, 유저
            enum: ["user", "admin"],
            default: "user"
        },

        local: {
            name: {
                type: String
            },
            email: {
                type: String,
                //모든 문자를 소문자로
                lowercase: true
            },
            password: {
                type: String
            },
            avatar: {
                type: String
            },

        },
            //소셜에는 이메일이 없을 경우도 있기 때문에 required를 적지 않는다.
        google: {
            id: {
                type: String
            },
            name: {
                type: String
            },
            email: {
                type: String,
                lowercase: true
            },
            avatar: {
                type: String
            }
        },

        facebook: {
            id: {
                type: String
            },
            name: {
                type: String
            },
            email: {
                type: String,
                lowercase: true
            },
            avatar: {
                type: String
            }
        }







//         username: {
//             type: String,
//             required: true
//         },
//         email: {
//             type: String,
//             required: true
//         },
//         password: {
//             type: String,
//             required: true
//         },
//         avatar: {
//             type: String
//         }
    },
    {
         //생성날짜, 업데이트 날짜 자동생성
        timestamps: true
    }
);
// 비동기 방식의 함수 실행
// async : 사용자 입력고 동시에 비동기 실챙
userSchema.pre("save", async function (next) {
    try {
        console.log('enter');
        if (this.method !== 'local') {
            next();
        }
        // 아바타의 url 생성
        // this 파일안에 상수를 불러오기 위해 사용함
        const avatar = await gravatar.url(this.local.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        this.local.avatar = avatar;


        //password 암호화
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
        console.log('exited');
        next();

    } catch(error) {
        next(error);
    }
});
    userSchema.methods.comparePassword = function(userPassword, cb){
        bcrypt.compare(userPassword, this.local.password, (err, isMatch) => {
            if(err) return cb(err);
            cb(null, isMatch);
        });
    };
module.exports = mongoose.model("user", userSchema);
