
const path = require('path');

const userTable = require('../models/tableUser');

exports.loggingIn = (req,res,next) => {
    const email = req.body.useremail;
    userTable.findOne({where: {Email : email}})
    .then(record => {
        if(record.Password != req.body.userpassword)
        {
            console.log("Password not matched");
            res.status(400).json({error: "Password doesn't match"});
        }
        else
        {
            console.log("Password matched");
            res.sendFile(path.join(__dirname,'..','views','home.html'));
        }
    })
    .catch(err => {
        res.status(400).json({error: "User doesn't exist"});
    })
    
}