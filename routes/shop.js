const express = require('express');
const router = express.Router();
const passport = require('passport');
const userModel = require('../model/user');
const shopModel = require('../model/shop');

const checkAuth = passport.authenticate('jwt', { session: false});

// @route POST http://localhost:2055/shop/shopp ost
// @desc shop POSTING
// @access private 'admin'
router.post('/shoppost', checkAuth, (req, res) => {

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
                photos : req.body.photos,
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

// @route DELETE http://localhost:2055/shop
router.delete('/:shopID', checkAuth, (req, res) => {
    const id = req.params.shopID;

    userModel
        .findById(req.user.id)
        .then(user => {
            if(user.role !== "admin") {
                return res.json({
                    msg: "관리자가 아닙니다."
                });
            }
            shopModel
                .findByIdAndRemove(id)
                .then(result => {
                    res.json({
                        msg: "가게가 삭제되었습니다."
                    });
                })
                .catch(err => {
                    res.json({
                        error :err
                    });
                });
        })
        .catch(err => {
            res.json({
                error : err.message
            });
        })

});

module.exports = router;
