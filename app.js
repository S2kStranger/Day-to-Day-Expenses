const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json({extended: false}));

//TO COMPRESS THE FILE
const compression = require('compression');
app.use(compression());

//TO LOG THE DATA
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags: 'a'});
const morgan = require('morgan');
app.use(morgan('combined',{stream: accessLogStream}));

app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
app.use(index);

const expense = require('./routes/expense');
app.use(expense);

const purchase = require('./routes/purchase');
app.use(purchase);

const forgotPassword = require('./routes/forgotpassword');
app.use(forgotPassword);

require("dotenv").config();


const sequelize = require('./util/database');

const usertable = require('./models/tableUser');
const expensetable = require('./models/tableExpense');
const orderstable = require('./models/orders');
const pwdreqtable = require('./models/forgotpwdreq');
const downloadlink = require('./models/downloadLink');

usertable.hasMany(expensetable);
expensetable.belongsTo(usertable);

usertable.hasMany(orderstable);
orderstable.belongsTo(usertable);

usertable.hasMany(pwdreqtable);
pwdreqtable.belongsTo(usertable);

usertable.hasMany(downloadlink);
downloadlink.belongsTo(usertable);

sequelize
     .sync({force:true})
    //.sync()
    .then(result => {
        app.listen(4000);
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });