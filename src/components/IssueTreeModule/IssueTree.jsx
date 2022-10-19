import React, { useEffect } from "react";
import styled from "styled-components";
import {
  filterTree,
  handleCollapse,
  handleExpand,
  populateInitialTree,
} from "../../util/issueTreeUtils";
import Tree from "@atlaskit/tree";
import { IssueItem } from "./IssueItem";

const Container = styled.div`
  display: flex;
`;

export const IssueTree = ({
  tree,
  setTree,
  filter,
  selectedIssueFieldIds,
  issueFields,
  issueCardOptionsMap,
  handleError,
}) => {
  useEffect(() => {
    if (issueFields && issueFields.size > 0) {
      populateInitialTree(issueFields, setTree, handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueFields]);

  const onExpand = (itemId) => {
    handleExpand(itemId, tree, setTree, issueFields);
  };

  const onCollapse = (itemId) => {
    handleCollapse(itemId, tree, setTree);
  };

  let filteredTree = filterTree(filter, tree);
  console.log(filteredTree);

  const renderItem = ({ ...props }) => {
    return (
      <IssueItem
        {...props}
        issueCardOptionsMap={issueCardOptionsMap}
        selectedIssueFieldIds={selectedIssueFieldIds}
      />
    );
  };
  return (
    <Container>
      <Tree
        tree={filteredTree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        isDragEnabled={false}
      />
    </Container>
  );
};
