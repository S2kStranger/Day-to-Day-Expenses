const ordertable = require("../models/orders");
require("dotenv").config();
const Razorpay = require("razorpay");
const userTable = require("../models/tableUser");

exports.purchasePremium = (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 5000;
    instance.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log("Error occured");
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


exports.getLeaderboard = async (req, res, next) => {
  //Using join
  try {

    //directly calling data from usertable

    const results = await userTable.findAll({
      attributes:['Profile_name','Total_Expense'],
      order:[['Total_Expense','DESC']]
    })


    // //Using join using sequelize
    // const results = await userTable.findAll({
    //   attributes: ['id','Profile_name', [sequelize.fn('sum',sequelize.col('expenses.amount')),'total_expense']],
    //   include : [
    //     {
    //       model: expenseTable,
    //       attributes:[] 
    //     }
    //   ],
    //   group:['users.id'],
    //   order:[['total_expense','DESC']]
    // })

    // //Use join using SQL query
    // const [results, metadata] = await sequelize.query(
    //   "select daytodayexpense.users.id,Profile_name,userID,sum(amount) as total_expense from daytodayexpense.users LEFT JOIN daytodayexpense.expenses on daytodayexpense.users.id=daytodayexpense.expenses.userId group by daytodayexpense.users.id order by total_expense desc;"
    // );
    //console.log(results);
    res.status(200).json({ lbobj: results });
  } catch (err) {
    res.status(400).json({ message: err });
  }

  // //Using simple queries and sending to tables
  //   try {
  //     console.log("On glb");
  //     const users = await expenseTable.findAll({
  //       attributes: [ "userId", [sequelize.fn("sum", sequelize.col("amount")), "total_expense"]],
  //       group: ["userId"],
  //       order: [["total_expense","desc"]]
  //     });
  //     const names = await userTable.findAll({
  //       attributes: ["id", "Profile_name"],
  //     });
  //     console.log(users);
  //     console.log(names);

  //     var arr=[];
  //     users.forEach((element) => {
  //           console.log("element id "+element.total_expense);
  //           var obj = {name: names[element.userId-1].Profile_name,texpense:element.total_expense}
  //           console.log("printing obj: name:"+obj.name+" and texpense: "+obj.texpense);
  //           arr.push(obj);
  //     })

  //     return res.status(200).json({ userarr: users, namesarr: names });
  //   } catch (err) {
  //     res.status(400).json({ message: err });
  //   }
};
