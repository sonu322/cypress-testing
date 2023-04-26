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
  rootIssueKey?: string;
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
  rootIssueKey,
}: Props): JSX.Element => {
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });

  useEffect(() => {
    const initTree = async (): Promise<void> => {
      await treeUtils.handleInitTree(
        filter,
        treeUtils.findJiraFields(fieldMap, selectedIssueFieldIds),
        setTree,
        handleError,
        rootIssueKey
      );
    };
    void initTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootIssueKey]);

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
