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

// const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
// });


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1025 * 5
    },
    fileFilter: fileFilter
});

// @route POST http://localhost:2055/shop/shoppost
// @desc shop POSTING
// @access private 'admin'
router.post('/shoppost', checkAuth, upload.single('photos'), (req, res) => {

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
                photos : req.file.path,
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
