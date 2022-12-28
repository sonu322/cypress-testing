import React from "react";
import { treeFilterDropdowns } from "../../constants/common";
import { TreeFilterDropdowns } from "../IssueTreeModule/TreeFilterDropdowns";

export const TreeReportToolbar = ({
  priorities,
  issueTypes,
  linkTypes,
  filter,
  updateFilteredKeyOptions,
}): JSX.Element => {
  const options = {
    priorities,
    issueTypes,
    linkTypes,
  };
  return (
    <TreeFilterDropdowns
      options={options}
      filter={filter}
      filterDropdowns={treeFilterDropdowns}
      updateFilteredKeyOptions={updateFilteredKeyOptions}
    />
  );
};
