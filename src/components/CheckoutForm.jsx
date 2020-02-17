import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";
import axios from "axios";
//import "./CheckoutForm.scss";

const CheckoutForm = ({ selectedProduct, stripe, history }) => {
  console.log("selected product is", selectedProduct);

  if (selectedProduct === null) history.push("/");

  const [receiptUrl, setReceiptUrl] = useState("");

  const handleSubmit = async event => {
    console.log("entering handleSubmit");
    event.preventDefault();
    console.log("entering handleSubmit");
    const { token } = await stripe.createToken();
    console.log("token");
    console.log(token);
    const order = await axios.post("http://localhost:7000/api/stripe/charge", {
      amount: selectedProduct.price.toString().replace(".", ""),
      source: token.id,
      receipt_email: "robert.megens@gmail.com"
    });

    console.log("order");
    console.log(order);

    setReceiptUrl(order.data.charge.receipt_url);
  };

  if (receiptUrl) {
    console.log("receiptUrl");
    return (
      <div className="success">
        <h2>Payment Successful!</h2>
        <a href={receiptUrl}>View Receipt</a>
        <Link to="/">Home</Link>
      </div>
    );
  }
  console.log("not receiptUrl");
  return (
    <div className="checkout-form">
      <p>Amount: ${selectedProduct.price}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Card details
          <CardNumberElement />
        </label>
        <label>
          Expiration date
          <CardExpiryElement />
        </label>
        <label>
          CVC
          <CardCVCElement />
        </label>
        <button type="submit" className="order-button">
          Pay
        </button>
      </form>
    </div>
  );
};

export default injectStripe(CheckoutForm);
