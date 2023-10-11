
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/tableUser");

require('dotenv').config();


exports.loggingIn = (req,res,next) => {

    const secret_key = process.env.AUTH_TOKEN;
    function generateAccessToken(id)
    {
        return jwt.sign({userid:id},secret_key);
    }

    const email = req.body.useremail;
    User.findAll({where: {Email : email}})
    .then(record => {

            bcrypt.compare(req.body.userpassword,record[0].Password,(err,pmatch) => {
            if(pmatch)
            {
                res.status(200).json({record:record[0],token:generateAccessToken(record[0].id)});
            }
            else
            {
                res.status(400).json({error: "Password doesn't match"});
            }
        })
    })
    .catch(err => {
        res.status(400).json({error: "User doesn't exist"});
    })
    
}