import React, { useEffect } from "react";
import styled from "styled-components";
import TreeUtils from "../../util/TreeUtils";
import Tree from "@atlaskit/tree";
import { IssueItem } from "./IssueItem";
import { ID, IssueField, IssueTreeFilter } from "../../types/api";
import { AtlasTree } from "../../types/app";
import { useTranslation } from "react-i18next";
import Button from "@atlaskit/button";
const Container = styled.div`
  display: flex;
`;

export interface Props {
  tree: AtlasTree;
  treeUtils: TreeUtils;
  setTree: any;
  filter: IssueTreeFilter;
  issueFields: IssueField[];
  selectedIssueFieldIds: ID[];
  handleError: any;
  clearAllErrors: () => void;
  isMultiNodeTree?: boolean;
  isOrphansBranchPresent?: boolean;
  selectedJqlString?: string;
}

export const IssueTree = ({
  tree,
  treeUtils,
  setTree,
  filter,
  issueFields,
  selectedIssueFieldIds,
  handleError,
  clearAllErrors,
  isMultiNodeTree,
  isOrphansBranchPresent,
  selectedJqlString,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const loadingText = t("lxp.common.loading");
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });
  console.log(
    "selected issue field ids form issue tree",
    selectedIssueFieldIds
  );
  useEffect(() => {
    if (isMultiNodeTree) {
      setTree((tree) => {
        const newTree = treeUtils.applyMultiNodeTreeFilter(
          tree,
          filter,
          issueFields
        );
        return newTree;
      });
    } else {
      treeUtils.applyFilterHook(tree, setTree, filter, issueFields);
    }
  }, [filter]);
  useEffect(() => {
    setTree((tree) => {
      const newTree = treeUtils.cloneTree(tree);
      return newTree;
    });
  }, [selectedIssueFieldIds]);

  const onExpand = (itemId) => {
    treeUtils.expandTreeHook(
      itemId,
      filter,
      treeUtils.findJiraFields(fieldMap, selectedIssueFieldIds),
      setTree,
      handleError,
      clearAllErrors
    );
  };

  const onCollapse = (itemId) => {
    treeUtils.collapseTreeHook(itemId, setTree);
  };

  const renderItem = ({ ...props }) => {
    return (
      // @ts-expect-error
      <IssueItem
        {...props}
        selectedIssueFieldIds={selectedIssueFieldIds}
        selectedJqlString={selectedJqlString}
        issueFields={issueFields}
        setTree={setTree}
        handleError={handleError}
      />
    );
    // }
  };

  if (tree !== undefined && tree.items !== undefined) {
    return (
      <Container>
        <Tree
          tree={tree}
          renderItem={renderItem}
          onExpand={onExpand}
          onCollapse={onCollapse}
          isDragEnabled={false}
        />
      </Container>
    );
  } else {
    return <em>{loadingText}</em>;
  }
};
