const Sequelize = require('sequelize');
const sequelize = require("../util/database");
const userData = sequelize.define('users',{
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
        allowNull:false,
        unique: true
    },

    Password: {
        type:Sequelize.STRING,
        allowNull: false
    },

    Information: Sequelize.STRING,

    isPremium: Sequelize.BOOLEAN,

    Total_Expense : {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
    }

})

module.exports = userData;