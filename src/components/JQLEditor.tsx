import React from "react";
import Button from "@atlaskit/button";
// @ts-expect-error
const _AP: any = AP;
const options = {
  header: "Filter Issues with JQL Query",
  descriptionText: "Enter query below",
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
  const callback = function ({jql}: {jql: string}): void {
    console.log(jql);
    setSelectedFilterId(jql);
  };
  const openJQLEditor = (): void => {
    _AP.jira.showJQLEditor(options, callback);
  };
  return (
    <Button appearance="primary" onClick={openJQLEditor}>
      Use JQL Editor
    </Button>
  );
};
