const Sequelize = require('sequelize');
const sequelize = require("../util/database");
const signupData = sequelize.define('signup',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Profile_name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    Profile_purpose : {
        type: Sequelize.STRING,
        allowNull : false
    },

    Email : {
        type: Sequelize.STRING,
        allowNull:false
    },

    Password: {
        type:Sequelize.STRING,
        allowNull: false
    },

    Information: Sequelize.STRING

})

module.exports = signupData;