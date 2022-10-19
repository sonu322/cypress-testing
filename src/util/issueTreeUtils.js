import { mutateTree } from "@atlaskit/tree";
import { IssueLinkAPI } from "../components/api";
import { csv, download, UUID } from "./index";
// constants
const SUB_TASKS = "Subtasks";
const PARENT = "Parent";
// root node
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

// maps card fields data and returns array of field ids
export const getFieldIds = (issueFields) => {
  const fieldIds = [];
  for (let field of issueFields.values()) {
    fieldIds.push(field.id);
  }
  return fieldIds;
};
// format issue data
export const formatIssueData = (data, parent) => {
  return {
    ...data,
    parent: parent,
    isType: false,
  };
};
// formats an issue
export const formatIssue = (data, parentTypeID, parentIssueID) => {
  let hasChildren = false;
  // holds all type ids for issue
  const typeIds = [];
  // holds data of types
  const typeMap = new Map();
  // holds all cards objects
  const items = [];

  // SETTING SUBTASK TYPE CARD
  const subTasks = [];
  // generate and id for type
  const subTypeID = UUID();
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
  // POPULATING SUBTASKS
  for (const issue of data.fields.subtasks) {
    if (issue.id !== parentIssueID) {
      // generate id for issue
      const issueID = UUID();
      // push id into subTasks
      subTasks.push(issueID);
      // push issue data object into items
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
    typeIds.push(subTypeID);
  }
  // POPUPULATING PARENT
  if (data.fields.parent) {
    const parentIssueTypeID = UUID();
    const parentIssueLinkID = UUID();
    const parent = data.fields.parent;
    if (parent.id !== parentIssueID) {
      typeMap.set(PARENT, {
        id: parentIssueTypeID,
        children: [parentIssueLinkID],
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
        id: parentIssueLinkID,
        children: [],
        hasChildren: true,
        isChildrenLoading: false,
        isExpanded: false,
        data: formatIssueData(parent, parentIssueTypeID),
      });

      typeIds.push(parentIssueTypeID);
    }
  }
  // POPULATING OTHER LINKED ISSUES
  const typeIDMap = new Map();
  const getTypeID = (id, isLinkInwards) => {
    const key = id + (isLinkInwards ? "-inwards" : "-outwards");
    if (!typeIDMap.has(key)) {
      typeIDMap.set(key, UUID());
    }
    return typeIDMap.get(key);
  };
  // loop through all linked issues
  for (const { type, inwardIssue, outwardIssue } of data.fields.issuelinks) {
    if (
      (inwardIssue && inwardIssue.id !== parentIssueID) ||
      (outwardIssue && outwardIssue.id !== parentIssueID)
    ) {
      hasChildren = true;
      // check if issue is linked inwards or outwards. ex: is caused by / causes
      const isLinkInwards = inwardIssue ? true : false;
      const typeID = getTypeID(type.id, isLinkInwards); //`${data.id}-${type.id}`;
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
            title: isLinkInwards ? type.inward : type.outward,
            name: data.name,
            summary: `${type.inward} <- ${type.outward}`,
            isType: true,
          },
        });
        typeIds.push(typeID);
      }

      const typeData = typeMap.get(typeID);
      const issue = inwardIssue ?? outwardIssue;

      const issueID = UUID();
      typeData.children.push(issueID);
      items.push({
        id: issueID,
        children: [],
        hasChildren: true,
        isChildrenLoading: false,
        isExpanded: false,
        data: formatIssueData(issue, typeID),
      });
    }
  }
  // push all types into items
  for (const [_key, value] of typeMap) {
    items.push(value);
  }

  return {
    children: items,
    data: {
      id: data.id,
      children: typeIds,
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
    Object.keys(tree.items).forEach((key) => {
      const item = JSON.parse(JSON.stringify(tree.items[key]));
      if (item.data) {
        const data = item.data;

        if (key == tree.rootId || rootChildren.includes(key)) {
          filteredTree.items[key] = item;
        } else {
          if (data.isType) {
            // executes is no link type is selected / 
            // current link type is present in selected link types / 
            // type is non-removable
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
  return filteredTree;
};


// populates initial tree by calling api and formatting data
export const populateInitialTree = (issueFields, setTree, handleError) => {
  const fieldIds = getFieldIds(issueFields);
  IssueLinkAPI(null, fieldIds) // fetches root issue
    .then((data) => {
      const { rootIssueData, relatedIssuesData } = data; // fetched data
      const value = formatIssue(rootIssueData, null, null);
      const newTree = { ...root };
      newTree.items[rootIssueData.id] = value.data;
      // make actual root a child of fake(hidden) root node
      newTree.items["0"].children.push(rootIssueData.id);
      for (const childIssue of value.children) {
        let childData = relatedIssuesData.issues.find(
          (issue) => issue.id == childIssue.data.id
        );
        if (childData) {
          // populate child issue with fetched information
          childIssue.data.fields = childData.fields;
        }
        // set issue in tree items
        newTree.items[childIssue.id] = childIssue;
      }
      // expand tree
      setTree(mutateTree(newTree, "0", { isExpanded: true }));
    })
    .catch((error) => handleError(error));
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

export const handleCollapse = (itemId, tree, setTree) => {
  setTree(
    mutateTree(tree, itemId, {
      isExpanded: false,
      isChildrenLoading: false,
    })
  );
};

export const handleExpand = (itemId, tree, setTree, issueFields) => {
  setTree(mutateTree(tree, itemId, { isChildrenLoading: true }));

  const newTree = { ...tree };
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
