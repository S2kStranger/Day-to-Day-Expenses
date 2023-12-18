const express = require('express');
const router = express.Router();

const path = require('path');

const signUpcontroller = require("../controller/signupcontroller");
const signIncontroller = require("../controller/signincontroller");


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

module.exports=router;