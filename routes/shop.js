const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');

const userModel = require('../model/user');
const shopModel = require('../model/shop');

const checkAuth = passport.authenticate('jwt', { session: false});

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });
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
// @route GET http://localhost:2055/shop/list
// @desc shopModel get all
// access public
router.get('/list', checkAuth, (req, res) => {

    shopModel
        .find()
        .then(result => {
            res.json({
                msg: "불러오기를 성공했습니다",
                count : result.length,
                shopInfo : result
            });
        })
        .catch(err => {
            res.json({
                error : err
            });
        });
});


// @route POST http://localhost:2055/shop/shoppost
// @desc shop POSTING
// @access private 'admin'
router.post('/shoppost', checkAuth, upload.single('photos'), (req, res) => {

    const shopFields = {};
    shopFields.admin = req.user.id;
    if (req.file.path) shopFields.photos = req.file.path;
    if (req.body.shopName) shopFields.shopName = req.body.shopName;
    if (req.body.address) shopFields.address = req.body.address;
    if (req.body.location) shopFields.location = req.body.location;
    if (req.body.openTime) shopFields.openTime = req.body.openTime;
    if (req.body.closeTime) shopFields.closeTime = req.body.closeTime;
    if (req.body.shopPhoneNumber) shopFields.shopPhoneNumber = req.body.shopPhoneNumber;
    if (req.body.parkingSpace) shopFields.parkingSpace = req.body.parkingSpace;

    if (typeof req.body.Menu !== 'undefined') {
        shopFields.Menu = req.body.Menu.split(',');
    }
    if (typeof req.body.foodType !== 'undefined') {
        shopFields.foodType = req.body.foodType.split(',');
    }


    userModel
        .findById(req.user.id)
        .then(user => {
            if(user.role !== "admin") {
                return res.json({
                    msg: "관리자가 아니다."
                })
            }
            //등록
            const newShop = new shopModel(shopFields);

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
