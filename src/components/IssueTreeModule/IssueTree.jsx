import React, { useEffect } from "react";
import styled from "styled-components";
import { IssueLinkAPI } from "../api";
import {
  filterTree,
  formatIssue,
  getFieldIds,
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
          const {rootIssueData, relatedIssuesData} = data;
          const value = formatIssue(rootIssueData, null, null);
          const newTree = {...root};
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

  const handleExpand = (itemId) => {
    setTree(mutateTree(tree, itemId, { isChildrenLoading: true }));

    const newTree = {...tree};
    const item = newTree.items[itemId];
    if (item.hasChildren && item.children.length > 0) {
      setTree(
        mutateTree(newTree, itemId, {
          isExpanded: true,
          isChildrenLoading: false,
        })
      );
    } else {
      const fieldIds = getFieldIds(issueFields);
      IssueLinkAPI(item.data ? item.data.id : null, fieldIds).then((data) => {
        const { rootIssueData, relatedIssuesData } = data;
        let parent = (item.data || {}).parent;
        const parentType = parent ? newTree.items[parent] : null;
        parent = parent
          ? ((newTree.items[parent] || {}).data || {}).parent
          : null;
        const parentIssue = parent ? newTree.items[parent] : null;

        const parentTypeID = ((parentType || {}).data || {}).id;
        const parentIssueID = ((parentIssue || {}).data || {}).id;

        const value = formatIssue(rootIssueData, parentTypeID, parentIssueID);
        for (const child of value.children) {
          let childData = relatedIssuesData.issues.find(
            (issue) => issue.id == child.data.id
          );
          if (childData) {
            child.data.fields = childData.fields;
          }
          if (!newTree.items[child.id]) {
            newTree.items[child.id] = child;
          }
        }

        item.hasChildren = value.data.hasChildren;
        item.children = value.data.children;

        setTree(
          mutateTree(newTree, itemId, {
            isExpanded: true,
            isChildrenLoading: false,
          })
        );
      });
    }
  };

  const handleCollapse = (itemId) => {
    setTree(
      mutateTree(tree, itemId, {
        isExpanded: false,
        isChildrenLoading: false,
      })
    );
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
        onExpand={handleExpand}
        onCollapse={handleCollapse}
        isDragEnabled={false}
      />
    </Container>
  );
};
