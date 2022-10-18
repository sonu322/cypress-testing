import React, { useEffect } from "react";
import styled from "styled-components";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Spinner from "@atlaskit/spinner";
import Button from "@atlaskit/button";
import { colors } from "@atlaskit/theme";
import { IssueLinkAPI } from "../api";
import { formatIssue, getFieldIds } from "../../util/issueTreeUtils";
import Tree, { mutateTree } from "@atlaskit/tree";
import { IssueCard } from "../IssueCard";

const PADDING_LEVEL = 30;

const Box = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

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

const SpinnerContainer = styled.span`
  display: flex;
  min-width: 24px;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
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
          const value = formatIssue(data, null, null);
          root.items[data.id] = value.data;
          root.items["0"].children.push(data.id);
          for (const child of value.children) {
            root.items[child.id] = child;
          }
          setTree(mutateTree(root, "0", { isExpanded: true }));
          setIsFetched(true);
        })
        .catch((error) => handleError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueFields]);

  const ExpansionToggler = ({ isLoading, item, onExpand, onCollapse }) => {
    if (isLoading) {
      return (
        <SpinnerContainer onClick={() => onCollapse(item.id)}>
          <Spinner size={16} />
        </SpinnerContainer>
      );
    }
    if (item.hasChildren) {
      return item.isExpanded ? (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onCollapse(item.id)}
        >
          <ChevronDownIcon label="" size={16} />
        </Button>
      ) : (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onExpand(item.id)}
        >
          <ChevronRightIcon label="" size={16} />
        </Button>
      );
    }

    return <Box />;
  };
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
          isLoading={item.isChildrenLoading}
          onExpand={onExpand}
          onCollapse={onCollapse}
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
  const onExpand = (itemId) => {
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
        let parent = (item.data || {}).parent;
        const parentType = parent ? ntree.items[parent] : null;
        parent = parent
          ? ((ntree.items[parent] || {}).data || {}).parent
          : null;
        const parentIssue = parent ? ntree.items[parent] : null;

        const parentTypeID = ((parentType || {}).data || {}).id;
        const parentIssueID = ((parentIssue || {}).data || {}).id;

        const value = formatIssue(data, parentTypeID, parentIssueID);
        ntree.items[itemId].data = value.data.data;
        for (const child of value.children) {
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

  const onCollapse = (itemId) => {
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
      sgsdgfsd
      <Tree
        tree={hiddedTree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        isDragEnabled={false}
      />
    </Container>
  );
};
