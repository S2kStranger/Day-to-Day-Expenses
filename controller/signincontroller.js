
const path = require('path');
const bcrypt = require("bcrypt");
const userTable = require('../models/tableUser');
const jwt = require('jsonwebtoken');

exports.loggingIn = (req,res,next) => {

    const secret_key = "f9d99d5ab8e88d60dc034829f3326fb56ba52aa42a40a50bd7269a5151f828fa";
    function generateAccessToken(id)
    {
        return jwt.sign({userid:id},secret_key);
    }

    console.log("Eneterd in logging in");
    const email = req.body.useremail;
    userTable.findOne({where: {Email : email}})
    .then(record => {
        console.log("comparing the password");

            bcrypt.compare(req.body.userpassword,record.Password,(err,pmatch) => {
            if(pmatch)
            {
                console.log("Password matched");
                //console.log("Here is record"+record.Email);
                //res.send(record);
                res.status(200).json({record:record,token:generateAccessToken(record.id)});
            }
            else
            {
                console.log("Password not matched");
                res.status(400).json({error: "Password doesn't match"});
            }
        })
    })
    .catch(err => {
        res.status(400).json({error: "User doesn't exist"});
    })
    
}