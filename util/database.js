const Sequelize = require('sequelize');

const sequelize = new Sequelize('daytodayexpense','root','S2kMySQL',{
    dialect : 'mysql',
    host : 'localhost'
});

module.exports = sequelize;