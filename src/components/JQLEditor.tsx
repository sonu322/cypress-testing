import React from "react";
import Button from "@atlaskit/button";
// @ts-expect-error
const _AP: any = AP;
const options = {
  // TODO: replace with a good placeholder filter
  header: "Filter Issues with JQL Query",
  descriptionText: "Enter query below",
  submitText: "Use filter",
  cancelText: "Cancel",
  jql: 'order by status ASC'
};

export const JQLEditor = ({ selectedFilterId, setSelectedFilterId }) => {
  if (selectedFilterId && selectedFilterId !== null) {
    options.jql = selectedFilterId;
  }
  const callback = function ({ jql }: { jql: string }) {
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
