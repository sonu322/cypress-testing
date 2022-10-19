import React, { useEffect } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { IssueLinkAPI } from "../api";
import { formatIssue, getFieldIds } from "../../util/issueTreeUtils";
import Tree, { mutateTree } from "@atlaskit/tree";
import { IssueCard } from "../IssueCard";
import { ExpansionToggler } from "../ExpansionToggler";
const PADDING_LEVEL = 30;

const LinkTypeContainer = styled.div`
  display: flex;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${colors.N30}
  fill: ${colors.N30};
  padding-left: 6px;
  padding-right: 6px;
  font-weight: 500;
  text-transform: capitalize;
`;
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

  const getItemStyle = (depth) => {
    const style = {
      margin: ".5em 0",
      display: "flex",
      marginLeft: "0px",
    };

    style["marginLeft"] = PADDING_LEVEL * depth + "px";

    return style;
  };

  const renderItem = ({ item, onExpand, onCollapse, provided, depth }) => {
    return (
      <div
        style={getItemStyle(depth)}
        ref={provided.innerRef}
        {...provided.dragHandleProps}
      >
        <ExpansionToggler
          item={item}
          isExpanded={item.isExpanded}
          isLoading={item.isChildrenLoading}
          onExpand={() => onExpand(item.id)}
          onCollapse={() => onCollapse(item.id)}
          isTogglerDisabled={!item.hasChildren}
        ></ExpansionToggler>
        {item.data && item.data.isType ? (
          <LinkTypeContainer>
            {item.data ? item.data.title : "No Name"}
          </LinkTypeContainer>
        ) : (
          <IssueCard
            issueData={item.data ?? null}
            selectedIssueFieldIds={selectedIssueFieldIds}
            issueCardOptionsMap={issueCardOptionsMap}
            isIssueExpanded={item.isExpanded}
          />
        )}
      </div>
    );
  };
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

  const hiddedTree = mutateTree(
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
          hiddedTree.items[key] = item;
        } else {
          if (data.isType) {
            if (
              linkTypes.length === 0 ||
              linkTypes.includes(data.id) ||
              data.id === "-1"
            ) {
              hiddedTree.items[key] = item;
            }
          } else {
            const { issuetype, priority } = data.fields;
            if (
              (issueTypes.length === 0 || issueTypes.includes(issuetype.id)) &&
              (priorities.length === 0 || priorities.includes(priority.id))
            ) {
              hiddedTree.items[key] = item;
            }
          }
        }
      }
    });
  }

  const keys = Object.keys(hiddedTree.items);
  keys.forEach((key) => {
    const item = hiddedTree.items[key];
    item.children = item.children.filter((i) => keys.includes(i));
    if (item.children.length === 0 && item.isExpanded) {
      item.hasChildren = false;
    }
  });
  return (
    <Container>
      <Tree
        tree={hiddedTree}
        renderItem={renderItem}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
        isDragEnabled={false}
      />
    </Container>
  );
};
