const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const usertable = require("../models/tableUser");
const pwdrequesttable = require("../models/forgotpwdreq");
require("dotenv").config();
const API_KEY = process.env.SIB_KEY;



exports.checkEmail = (req,res,next) =>
{
  const email = req.body.emailid;
  usertable.findOne({where:{Email:email}})
    .then(record => {

      if (!record) {
        console.log("Record not found");
        throw new Error('Record not found');
      }
      console.log("Email found",record);
      res.status(200).json({rec:record});
      next();
    })
    .catch(err => {
      console.log("Not found");
      return res.status(400).json({ error: err });
    })
}

exports.sendLink = async(req, res, next) => {
  try {

    //generating uuid
    const uuid = require("uuid");
    const uniqueid = uuid.v4();
    console.log("uniqueid", uniqueid);

    //saving the request to the table
    const rec = await usertable.findOne({where:{Email:req.body.emailid}});
    await pwdrequesttable.create({
      uuid:uniqueid,
      email:rec.Email,
      isActive:true,
      userId: rec.id
    })



    //calling transactional email api
    const brevo = require("@getbrevo/brevo");
    let defaultClient = brevo.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = API_KEY;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Reset password";
    sendSmtpEmail.htmlContent =
      `<html><body><h2>We have received a reset password request from your account. If it is not you please contact our customer service as soon as possible.</h2><p>Click on the given link to reset the password</p><a href=http://localhost:4000/password/resetpassword/${uniqueid} style="color: black;"><button>Reset Password</button></a></body></html>`;
    sendSmtpEmail.sender = { name: "Kaseras", email: "stranger@kaseras.com" };
    sendSmtpEmail.to = [{ email: "s2kkasera@gmail.com" }];
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
      },
      function (error) {
        console.error(error);
      }
    );
  } catch (err) {
    console.log("Something is wrong");
    res.status(400).json({ error: err });
  }
};


exports.checkRequest  = async(req,res,next) => {
  try
  {
    const uid = req.params.uuid;
    const record =await pwdrequesttable.findOne({where:{uuid:uid}});
    const isActive = record.isActive;
    if(isActive)
    {
      next();
    }
    else
    {
      throw new Error("Link is expired, request another link");
    }
  }catch(err)
  {
    console.log("Something is wrong");
    res.status(400).send("<h1>Error 400</h1><h1>Something went wrong, please request another link.</h1>");
  }
  
}

exports.updatePassword = async (req,res,next) => {
  try
  {

    const newpwd = req.body.newpwd;
    const uid = req.body.uid;
    const reqrecord = await pwdrequesttable.findOne({where:{uuid:uid}});
    reqrecord.isActive=false;
    await reqrecord.save();
    const userid = reqrecord.userId;
    const salt=10;
    bcrypt.hash(newpwd,salt,async (err,hash) => {
      //console.log("hash is ",hash);
      const result = await usertable.update({Password:hash},{where:{id:userid}});
      res.status(200).json({result:result});

    })

  }catch(error)
  {
    res.status(450).json({error : error});
  }


}
