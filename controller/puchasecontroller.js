const ordertable = require("../models/orders");
require("dotenv").config();
const Razorpay = require("razorpay");

exports.purchasePremium = (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 5000;
    instance.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log("Error occuered");
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({
          orderid: order.id,
          status: "PENDING",
        })
        .then(() => {
          return res.status(201).json({ order, key_id: instance.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatePremiumStatus = async (req, res, next) => {
  try {
    const orderId = req.body.order_id;
    const paymentId = req.body.payment_id;
    const p1 = await ordertable.findOne({ where: { orderid: orderId } });
    const p2 = p1.update({ paymentid: paymentId, status: "Successfull" });
    const p3 = req.user.update({ isPremium: true });
    Promise.all([p2, p3])
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Transaction Successfull" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.failedTransaction = async (req, res, next) => {
  try {
    const orderId = req.body.order_id;
    const order = await ordertable.findOne({ where: { orderid: orderId } });
    const result = await order.update({ status: "Failed" });
    return res.status(200).json({ message: "Transaction failed" });
  } catch (err) {
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};
