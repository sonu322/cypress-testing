import React from "react";
import ReactDOM from "react-dom";
import URLSearchParams from "@ungap/url-search-params";
import LicenseContainer from "./components/LicenseContainer";
import { IssueTreeModule } from "./components/IssueTreeModule/IssueTreeModule";
// eslint-disable-next-line no-undef
const searcher = new URLSearchParams(location.search);
// eslint-disable-next-line no-undef
const App = document.getElementById("app");

if (searcher.has("lic") && "none" === searcher.get("lic")) {
  ReactDOM.render(<LicenseContainer />, App);
} else {
  ReactDOM.render(<IssueTreeModule />, App);
}
