import React from "react";
import ReactDOM from "react-dom";
import URLSearchParams from "@ungap/url-search-params";
import LicenseContainer from "./components/LicenseContainer";
import { MainTree } from "./components/IssueTreeModule";
const searcher = new URLSearchParams(location.search);
const App = document.getElementById("app");

if (searcher.has("lic") && "none" === searcher.get("lic")) {
  ReactDOM.render(<LicenseContainer />, App);
} else {
  ReactDOM.render(<MainTree />, App);
}
