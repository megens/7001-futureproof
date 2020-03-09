import React, { useEffect, Component } from "react";
import { connect } from "react-redux";
import { StripeProvider, Elements } from "react-stripe-elements";
import CheckoutForm from "../CheckoutForm/CheckoutForm.jsx";
let jsonConfig = require("../../../config.json");
let sKey = jsonConfig.secret;
let pKey = jsonConfig.public;

console.log("pKey is " + pKey);

class Checkout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  render = () => {
    /*
    // hook to be inside function ... when this was a functional component
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
*/
    console.log("props");
    console.log(this.props.purchaseItem);
    console.log(this.props.rD);

    /*
    let newsubscriptions = JSON.parse(JSON.stringify(this.props.subscriptions));
    newsubscriptions[
      this.props.purchaseItem.courseCode
    ] = this.props.purchaseItem;
    */
    return (
      <StripeProvider apiKey={pKey}>
        <Elements>
          <CheckoutForm
            selectedProduct={this.props.purchaseItem}
            history={this.props.rD.history}
            // removed combined subscriptions
            username={this.props.username}
          />
        </Elements>
      </StripeProvider>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    purchaseItem: state.purchaseItem,
    subscriptions: state.subscriptions
  };
};

export default connect(mapStateToProps)(Checkout);
