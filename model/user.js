const mongoose = require('mongoose');
const gravatar = required('gravatar');
const bcrypt = required('bcryptjs');


const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
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
        // 아바타의 url 생성
        // this 파일안에 상수를 불러오기 위해 사용함
        const avatar = await gravatar.url(this.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        this.avatar = avatar;


        //password 암호화
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        console.log('exited');
        next();

    } catch(error) {
        next(error);
    }
});

module.exports = mongoose.model("user", userSchema);