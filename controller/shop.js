const userModel = require('../model/user');
const shopModel = require('../model/shop');

exports.shop_get_all = (req, res) => {

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
};

exports.shop_get_current = (req, res) => {

    const id = req.params.shopID;

    shopModel
        .findById(id)
        .then(result => {
            res.json({
                msg: "불러오기를 성공했습니다",
                shopInfo: result
            });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
};

exports.shop_keyword = (req, res) => {

    const { keyword } = req.body;
    console.log(keyword);
    shopModel
        .find({Menu : keyword})
        .then(result => {
            console.log(result);
            res.json({
                shopInfo: result
            })
        });
};

exports.shop_post = (req, res) => {

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
};

exports.shop_update = (req, res) => {

    const id = req.params.id;

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
            console.log("user is", user);

            if(user.role !== 'admin') {
                return res.json({
                    msg : "관리자가 아닙니다."
                });
            }
            shopModel
                .findByIdAndUpdate(
                    {_id: req.params.shopId},
                    { $set: shopFields },
                    { new: true }
                )
                .then(shop => {
                    res.json(shop)
                });

        });
};

exports.shop_delete = (req, res) => {
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

};
