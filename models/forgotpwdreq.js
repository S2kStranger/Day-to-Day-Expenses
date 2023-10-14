const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const request = sequelize.define('forgotpwdrequest',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    uuid: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        allowNull:false
    },

    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = request;