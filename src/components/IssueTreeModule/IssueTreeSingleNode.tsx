import React, { useEffect } from "react";
import TreeUtils from "../../util/TreeUtils";
import { ID, IssueField, IssueTreeFilter } from "../../types/api";
import { AtlasTree } from "../../types/app";
import { IssueTree } from "./IssueTree";

export interface Props {
  tree: AtlasTree;
  treeUtils: TreeUtils;
  setTree: any;
  filter: IssueTreeFilter;
  issueFields: IssueField[];
  selectedIssueFieldIds: ID[];
  handleError: any;
  clearAllErrors: () => void;
}

export const IssueTreeSingleNode = ({
  tree,
  treeUtils,
  setTree,
  filter,
  issueFields,
  selectedIssueFieldIds,
  handleError,
  clearAllErrors,
}: Props): JSX.Element => {
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });

  useEffect(() => {
    const initTree = async (): Promise<void> => {
      await treeUtils.initTreeHook(
        filter,
        treeUtils.findJiraFields(fieldMap, selectedIssueFieldIds),
        setTree,
        handleError
      );
    };
    void initTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IssueTree
      tree={tree}
      treeUtils={treeUtils}
      setTree={setTree}
      filter={filter}
      issueFields={issueFields}
      selectedIssueFieldIds={selectedIssueFieldIds}
      handleError={handleError}
      clearAllErrors={clearAllErrors}
    />
  );
};
