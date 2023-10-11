const express = require('express');
const router = express.Router();

const path = require('path');

const forgotpwdController = require("../controller/forgotpasswordcontroller");

router.get("/forgotpassword",(req,res,next) => {
    res.sendFile(path.join(__dirname,'..','views','forgotPassword.html'));
})

router.post("/forgotpassword",forgotpwdController.sendLink);

module.exports=router;