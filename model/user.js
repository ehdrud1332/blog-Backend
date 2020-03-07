const mongoose = require('mongoose');

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
// 
userSchema.pre("save", async function)

module.exports = mongoose.model("user", userSchema);