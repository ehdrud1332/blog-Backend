const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');

const {
    shop_get_all,
    shop_get_current,
    shop_keyword,
    shop_post,
    shop_update,
    shop_delete
} = require('../controller/shop');

const checkAuth = passport.authenticate('jwt', { session: false});

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
router.get('/list', checkAuth, shop_get_all);

// @route GET http://localhost:2055/shop/shopId
// @desc shop current get
// @access private
router.get('/:shopID', checkAuth, shop_get_current);

// 푸드타입에 따른 검색 API
// @route Get http://localhost:2055/shop/
// @desc shop search from foodType
// @access public
router.get('/', shop_keyword);

// @route POST http://localhost:2055/shop/shoppost
// @desc shop POSTING
// @access private 'admin'
router.post('/shoppost', checkAuth, upload.single('photos'), shop_post);

// @route patch http://localhost:2055/shop/shopId
// @desc shop update
// @access private
router.patch('/:shopId', checkAuth, upload.single('photos'), shop_update);

// @route DELETE http://localhost:2055/shop
router.delete('/:shopID', checkAuth, shop_delete);

module.exports = router;
