const express = require('express');
const router = express.Router();
const expenseTable = require('../models/tableExpense');

exports.postExpense = (req,res,next) => {

    console.log(req.body);
    expenseTable.create({
        amount : req.body.amount,
        category : req.body.category,
        description : req.body.description
    })
    .then(result => {
        res.status(200).json({expensedata:result});
    })

}

exports.getallExpenses = (req,res,next) => {
    expenseTable.findAll()
        .then((expenses => {
            res.status(200).json({allexpenses : expenses});
        }))
        .catch(err => {
            res.status(500).json({error : err});
        })
}

exports.deleteexpense =(req,res,next) => {

    const expenseid = req.params.e_id;
    expenseTable.findByPk(expenseid)
    .then(expense => {
        return expense.destroy();
    })
    .then(result => {
        res.sendStatus(200);
    })
    .catch(err => {
        res.status(500).json({error : err});
    })
}
