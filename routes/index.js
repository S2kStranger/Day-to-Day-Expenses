const express = require('express');
const router = express.Router();

const path = require('path');

const signUpcontroller = require("../controller/signupcontroller");

router.get('/',(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','index.html'));
})

router.get('/signUp',(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'));
})

router.get('/signIn',(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','signIn.html'));
})

router.post('/postsignupdata',signUpcontroller.postUser);

module.exports=router;