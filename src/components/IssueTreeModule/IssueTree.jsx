import React, { useEffect } from "react";
import styled from "styled-components";
import { IssueLinkAPI } from "../api";
import { formatIssue, getFieldIds } from "../../util/issueTreeUtils";
import Tree, { mutateTree } from "@atlaskit/tree";
import { IssueItem } from "./IssueItem";

const Container = styled.div`
  display: flex;
`;

export const IssueTree = ({
  root,
  tree,
  setTree,
  isFetched,
  setIsFetched,
  filter,
  selectedIssueFieldIds,
  issueFields,
  issueCardOptionsMap,
  handleError,
}) => {
  useEffect(() => {
    if (issueFields && issueFields.size > 0) {
      console.log("use eff called");
      const fieldIds = getFieldIds(issueFields);
      IssueLinkAPI(null, fieldIds) // fetches root issue
        .then((data) => {
          console.log("data!!1");
          console.log(data);
          const value = formatIssue(data.rootIssueData, null, null);
          console.log(value);
          root.items[data.rootIssueData.id] = value.data;
          root.items["0"].children.push(data.rootIssueData.id);
          for (const child of value.children) {
            let childData = data.relatedIssuesData.issues.find(
              (issue) => issue.id == child.data.id
            );
            if (childData) {
              child.data.fields = childData.fields;
            }
            root.items[child.id] = child;
          }
          setTree(mutateTree(root, "0", { isExpanded: true }));
          setIsFetched(true);
        })
        .catch((error) => handleError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueFields]);

  const handleExpand = (itemId) => {
    setTree(mutateTree(tree, itemId, { isChildrenLoading: true }));

    const ntree = tree;
    const item = ntree.items[itemId];
    if (item.hasChildren && item.children.length > 0) {
      setTree(
        mutateTree(ntree, itemId, {
          isExpanded: true,
          isChildrenLoading: false,
        })
      );
    } else {
      const fieldIds = getFieldIds(issueFields);
      IssueLinkAPI(item.data ? item.data.id : null, fieldIds).then((data) => {
        const { rootIssueData, relatedIssuesData } = data;
        let parent = (item.data || {}).parent;
        const parentType = parent ? ntree.items[parent] : null;
        parent = parent
          ? ((ntree.items[parent] || {}).data || {}).parent
          : null;
        const parentIssue = parent ? ntree.items[parent] : null;

        const parentTypeID = ((parentType || {}).data || {}).id;
        const parentIssueID = ((parentIssue || {}).data || {}).id;

        const value = formatIssue(rootIssueData, parentTypeID, parentIssueID);
        // ntree.items[itemId].data = value.data.data;
        for (const child of value.children) {
          let childData = relatedIssuesData.issues.find(
            (issue) => issue.id == child.data.id
          );
          if (childData) {
            child.data.fields = childData.fields;
          }
          if (!ntree.items[child.id]) {
            ntree.items[child.id] = child;
          }
        }

        item.hasChildren = value.data.hasChildren;
        item.children = value.data.children;

        setTree(
          mutateTree(ntree, itemId, {
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

  const filteredTree = mutateTree(
    {
      rootId: "0",
      items: {
        0: {
          id: "0",
          children: [],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
          data: {
            title: "Fake Root Node",
          },
        },
      },
    },
    "0",
    { isExpanded: true }
  );

  if (isFetched) {
    const { linkTypes, issueTypes, priorities } = filter;
    const root = tree.items[tree.rootId];
    const rootChildren = root.children;
    Object.keys(tree.items).forEach((key) => {
      const item = JSON.parse(JSON.stringify(tree.items[key]));
      if (item.data) {
        const data = item.data;

        if (key == tree.rootId || rootChildren.includes(key)) {
          filteredTree.items[key] = item;
        } else {
          if (data.isType) {
            if (
              linkTypes.length === 0 ||
              linkTypes.includes(data.id) ||
              data.id === "-1"
            ) {
              filteredTree.items[key] = item;
            }
          } else {
            const { issuetype, priority } = data.fields;
            if (
              (issueTypes.length === 0 || issueTypes.includes(issuetype.id)) &&
              (priorities.length === 0 || priorities.includes(priority.id))
            ) {
              filteredTree.items[key] = item;
            }
          }
        }
      }
    });
  }

  const keys = Object.keys(filteredTree.items);
  keys.forEach((key) => {
    const item = filteredTree.items[key];
    item.children = item.children.filter((i) => keys.includes(i));
    if (item.children.length === 0 && item.isExpanded) {
      item.hasChildren = false;
    }
  });
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
