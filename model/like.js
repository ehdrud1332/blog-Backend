const mongoose = require('mongoose');

const likeSchema = mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shop',
            required: true
        },

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("like", likeSchema);
