import TracebilityReport from './TracebilityReport'
import CloudImpl from "./impl/Cloud";
import { APIContext } from "./context/api";
import React from "react";
window.React = React;
import ReactDOM from "react-dom";
let api = new CloudImpl();

// eslint-disable-next-line no-undef
const App = document.getElementById("app");

ReactDOM.render(
  <APIContext.Provider value={api}>
    <TracebilityReport context={APIContext}/>
  </APIContext.Provider>, App);