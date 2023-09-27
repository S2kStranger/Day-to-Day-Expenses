const express = require('express');
const router = express.Router();

const path = require('path');

const userauthorization = require("../middleware/auth");
const purchaseController = require("../controller/puchasecontroller");


router.get("/purchase/premium_membership",userauthorization.authorization,purchaseController.purchasePremium);


router.post("/purchase/updatetransactionstatus",userauthorization.authorization,purchaseController.updatePremiumStatus);

router.post("/purchase/failedtransaction",purchaseController.failedTransaction);


module.exports=router;