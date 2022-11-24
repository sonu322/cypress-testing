import React from "react";
import Button from "@atlaskit/button";
// @ts-expect-error
const _AP: any = typeof AP !== "undefined" ? AP: null;
const options = {
  header: "Filter Issues with JQL Query",
  descriptionText: "Use a new JQL query to search issues",
  submitText: "Use filter",
  cancelText: "Cancel",
  jql: "order by status ASC",
};
interface Props {
  selectedFilterId: string;
  setSelectedFilterId: React.Dispatch<React.SetStateAction<string>>;
}

export const JQLEditor = ({
  selectedFilterId,
  setSelectedFilterId,
}: Props): JSX.Element => {
  if (Boolean(selectedFilterId) && selectedFilterId !== null) {
    options.jql = selectedFilterId;
  }
  const callback = function ({ jql }: { jql: string }): void {
    setSelectedFilterId(jql);
  };
  const openJQLEditor = (): void => {
    if(_AP){
      _AP.jira.showJQLEditor(options, callback);
    }
  };
  return (
    <Button appearance="default" onClick={openJQLEditor}>
      Use JQL Editor
    </Button>
  );
};
