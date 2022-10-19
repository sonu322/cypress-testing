import { mutateTree } from "@atlaskit/tree";
import { csv, download, UUID } from "./index";
const SUB_TASKS = "Subtasks";
const PARENT = "Parent";
export const getFieldIds = (issueFields) => {
  const fieldIds = [];
  for (let field of issueFields.values()) {
    fieldIds.push(field.id);
  }
  return fieldIds;
};
export const formatIssueData = (data, parent) => {
  return {
    ...data,
    // title: data.key,
    // id: data.id,
    parent: parent,
    // summary: data.fields.summary,
    // type: data.fields.issuetype,
    // priority: data.fields.priority,
    // status: data.fields.status,
    isType: false,
    // allData: data,
  };
};
export const formatIssue = (data, parentTypeID, parentIssueID) => {
  console.log("format issue called");
  console.log(data);
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
        const issueID = UUID(); //`${data.id}-${inwardIssue.id}`;
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

  for (const [_key, value] of typeMap) {
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
    },
  };
};

export const filterTree = (filter, tree) => {
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
  if (filter && tree) {
    const { linkTypes, issueTypes, priorities } = filter;
    const root = tree.items[tree.rootId];
    const rootChildren = root.children;
    const keys = Object.keys(tree.items);
    keys.forEach((key) => {
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
    let filteredKeys = Object.keys(filteredTree.items);
    filteredKeys.forEach((key) => {
      const item = filteredTree.items[key];
      item.children = item.children.filter((i) => filteredKeys.includes(i));
      if (item.children.length === 0 && item.isExpanded) {
        item.hasChildren = false;
      }
    });
  }
  return filteredTree;
};

export const exportTree = (tree) => {
  const root = tree.items[tree.rootId];
  const rootChildren = root.children;

  const contents = [];

  const process = (item, indent) => {
    if (!item) return;
    const content = {
      indent: indent,
      key: "",
      link: "",
      summary: "",
      type: "",
      status: "",
      priority: "",
    };

    if (item.data) {
      const data = item.data;
      if (data.isType) {
        content.link = data.title;
      } else {
        // TODO: make fields dynamic
        content.key = data.key;
        content.summary = data.fields.summary;
        content.type = data.fields.issuetype.name;
        content.status = data.fields.status.name;
        content.priority = data.fields.priority.name;
      }
    }

    contents.push(content);
    if (item.hasChildren) {
      const nextIndent = indent + 1;
      item.children.forEach((key) => {
        process(tree.items[key], nextIndent);
      });
    }
  };

  process(tree.items[rootChildren[0]], 1);
  download("csv", csv(contents, true));

  // return contents;
};
