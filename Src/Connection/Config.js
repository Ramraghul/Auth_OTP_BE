const mongoose = require('mongoose');
require('dotenv').config();
let Link = process.env.LINK;
mongoose.set('strictQuery',true);

mongoose.connect(`${Link}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Battle Ship Ready(DB)");
}).catch((error) => {
    console.log(error);
})