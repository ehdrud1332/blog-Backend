
// db커넥션
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log("mongoDB conneted"))
    .catch(err => console.log(err.msg));
