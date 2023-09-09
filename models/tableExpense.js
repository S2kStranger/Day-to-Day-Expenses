const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const expenseData = sequelize.define('expenses',{

    id: 
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount : 
    {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    category : 
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: Sequelize.STRING
})

module.exports = expenseData;