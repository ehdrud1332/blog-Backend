const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
//미들웨어 프로젝트 전체에 사용하겠다.
dotEnv.config();

const userRoutes = require('./routes/user');


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log("mongoDB conneted"))
    .catch(err => console.log(err.msg));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/user', userRoutes);

const port = process.env.PORT;
//$: 자바스크립트를 불러옴
app.listen(port, () => console.log(`server started at ${port}`));