import React from "react";
import Button from "@atlaskit/button";
// @ts-ignore
const _AP: any = AP;
var options = {
  jql: "project = ACJS",
  header: "Filter Issues with JQL Query",
  descriptionText: "Enter query below",
  submitText: "Use filter",
  cancelText: "Cancel",
};

export const JQLEditor = ({ setSelectedFilterId }) => {
  var callback = function ({ jql }: { jql: string }) {
    console.log(jql);
    setSelectedFilterId(jql);
  };
  const openJQLEditor = () => {
    _AP.jira.showJQLEditor(options, callback);
  };
  return (
    <Button appearance="primary" onClick={openJQLEditor}>
      Use JQL Editor
    </Button>
  );
};
