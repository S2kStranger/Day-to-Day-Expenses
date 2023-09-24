const jwt = require("jsonwebtoken");
const User = require("../models/tableUser");
require('dotenv').config();

const secret_key = process.env.AUTH_TOKEN;

exports.authorization = (req,res,next) => {
    try
    {
        const token = req.header('Authorization');
        const userid = jwt.verify(token,secret_key);
        User.findByPk(userid.userid)
            .then(result => {
                req.user = result;
                next();
            })
            .catch(err => { throw new error (err)});
    }catch(err)
    {
        console.log(err);
        return res.status(401).json({success:false});
    }
}
