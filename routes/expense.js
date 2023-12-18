const express = require('express');
const router = express.Router();

const path = require('path');

const expenseController = require("../controller/expensescontroller");
const userauthorization = require("../middleware/auth");

router.post("/updateIncome",userauthorization.authorization,expenseController.updateIncome);

router.post("/postnewexpense",userauthorization.authorization,expenseController.postExpense);

router.get("/account/getexpenses",userauthorization.authorization,expenseController.getallExpenses);

router.delete("/account/deleteExpense/:e_id",userauthorization.authorization,expenseController.deleteexpense);

router.get("/account/download",userauthorization.authorization,expenseController.downloadFile);

router.get("/account/getdownloadLinks",userauthorization.authorization,expenseController.getLinks);


module.exports=router;