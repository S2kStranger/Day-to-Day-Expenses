const Sequelize = require('sequelize');
const sequelize = require("../util/database");
const downloadLinks = sequelize.define('downloadLink',{

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    link : {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = downloadLinks;