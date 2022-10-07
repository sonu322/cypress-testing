import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Spinner from "@atlaskit/spinner";
import Button from "@atlaskit/button";
import { Item } from "@atlaskit/navigation-next";
import { colors } from "@atlaskit/theme";
import Lozenge from "@atlaskit/lozenge";
import { IssueLinkAPI } from "../api";
import { UUID, getStatusAppearance } from "../../util";
import Tree, { mutateTree } from "@atlaskit/tree";

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
const ItemWrapper = styled.div`
  display: flex;
  width: 270px;
`;

const IconContainer = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
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

const InnerElem = styled.div`
  display: flex;
`;

const TextContent = styled.span`
  margin-left: 4px;
  font-weight: 500;
  vertical-align: middle;
`;
const root = {
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
};

export const IssueTree = () => {
  const [tree, setTree] = useState(mutateTree(root, "0", { isExpanded: true }));
  const [isFetched, setIsFetched] = useState(false);

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
        const issueID = UUID(); //`${data.id}-${issue.id}`;
        subTasks.push(issueID);
        items.push({
          id: issueID,
          children: [],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: false,
          data: IssueTree.formatIssueData(issue, subTypeID),
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
          data: IssueTree.formatIssueData(parent, parentIssueLinkID),
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

    for (const { id, type, inwardIssue, outwardIssue } of data.fields
      .issuelinks) {
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
            data: IssueTree.formatIssueData(inwardIssue, typeID),
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
            data: IssueTree.formatIssueData(outwardIssue, typeID),
          });
        }
      }
    }

    for (const [key, value] of typeMap) {
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
        data: IssueTree.formatIssueData(data),
      },
    };
  };
  useEffect(() => {
    IssueLinkAPI.then((data) => {
      if (this._isMounted) {
        const value = IssueTree.formatIssue(data, null, null);
        this.root.items[data.id] = value.data;
        this.root.items["0"].children.push(data.id);
        for (const child of value.children) {
          this.root.items[child.id] = child;
        }
      }

      this.setState({
        tree: mutateTree(this.root, "0", { isExpanded: true }),
        fetched: true,
      });
    });
  }, []);
  return <div>issue tree</div>;
};
