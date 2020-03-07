const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const db = "mongodb+srv://cheese:0326@cluster0-eelvp.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log("mongoDB conneted"))
    .catch(err => console.log(err.msg));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = 2055;
//$: 자바스크립트를 불러옴
app.listen(port, () => console.log(`server started at ${port}`));