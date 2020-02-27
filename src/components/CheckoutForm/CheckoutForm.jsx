import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";
import axios from "axios";
//import "./CheckoutForm.scss";

const CheckoutForm = ({
  selectedProduct,
  stripe,
  history,
  newCourseHistory,
  username
}) => {
  const courseHistory = useSelector(state => state.courseHistory);
  const dispatch = useDispatch();

  console.log("selected product is", selectedProduct);
  console.log("newCourseHistory is", newCourseHistory);

  if (selectedProduct === null) history.push("/");

  const [receiptUrl, setReceiptUrl] = useState("");

  let test = "none";

  useEffect(() => {
    console.log("mount");
    return () => {
      if (receiptUrl) {
        console.log("unmount with receipt");
        dispatch({
          type: "UPDATE-COURSE-HISTORY",
          payload: newCourseHistory
        });
      } else {
        console.log("unmount no receipt");
      }
    }; // function run on unmount ... avoids infinite re-rendering in component
  }, [receiptUrl]);

  const handleSubmit = async event => {
    console.log("entering handleSubmit");
    event.preventDefault();
    const { token } = await stripe.createToken();
    const order = await axios.post("http://localhost:7000/api/stripe/charge", {
      amount: selectedProduct.price
        .toFixed(2)
        .toString()
        .replace(".", ""),
      source: token.id,
      receipt_email: "robert.megens@gmail.com"
    });

    console.log("order");
    console.log(order);

    setReceiptUrl(order.data.charge.receipt_url);
  };

  const updateServerWithPurchase = async (newCourseHistory, username) => {
    console.log("username is " + username);
    let data = new FormData();
    data.append("newCourseHistory", JSON.stringify(newCourseHistory));
    data.append("username", username);
    let response = await fetch("/record-purchased-course/", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    let parsed = JSON.parse(body);
    console.log("completed server update with course purchased?");
    console.log(parsed);
  };

  if (receiptUrl) {
    console.log("receiptUrl");
    console.log(receiptUrl);
    updateServerWithPurchase(newCourseHistory, username);

    //dispatch({ type: "UPDATE-COURSE-HISTORY", payload: newCourseHistory }); NEED SOMETHING LIKE THIS NOT IN RENDER

    //Need to specify a second argument, which is an array

    return (
      <div className="success">
        <h2>Payment Successful!</h2>
        <br />
        <a href={receiptUrl} target="_blank">
          View Receipt
        </a>
        <br />
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
