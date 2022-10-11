import React, { useEffect } from "react";
import styled from "styled-components";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Spinner from "@atlaskit/spinner";
import Button from "@atlaskit/button";
// import { Item } from "@atlaskit/navigation-next";
import { colors } from "@atlaskit/theme";
// import Lozenge from "@atlaskit/lozenge";
import { IssueLinkAPI } from "../api";
import {
  UUID,
  // getStatusAppearance
} from "../../util";
import Tree, { mutateTree } from "@atlaskit/tree";
import { IssueCard } from "../IssueCard";

const PADDING_LEVEL = 30;
const SUB_TASKS = "Subtasks";
const PARENT = "Parent";

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
// const ItemWrapper = styled.div`
//   display: flex;
//   width: 270px;
// `;

// const IconContainer = styled.span`
//   display: flex;
//   width: 16px;
//   overflow: hidden;
//   height: 16px;
// `;

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

// const InnerElem = styled.div`
//   display: flex;
// `;

// const TextContent = styled.span`
//   margin-left: 4px;
//   font-weight: 500;
//   vertical-align: middle;
// `;

export const IssueTree = ({
  root,
  tree,
  setTree,
  isFetched,
  setIsFetched,
  filter,
  selectedIssueFields,
  issueFields,
}) => {
  const formatIssueData = (data, parent) => {
    return {
      title: data.key,
      id: data.id,
      parent: parent,
      summary: data.fields.summary,
      type: data.fields.issuetype,
      priority: data.fields.priority,
      status: data.fields.status,
      isType: false,
    };
  };

  const formatIssue = (data, parentTypeID, parentIssueID) => {
    let hasChildren = false;
    const ids = [];
    const typeMap = new Map();
    const items = [];
    const subTasks = [];
    const subTypeID = UUID(); //`${data.id}-0`;
    if (data.fields.subtasks.length > 0) {
      typeMap.set(SUB_TASKS, {
        id: subTypeID,
        children: subTasks,
        hasChildren: true,
        isChildrenLoading: false,
        isExpanded: true,
        data: {
          id: "-1",
          parent: data.id,
          title: SUB_TASKS,
          summary: "Issue Sub Tasks",
          isType: true,
        },
      });
    }

    for (const issue of data.fields.subtasks) {
      if (issue.id !== parentIssueID) {
        const issueID = UUID();
        subTasks.push(issueID);
        items.push({
          id: issueID,
          children: [],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: false,
          data: formatIssueData(issue, subTypeID),
        });
      }
    }
    if (subTasks.length === 0) {
      typeMap.delete(SUB_TASKS);
    } else {
      hasChildren = true;
      ids.push(subTypeID);
    }

    if (data.fields.parent) {
      const parentIssueLinkID = UUID();
      const parentIssueTypeID = UUID();
      const parent = data.fields.parent;
      if (parent.id !== parentIssueID) {
        typeMap.set(PARENT, {
          id: parentIssueLinkID,
          children: [parentIssueTypeID],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: true,
          data: {
            id: "-1",
            parent: data.id,
            title: PARENT,
            summary: "Issue parent",
            isType: true,
          },
        });

        items.push({
          id: parentIssueTypeID,
          children: [],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: false,
          data: formatIssueData(parent, parentIssueLinkID),
        });

        ids.push(parentIssueLinkID);
      }
    }

    const typeIDMap = new Map();
    const getTypeID = (id, inwards) => {
      const key = id + (inwards ? "-inwards" : "-outwards");
      if (!typeIDMap.has(key)) {
        typeIDMap.set(key, UUID());
      }
      return typeIDMap.get(key);
    };

    for (const { type, inwardIssue, outwardIssue } of data.fields.issuelinks) {
      if (
        (inwardIssue && inwardIssue.id !== parentIssueID) ||
        (outwardIssue && outwardIssue.id !== parentIssueID)
      ) {
        hasChildren = true;
        const inwards = inwardIssue ? true : false;
        const typeID = getTypeID(type.id, inwards); //`${data.id}-${type.id}`;
        if (!typeMap.has(typeID)) {
          typeMap.set(typeID, {
            id: typeID,
            children: [],
            hasChildren: true,
            isChildrenLoading: false,
            isExpanded: true,
            data: {
              id: type.id,
              parent: data.id,
              title: inwards ? type.inward : type.outward,
              name: data.name,
              summary: `${type.inward} <- ${type.outward}`,
              isType: true,
            },
          });
          ids.push(typeID);
        }

        const map = typeMap.get(typeID);
        if (inwardIssue) {
          const issueID = UUID();
          map.children.push(issueID);
          items.push({
            id: issueID,
            children: [],
            hasChildren: true,
            isChildrenLoading: false,
            isExpanded: false,
            data: formatIssueData(inwardIssue, typeID),
          });
        }
        if (outwardIssue) {
          const issueID = UUID(); //`${data.id}-${outwardIssue.id}`;
          map.children.push(issueID);
          items.push({
            id: issueID,
            children: [],
            hasChildren: true,
            isChildrenLoading: false,
            isExpanded: false,
            data: formatIssueData(outwardIssue, typeID),
          });
        }
      }
    }

    for (const [value] of typeMap) {
      items.push(value);
    }

    return {
      children: items,
      data: {
        id: data.id,
        children: ids,
        hasChildren: hasChildren,
        isChildrenLoading: false,
        isExpanded: true,
        data: formatIssueData(data),
        allData: data,
      },
    };
  };
  useEffect(() => {
    if (issueFields && issueFields.length > 0) {
      const fieldKeys = issueFields.map((field) => field.key);
      IssueLinkAPI(null, fieldKeys).then((data) => {
        console.log("with fields: !data!!!!!");
        console.log(data);
        const value = formatIssue(data, null, null);
        console.log("value!!!");
        console.log(value);
        root.items[data.id] = value.data;
        root.items["0"].children.push(data.id);
        for (const child of value.children) {
          root.items[child.id] = child;
        }
        setTree(mutateTree(root, "0", { isExpanded: true }));
        setIsFetched(true);
      });
    }
  }, [issueFields]);

  const SideIcon = ({ item, onExpand, onCollapse }) => {
    if (item.isChildrenLoading) {
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
          d<ChevronDownIcon label="" size={16} />
        </Button>
      ) : (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onExpand(item.id)}
        >
          r<ChevronRightIcon label="" size={16} />
        </Button>
      );
    }

    return <Box>asdf</Box>;
  };
  const getItemStyle = (depth) => {
    const style = {
      // width: "300px",
      margin: ".5em 0",
      display: "flex",
      marginLeft: "0px",
    };

    style["marginLeft"] = PADDING_LEVEL * depth + "px";

    return style;
  };

  const renderItem = ({ item, onExpand, onCollapse, provided, depth }) => (
    <div
      style={getItemStyle(depth)}
      ref={provided.innerRef}
      {...provided.dragHandleProps}
    >
      {/* {getIcon(item, onExpand, onCollapse)} */}
      <SideIcon
        item={item}
        onExpand={onExpand}
        onCollapse={onCollapse}
      ></SideIcon>
      {item.data && item.data.isType ? (
        <LinkTypeContainer>
          {item.data ? item.data.title : "No Name"}
        </LinkTypeContainer>
      ) : (
        <IssueCard
          issueData={item.allData ? item.allData : null}
          selectedIssueFields={selectedIssueFields}
          issueFields={issueFields}
        />
      )}
    </div>
  );
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
    } else if (item.hasChildren && item.children.length === 0) {
      IssueLinkAPI(item.data ? item.data.id : null).then((data) => {
        let parent = (item.data || {}).parent;
        const parentType = parent ? ntree.items[parent] : null;
        parent = parent
          ? ((ntree.items[parent] || {}).data || {}).parent
          : null;
        const parentIssue = parent ? ntree.items[parent] : null;

        const parentTypeID = ((parentType || {}).data || {}).id;
        const parentIssueID = ((parentIssue || {}).data || {}).id;

        const value = formatIssue(data, parentTypeID, parentIssueID);

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
            if (
              (issueTypes.length === 0 || issueTypes.includes(data.type.id)) &&
              (priorities.length === 0 || priorities.includes(data.priority.id))
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
        onExpand={onExpand}
        onCollapse={onCollapse}
        isDragEnabled={false}
      />
    </Container>
  );
};
