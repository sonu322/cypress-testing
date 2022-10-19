import React, { useEffect } from "react";
import styled from "styled-components";
import { IssueLinkAPI } from "../api";
import {
  filterTree,
  formatIssue,
  getFieldIds,
  handleCollapse,
  handleExpand,
} from "../../util/issueTreeUtils";
import Tree, { mutateTree } from "@atlaskit/tree";
import { IssueItem } from "./IssueItem";

const Container = styled.div`
  display: flex;
`;

export const IssueTree = ({
  root,
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
      const fieldIds = getFieldIds(issueFields);
      IssueLinkAPI(null, fieldIds) // fetches root issue
        .then((data) => {
          const { rootIssueData, relatedIssuesData } = data;
          const value = formatIssue(rootIssueData, null, null);
          const newTree = { ...root };
          newTree.items[rootIssueData.id] = value.data;
          newTree.items["0"].children.push(rootIssueData.id);
          for (const child of value.children) {
            let childData = relatedIssuesData.issues.find(
              (issue) => issue.id == child.data.id
            );
            if (childData) {
              child.data.fields = childData.fields;
            }
            newTree.items[child.id] = child;
          }
          setTree(mutateTree(newTree, "0", { isExpanded: true }));
        })
        .catch((error) => handleError(error));
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
