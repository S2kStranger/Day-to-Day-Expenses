const express = require('express');
const router = express.Router();

const path = require('path');

const signUpcontroller = require("../controller/signupcontroller");
const signIncontroller = require("../controller/signincontroller");
const expenseController = require("../controller/expensescontroller");

router.get('/',(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','index.html'));
})

router.get('/signUp',(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'));
})

router.post('/postsignupdata',signUpcontroller.postUser);

router.get('/signIn',(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','signIn.html'));
})

router.post('/signIn',signIncontroller.loggingIn);

router.get("/account",(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','home.html'));
})

router.post("/postnewexpense",expenseController.postExpense);

router.get("/account/getexpenses",expenseController.getallExpenses);

router.delete("/account/deleteExpense/:e_id",expenseController.deleteexpense);

module.exports=router;