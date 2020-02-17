let jsonConfig = require("../config.json");
let sKey = jsonConfig.secret;
let pKey = jsonConfig.public;

const stripe = require("stripe")(sKey); // 999 is a placeholder for <your secret key>

async function postCharge(req, res) {
  console.log("sKey is ", sKey);
  try {
    const { amount, source, receipt_email } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency: "cad",
      source,
      receipt_email
    });

    if (!charge) throw new Error("charge unsuccessful");

    res.status(200).json({
      message: "charge posted successfully",
      charge
    });
  } catch (error) {
    console.log("error caught...");
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = postCharge;
