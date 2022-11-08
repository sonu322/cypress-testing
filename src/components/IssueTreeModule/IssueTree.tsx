import React, { useEffect } from "react";
import styled from "styled-components";
import TreeUtils from "../../util/TreeUtils";
import Tree from "@atlaskit/tree";
import { IssueItem } from "./IssueItem";
import { ID, IssueField, IssueTreeFilter } from "../../types/api";
import { AtlasTree } from "../../types/app";

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
}

export const IssueTree = ({
  tree,
  treeUtils,
  setTree,
  filter,
  issueFields,
  selectedIssueFieldIds,
  handleError,
}: Props) => {
  let fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });

  const findJiraFields = (selectedFieldIds): IssueField[] => {
    let result = [];
    for (let fieldId of selectedFieldIds) {
      result.push(fieldMap[fieldId] as IssueField);
    }
    return result;
  };

  useEffect(() => {
    treeUtils.initTreeHook(
      filter,
      findJiraFields(selectedIssueFieldIds),
      setTree,
      handleError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    treeUtils.applyFilterHook(
      setTree, 
      filter,
      findJiraFields(selectedIssueFieldIds)
    )
  }, [filter, selectedIssueFieldIds]);

  const onExpand = (itemId) => {
    treeUtils.expandTreeHook(
      itemId,
      filter,
      findJiraFields(selectedIssueFieldIds),
      setTree,
      handleError
    );
  };

  const onCollapse = (itemId) => {
    treeUtils.collapseTreeHook(itemId, setTree);
  };

  const renderItem = ({ ...props }) => {
    return (
      //@ts-ignore
      <IssueItem {...props} selectedIssueFieldIds={selectedIssueFieldIds} />
    );
  };

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
};
