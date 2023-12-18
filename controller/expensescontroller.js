const express = require("express");
const router = express.Router();
const expenseTable = require("../models/tableExpense");
const userTable = require("../models/tableUser");
const sequelize = require("../util/database");
const linkTable = require("../models/downloadLink");


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

//--------------------------------------------------------
// code to upload file on s3
const userServices = require('../services/userservices');
const AWS = require('aws-sdk');
const S3Services = require('../services/S3services');
const tableLink = require('../models/downloadLink');

function saveLink(userid,fileurl)
{
  tableLink.create({
    link : fileurl,
    userId : userid
  }).then((result) => {
    console.log("Link saved",result);
  })
  .catch((err) => {
    console.log("Link is not saved", err);
  })
}

exports.downloadFile = async (req,res,next) => {

  try
  {
    console.log("Executing download expense part");
    const user = req.user;
    if(user.isPremium)
    {
      const userId = req.user.id;

      const expenses = await userServices.getExpenses(req);
      console.log(expenses);
      const stringifyExpenses = JSON.stringify(expenses);
      console.log(stringifyExpenses);
      const filename = `Expense${userId}/${new Date()}.txt`;
      const fileurl = await S3Services.uploadToS3(stringifyExpenses,filename);
      console.log("Location is: ",fileurl);
      saveLink(userId,fileurl);
      res.status(200).json({fileurl, success : true});
    }
    else
    {
      res.status(401).json({message:"File cant be downloaded"});
    }
    
  }catch(error)
  {
    res.status(500).json({err:error,success: false,fileurl:''})
  }
}

exports.getLinks = async (req,res,next) => {
  try
  {
    const userid = req.user.id;
    const links = await linkTable.findAll({where:{userId : userid}});
    res.status(200).json({result : links});
  }catch(err)
  {
    res.status(500).json({err:err});
  }
}