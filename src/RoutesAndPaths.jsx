import React, { Component } from "react";
import { Link, Route, BrowserRouter, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Routes extends Component {
  constructor() {
    super();
  }

  renderBrowseMarket = () => {
    console.log("browseMarket");
    this.props.dispatch({ type: "BROWSE" });
    return <ShopShelf />;
  };

  renderLoginSignup = () => {
    this.props.dispatch({
      type: "SET-CURRENT-CONTAINER-TYPE",
      payload: "cart"
    });
    console.log("username is " + this.props.username);
    if (
      this.props.username === undefined ||
      this.props.username === "browsing ..."
    ) {
      return <>hello</>;
    }
    return <></>;
  };

  performLogout = async () => {
    console.log("performing logout");
    let data = new FormData();
    data.append("username", this.props.username);
    data.append("cart", JSON.stringify(this.props.cart));

    console.log("what is happening to my cart?");
    console.log(this.props.cart);

    let response = await fetch("/logout", { method: "POST", body: data });
    let body = await response.text();
    let parsed = JSON.parse(body);
    console.log("completed logout?");
    console.log(parsed);
    this.props.dispatch({
      type: "LOGOUT",
      payload: { username: this.props.username, cart: this.props.cart }
    });
  };

  renderLogout = routerData => {
    console.log("render Logout");
    return <Logout rD={routerData} />;
  };

  renderCart = () => {
    console.log("render cart");
    return <Cart />;
  };

  renderCheckout = () => {
    console.log("running checkout");
    return <Checkout />;
  };

  renderShopShelf = () => {
    console.log("render shop");
    this.props.dispatch({
      type: "SET-CURRENT-CONTAINER-TYPE",
      payload: "cart"
    });
    return <ShopShelf />;
  };

  renderSalesPage = routerData => {
    console.log("become seller");
    return <MySeller rD={routerData} />;
  };

  renderNewDesign = routerData => {
    this.props.dispatch({
      type: "SET-CURRENT-CONTAINER-TYPE",
      payload: "currentDesignCart"
    });
    return <NewDesign rD={routerData} />;
  };

  renderUploadPart = routerData => {
    return <NewPart rD={routerData} />;
  };

  renderEditDesign = routerData => {
    let designId = routerData.match.params.designId;
    this.props.dispatch({
      type: "SET-CURRENT-CONTAINER-TYPE",
      payload: "currentDesignCart"
    });
    return <EditDesign designId={designId} rD={routerData} />;
  };

  renderDeleteDesign = routerData => {
    let designId = routerData.match.params.designId;
    this.props.dispatch({
      type: "SET-CURRENT-CONTAINER-TYPE",
      payload: "currentDesignCart"
    });
    return <DeleteDesign designId={designId} rD={routerData} />;
  };

  renderViewDesign = routerData => {
    let designId = routerData.match.params.designId;
    return <AddDesignToCart designId={designId} rD={routerData} />;
  };

  renderMyInventory = () => {
    console.log("render inventory");
    this.props.dispatch({
      type: "SET-CURRENT-CONTAINER-TYPE",
      payload: "personalInventory"
    });
    return <MyInventory />; // shopType = cart or design
  };

  render = () => {
    return (
      <div>
        <Route exact={true} path="/" render={this.renderLoginSignup} />
        <Route exact={true} path="/cart/" render={this.renderCart} />
        <Route
          exact={true}
          path="/delete-design/:designId"
          render={this.renderDeleteDesign}
        />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    cart: state.cart,
    designsCart: state.designsCart,
    sellerStatus: state.sellerStatus,
    currentItemContainer: state.currentItemContainer,
    shopDesigns: state.shopDesigns
  }; // THIS WILL CHANGE
};

let RoutesAndPaths = connect(mapStateToProps)(Routes);

export { RoutesAndPaths };
