const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const passport = require('passport');
//미들웨어 프로젝트 전체에 사용하겠다.
dotEnv.config();

const userRoutes = require('./routes/user');
const shopRoutes = require('./routes/shop');

//DB 커넥션
require('./db');

// 미들웨어
app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
//패스포트를 사용해서 파일을 사용하겠다.
require("./config/passport")(passport);

//router
app.use('/user', userRoutes);
app.use('/shop', shopRoutes);

const port = process.env.PORT;
//$: 자바스크립트를 불러옴
app.listen(port, () => console.log(`server started at ${port}`));