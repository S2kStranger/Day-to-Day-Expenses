const express = require('express');
const router = express.Router();

const path = require('path');

const forgotpwdController = require("../controller/forgotpasswordcontroller");

router.get("/password/forgotpassword",(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','forgotPassword.html'));
})

router.post("/password/forgotpassword",forgotpwdController.checkEmail);

router.post("/password/forgotpassword",forgotpwdController.sendLink);

router.get("/password/resetpassword/:uuid",forgotpwdController.checkRequest);

router.get("/password/resetpassword/:uuid",(req,res,next) => { 
    res.sendFile(path.join(__dirname,'..','views','changePassword.html'));
})

router.post("/password/submitpassword",forgotpwdController.updatePassword);

module.exports=router;