const express = require("express");
const router = express.Router();
require('dotenv').config();
const API_KEY = process.env.SIB_KEY;

exports.sendLink = async(req,res,next) => {
    try
    {
      // var SibApiV3Sdk = require('sib-api-v3-sdk');
      // var defaultClient = SibApiV3Sdk.ApiClient.instance;
      // var apiKey = defaultClient.authentications['api-key'];
      // apiKey.apiKey = API_KEY;
      // var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      // var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

      // sendSmtpEmail = {
      //   to: [{
      //     email: 's2kkasera@gmail.com',
      //     name: 'Shivam Kasera'
      //   }],
      //   templateId: 59,
      //   params: {
      //     name: 'Shivam',
      //     surname: 'Kasera'
      //   },
      //   headers: {
      //     'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
      //   }
      // };


      // apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
      //   console.log('API called successfully. Returned data: ' + data);
      // }, function(error) {
      //   console.error(error);
      // });


      const brevo = require('@getbrevo/brevo');
      let defaultClient = brevo.ApiClient.instance;

      let apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = API_KEY;

      let apiInstance = new brevo.TransactionalEmailsApi();
      let sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject = "Reset password";
      sendSmtpEmail.htmlContent = "<html><body><h1>We have received a reset password request from your account. If it is not you please contact our customer service as soon as possible.</h1></body></html>";
      sendSmtpEmail.sender = { "name": "Kaseras", "email": "stranger@kaseras.com" };
      sendSmtpEmail.to = [
        { "email": "s2kkasera@gmail.com"}
      ];
      apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      }, function (error) {
        console.error(error);
      });
    }catch(err)
    {
        console.log("Something is wrong");
        res.status(400).json({error:err});
    }

}