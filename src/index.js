import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "rsuite/dist/styles/rsuite-default.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
