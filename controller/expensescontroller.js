const express = require('express');
const router = express.Router();
const expenseTable = require('../models/tableExpense');

exports.postExpense = (req,res,next) => {

    console.log("Posting "+req.user.id);
    console.log(req.body);
    expenseTable.create({
        amount : req.body.amount,
        category : req.body.category,
        description : req.body.description,
        userId : req.user.id
    })
    .then(result => {
        res.status(200).json({expensedata:result});
    })

}

exports.getallExpenses = (req,res,next) => {
    console.log("requesting data for "+req.user.id);
    expenseTable.findAll({where:{userId:req.user.id}})
        .then((expenses => {
            res.status(200).json({allexpenses : expenses});
        }))
        .catch(err => {
            res.status(500).json({error : err});
        })
}

exports.deleteexpense =(req,res,next) => {

    const expenseid = req.params.e_id;
    //expenseTable.findByPk(expenseid)
    expenseTable.findAll({where:{userId:req.user.id, id: expenseid}})
    .then(expense => {
        console.log("Deleting "+expense[0].id);
        return expense[0].destroy();
    })
    .then(result => {
        res.sendStatus(200);
    })
    .catch(err => {
        res.status(500).json({error : err});
    })
}
