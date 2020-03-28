const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({

    admin : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    photos : {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },

    address : {
        type: String,
        required: true
    },

    location : {
        type: String,
        required: true
    },

    openTime: {
        type: String,
        required: true
    },

    closeTime: {
        type: String,
        required: true
    },

    shopPhoneNumber: {
        type: String,
        required: true
    },

    parkingSpace: {
        type: String,
        default : true
    },

    Menu: [
        {
            type: String,
            required: true
        }
    ],

    foodType: [
        {
            type: String,
            required: true
        }
    ]

},
    {
        //생성날짜, 업데이트 날짜 자동생성
        timestamps: true
    }
);

module.exports = mongoose.model("shop", shopSchema);