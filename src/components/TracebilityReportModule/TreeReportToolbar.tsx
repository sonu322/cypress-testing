import React from "react";
import { treeFilterDropdowns } from "../../constants/common";
import { TreeFilterDropdowns } from "../IssueTreeModule/TreeFilterDropdowns";

export const TreeReportToolbar = ({
  // priorities,
  // issueTypes,
  // linkTypes,
  options,
  filter,
  updateFilteredKeyOptions,
}): JSX.Element => {
  return (
    <TreeFilterDropdowns
      options={options}
      filter={filter}
      filterDropdowns={treeFilterDropdowns}
      updateFilteredKeyOptions={updateFilteredKeyOptions}
    />
  );
};
