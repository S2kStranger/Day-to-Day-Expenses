const express = require('express');
const app = express();

const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json({extended: false}));


app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
app.use(index);

const purchase = require('./routes/purchase');
app.use(purchase);

const forgotPassword = require('./routes/forgotpassword');
app.use(forgotPassword);

const sequelize = require('./util/database');

const usertable = require('./models/tableUser');
const expensetable = require('./models/tableExpense');
const orderstable = require('./models/orders');

usertable.hasMany(expensetable);
expensetable.belongsTo(usertable);

usertable.hasMany(orderstable);
orderstable.belongsTo(usertable);

sequelize
    //.sync({force:true})
    .sync()
    .then(result => {
        app.listen(4000);
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });