//All Require
require('./Src/Connection/Config');
const Data = require('./Src/Routes/Route')
const express = require('express')
const cors = require('cors');
const App = express();

//Middleware
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cors({ origin: "*"}));

//Use
App.use('/',Data);
App.use('/Auth',Data);

//Port Listing;
const PORT =process.env.PORT || 8080;
App.listen(PORT, () => {
    console.log('Troops Count' + ' ' +PORT);
});

