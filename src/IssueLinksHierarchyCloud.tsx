import React from "react";
import ReactDOM from "react-dom";
import IssueLinksHierarchy from "./IssueLinksHierarchy";
import APIImpl from "./impl/Cloud";
import JiraCloudImpl from "./impl/jira/Cloud";
import { APIContext } from "./context/api";
window.React = React;
const jiraCloud = new JiraCloudImpl();
const api = new APIImpl(jiraCloud);

// eslint-disable-next-line no-undef
const App = document.getElementById("app");
console.log("ilhc called");
AP.require(["jira"], function (jira) {
  console.log("this call back function is called");
  console.log(jira);
});
// const response = await this._AP.request("/rest/api/3/dashboard");
// if (response?.body) {
//   console.log("all dashboards", JSON.parse(response.body));
// }

AP.require(["request"], function (request) {
  request({
    url: "/rest/api/3/dashboard/10002/items/10011/properties",
    success: function (response) {
      const arrayOfProperties = JSON.parse(response);
      console.log("response dashboards", arrayOfProperties);
    },
  });
});

const saveConfig = function (configuration, successCallback) {
  AP.require(["request"], function (request) {
    request({
      url: "/rest/api/3/dashboard/10002/items/10011/properties/config",
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(configuration),
      success: successCallback,
    });
  });
};
saveConfig(
  {
    name: "Lxp Gadget",
  },
  () => {
    console.log("successfully set gadget property");
  }
);
ReactDOM.render(
  <APIContext.Provider value={api}>
    <IssueLinksHierarchy />
  </APIContext.Provider>,
  App
);
