const express = require('express');
const app = express();

const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
app.use(index);

const sequelize = require('./util/database');

sequelize
    .sync({force:true})
   // .sync()
    .then(result => {
        app.listen(4000);
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });