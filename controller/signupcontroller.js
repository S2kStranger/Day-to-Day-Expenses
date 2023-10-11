const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require("bcrypt");

const userTable = require('../models/tableUser');

exports.postUser = (req,res,next) => {
    const pwd=req.body.ppassword;
    const salt=10;

    try{
        bcrypt.hash(pwd,salt,(err,hash) => {
            console.log("Hash",hash);
           userTable.create({
                Profile_name : req.body.pname,
                Profile_purpose : req.body.ppurpose,
                Email : req.body.pemail,
                Password : hash,
                Information : req.body.pinformation,
                isPremium : req.body.isPremium
            }).then((result) => {
                res.status(200).json({result:result});
            })
            .catch((err) => {
                res.status(450).json({error : err});
            })
             
        })
    }catch(err)
    {
        res.status(450).json({error : err});
    }
}