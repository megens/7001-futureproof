import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import store from "./store.js";
import App from "./components/App/App.jsx";
import "babel-polyfill";
import "./main.css";
import "./nv.d3.css";

import reloadMagic from "./reload-magic-client.js"; // automatic reload

reloadMagic(); // automatic reload

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
