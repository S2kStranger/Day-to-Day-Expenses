const express = require("express");
const router = express.Router();
const expenseTable = require("../models/tableExpense");
const userTable = require("../models/tableUser");
const sequelize = require("../util/database");

exports.postExpense = async (req, res, next) => {

  const t =await  sequelize.transaction();
  try{
    
    const result = await  expenseTable.create({
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
      userId: req.user.id,
    },{transaction:t});

    const val = Number(req.user.Total_Expense)+Number(req.body.amount);
    await userTable.update({Total_Expense:val},{where:{id:req.user.id},transaction:t});
    await t.commit();
    res.status(200).json({ expensedata: result });

  }catch(err)
  {
     await t.rollback();
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
      attributes:['Total_Expense','Income'],
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
    const expense = await  expenseTable.findAll({ where: { userId: req.user.id, id: expenseid } });
    var val =Number(req.user.Total_Expense)-Number(expense[0].amount);
    const p1=await userTable.update({Total_Expense:val},{where:{id:req.user.id}});
    const p2=await expense[0].destroy();
    Promise.all([expense,p1,p2])
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


exports.updateIncome = async (req,res,next) => {

  try
  {
    const user = req.user;
    user.Income = req.body.income;
    await user.save();
    res.sendStatus(200);
  }catch(err)
  {
    res.status(500).json({ error: err });
  }

}

exports.downloadFile = async (req,res,next) => {

  try
  {
    console.log("File downloaded");
    res.status(200).json({fileurl:"asfdakjsf",message:"File cant be downloaded"});
  }catch(error)
  {
    res.status(500).json({err:error})
  }
}