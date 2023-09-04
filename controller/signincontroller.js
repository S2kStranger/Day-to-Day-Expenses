
const path = require('path');

const bcrypt = require("bcrypt");
const userTable = require('../models/tableUser');

exports.loggingIn = (req,res,next) => {
    const email = req.body.useremail;
    userTable.findOne({where: {Email : email}})
    .then(record => {
        console.log("comparing the password");

            bcrypt.compare(req.body.userpassword,record.Password,(err,pmatch) => {
            if(pmatch)
            {
                console.log("Password matched");
                 res.sendFile(path.join(__dirname,'..','views','home.html'));
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