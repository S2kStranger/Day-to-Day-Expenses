const express = require("express");
const router = express.Router();
const expenseTable = require("../models/tableExpense");
const userTable = require("../models/tableUser");
const sequelize = require("../util/database");

exports.postExpense = (req, res, next) => {
  expenseTable
    .create({
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
      userId: req.user.id,
    })
    .then((result) => {
      res.status(200).json({ expensedata: result });
    });
};

exports.getallExpenses = (req, res, next) => {
  expenseTable
    .findAll({ where: { userId: req.user.id } })
    .then((expenses) => {
      res.status(200).json({ allexpenses: expenses });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.deleteexpense = (req, res, next) => {
  const expenseid = req.params.e_id;
  expenseTable
    .findAll({ where: { userId: req.user.id, id: expenseid } })
    .then((expense) => {
      return expense[0].destroy();
    })
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getLeaderboard = async (req, res, next) => {
  //Using join
  try {
    const [results, metadata] = await sequelize.query(
      "select userId,sum(amount) as total_expense,Profile_name from daytodayexpense.expenses LEFT JOIN daytodayexpense.users on daytodayexpense.expenses.userId=daytodayexpense.users.id group by userId order by total_expense desc;"
    );

    const obj = JSON.stringify(results, null, 2);
    console.log(results);
    return res.status(200).json({ lbobj: results });
  } catch (err) {
    res.status(400).json({ message: err });
  }

  // //Using simple queries and sending to tables
  //   try {
  //     console.log("On glb");
  //     const users = await expenseTable.findAll({
  //       attributes: [ "userId", [sequelize.fn("sum", sequelize.col("amount")), "total_expense"]],
  //       group: ["userId"],
  //       order: [["total_expense","desc"]]
  //     });
  //     const names = await userTable.findAll({
  //       attributes: ["id", "Profile_name"],
  //     });
  //     console.log(users);
  //     console.log(names);

  //     var arr=[];
  //     users.forEach((element) => {
  //           console.log("element id "+element.total_expense);
  //           var obj = {name: names[element.userId-1].Profile_name,texpense:element.total_expense}
  //           console.log("printing obj: name:"+obj.name+" and texpense: "+obj.texpense);
  //           arr.push(obj);
  //     })

  //     return res.status(200).json({ userarr: users, namesarr: names });
  //   } catch (err) {
  //     res.status(400).json({ message: err });
  //   }
};
