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

module.exports = mongoose.model("user", userSchema);