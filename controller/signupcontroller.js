const express = require('express');
const router = express.Router();
const path = require('path');

exports.postUser = (req,res,next) => {

    try{
        res.status(200).json({result : res.body});
    }catch(err){
        res.status(500).json({error: err});
    }

}