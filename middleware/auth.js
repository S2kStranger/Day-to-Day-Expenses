const jwt = require("jsonwebtoken");
const User = require("../models/tableUser");
const secret_key = "f9d99d5ab8e88d60dc034829f3326fb56ba52aa42a40a50bd7269a5151f828fa";

exports.authorization = (req,res,next) => {
    try
    {
        const token = req.header('Authorization');
        console.log(token);
        //const userid = Number(jwt.verify(token,secret_key));
        const userid = jwt.verify(token,secret_key);
        console.log("User id fetched: "+userid.userid);
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
