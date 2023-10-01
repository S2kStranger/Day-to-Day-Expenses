const express = require("express");
const router = express.Router();
const expenseTable = require("../models/tableExpense");
const userTable = require("../models/tableUser");
const sequelize = require("../util/database");

exports.postExpense = async (req, res, next) => {

  try{
    const result = await  expenseTable.create({
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
      userId: req.user.id,
    })

    const reqRecord = await userTable.findOne({where: {id:req.user.id}});
    const val = parseFloat(reqRecord.Total_Expense,10)+parseFloat(req.body.amount,10);
    await reqRecord.update({Total_Expense:val});
    res.status(200).json({ expensedata: result });

  }catch(err)
  {
    res.status(500).json({ error: err });
  }


  // expenseTable
  //   .create({
  //     amount: req.body.amount,
  //     category: req.body.category,
  //     description: req.body.description,
  //     userId: req.user.id,
  //   })
  //   .then((result) => {
  //     res.status(200).json({ expensedata: result });
  //   });
};

exports.getallExpenses = async (req, res, next) => {

  try
  {
    const expenses = await  expenseTable.findAll({ where: { userId: req.user.id } });
    console.log(expenses);
    const texpense = await userTable.findAll({
      attributes:['Total_Expense'],
      where: { id: req.user.id }
    })
    console.log(texpense);
    res.status(200).json({ allexpenses: expenses , totexpense: texpense});
  }catch(err)
  {
    res.status(500).json({ error: err });
  }
  // expenseTable
  //   .findAll({ where: { userId: req.user.id } })
  //   .then((expenses) => {
  //     res.status(200).json({ allexpenses: expenses });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: err });
  //   });
};

exports.deleteexpense = async (req, res, next) => {

  try
  {
    const expenseid = req.params.e_id;
    const expense = await  expenseTable.findOne({ where: { userId: req.user.id, id: expenseid } });
    const reqRecord = await userTable.findOne({where:{id:req.user.id}});
    var val =parseFloat(reqRecord.Total_Expense,10)-parseFloat(expense.amount,10);
    const p1 = await reqRecord.update({Total_Expense:val});
    const p2=await expense.destroy();
    Promise.all([expense,reqRecord,p1,p2])
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(500).json({error: err});
      })

    }catch(err)
      {
        res.status(500).json({ error: err });
      }

  // expenseTable
  //   .findAll({ where: { userId: req.user.id, id: expenseid } })
  //   .then((expense) => {
  //     console.log("deleted");
  //     console.log(expense);
  //     return expense[0].destroy();
  //   })
  //   .then((result) => {
  //     res.sendStatus(200);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: err });
  //   });
};