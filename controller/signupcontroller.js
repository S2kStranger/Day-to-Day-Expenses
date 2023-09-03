const express = require('express');
const router = express.Router();

const userTable = require('../models/tableUser');

exports.postUser = (req,res,next) => {

    userTable.create({
        Profile_name : req.body.pname,
        Profile_purpose : req.body.ppurpose,
        Email : req.body.pemail,
        Password : req.body.ppassword,
        Information : req.body.pinformation
    })
    .then(result => {
        res.status(200).json({result : result});
    })
    .catch(err => {
        res.status(450).json({error : err});
    })


}