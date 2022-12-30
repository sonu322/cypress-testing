import { mutateTree } from "@atlaskit/tree";
import LXPAPI, {
  ID,
  Issue,
  IssueField,
  IssueLink,
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
  IssueWithLinkedIssues,
  IssueWithSortedLinks,
} from "../types/api";
import { csv, download } from "./index";
import { AtlasTree, AtlasTreeNode, LinkTypeTreeNode } from "../types/app";
import { isPromise } from "./common";

// root node
const root: AtlasTree = {
  rootId: "0",
  items: {
    0: {
      id: "0",
      children: [],
      hasChildren: true,
      hasChildrenLoaded: false,
      isExpanded: true,
      isChildrenLoading: false,
      parentIssueId: null,
      data: {
        id: "0",
        isType: true,
        title: "Fake Root Node",
      },
    },
  },
};



export default class TreeUtils {
  private readonly ROOT_ID = "0";
  private readonly api: LXPAPI;

  constructor(api: LXPAPI) {
    this.api = api;
  }

  createIssueTreeFilter = (
    priorities: IssuePriority[],
    issueTypes: IssueType[],
    linkTypes: IssueLinkType[]
  ): IssueTreeFilter => {
    const filterObj = {
      priorities: priorities.map((option) => option.id),
      issueTypes: issueTypes.map((option) => option.id),
      linkTypes: linkTypes.map((option) => option.id),
    };
    return filterObj;
  };

  loadToolbarData = async (
    updateSelectedIssueFieldIds: (selectedIssueFieldIds: string[]) => void,
    updateIssueFields: (issueFields: IssueField[]) => void,
    updateIsLoading: (isLoading: boolean) => void,
    handleError: (error: unknown) => void
  ): Promise<void> => {
    try {
      const fields = await this.api.getIssueFields();
      const selectedFieldIds = fields.map((field) => field.id);
      updateSelectedIssueFieldIds(selectedFieldIds);
      updateIssueFields(fields);
      updateIsLoading(false);
    } catch (error) {
      updateIsLoading(false);
      handleError(error);
    }
  };

  loadTreeFilterDropdownsData = async (
    updateFilter: (filter: {
      priorities: string[];
      issueTypes: string[];
      linkTypes: string[];
    }) => void,
    updateOptions: (options: {
      priorities: IssuePriority[];
      issueTypes: IssueType[];
      linkTypes: IssueLinkType[];
    }) => void,
    updateIsLoading: (isLoading: boolean) => void,
    handleError: (error: unknown) => void
  ): Promise<void> => {
    try {
      const result = await Promise.all([
        this.api.getPriorities(),
        this.api.getIssueTypes(),
        this.api.getIssueLinkTypes(),
        // this.api.getIssueFields(),
      ]);

      const priorities = result[0];
      const issueTypes = result[1];
      const linkTypes = result[2];
      // const fields = result[3];

      const filterObj = {
        priorities: priorities.map((option) => option.id),
        issueTypes: issueTypes.map((option) => option.id),
        linkTypes: linkTypes.map((option) => option.id),
      };
      updateFilter(filterObj);
      updateOptions({ priorities, issueTypes, linkTypes });
      updateIsLoading(false);
    } catch (error) {
      updateIsLoading(false);
      handleError(error);
    }
  };

  getRootTree(): AtlasTree {
    return root;
  }

  createTypeNode(tree, prefix: string, issueType: string) {
    return this.createTreeNode(
      tree,
      prefix,
      { isType: true, id: issueType, title: issueType },
      null,
      true,
      true
    );
  }

  createTreeNode(
    tree: AtlasTree,
    prefix: string,
    data: IssueWithLinkedIssues | Issue | LinkTypeTreeNode,
    parentIssueId: ID,
    isExpanded = false,
    hasChildrenLoaded = false
  ) {
    console.log("TREE NODE DATA", data);
    const node: AtlasTreeNode = {
      id: prefix + "/" + data.id,
      children: [],
      hasChildren: true,
      hasChildrenLoaded,
      isExpanded,
      isChildrenLoading: false,
      parentIssueId,
      data,
    };
    tree.items[node.id] = node;
    return node;
  }

  async initTreeHook(
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError
  ): Promise<void> {
    console.log("init tree hook called");
    try {
      const tree = this.getRootTree();
      await this.initTree(tree, filter, fields, setTree, handleError);
      // setTree(newTree);
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  }

  cloneTree(tree): any {
    return JSON.parse(JSON.stringify(tree));
  }

  async initTree(
    prevTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError
  ): Promise<void> {
    console.log("init tree called");
    try {
      const tree = this.cloneTree(prevTree);
      const issue = await this.api.getIssueWithLinks(fields);
      const mainNode = this.createTreeNode(tree, "", issue, null, true);
      const nodeId = mainNode.id;
      // make actual root a child of fake(hidden) root node
      tree.items[this.ROOT_ID].children = [nodeId];
      await this.addChildren(nodeId, tree, fields, issue, filter);
      console.log("TREE FROM INIT TREE", tree);
      setTree(tree);
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  }

  async initMultiNodeTree(
    // prevTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    handleError,
    filteredIssues: IssueWithSortedLinks[]
  ): Promise<AtlasTree> {
    console.log("multi init tree called");
    console.log(fields);
    try {
      const prevTree = this.getRootTree();
      const tree = this.cloneTree(prevTree);
      const allPromises = filteredIssues.map(async (issue) => {
        console.log("FEILDS FROM MULTI INIT TREE", fields);
        return await this.api.getIssueWithLinks(fields, issue.id);
      });

      const result = await Promise.all(allPromises);
      console.log("CALLING ALL ISSUE WITH LINKS", result);
      tree.items[this.ROOT_ID].children = [];
      result.forEach((issueWithLinks) => {
        const node = this.createTreeNode(
          tree,
          "",
          issueWithLinks,
          null,
          false,
          false
        );
        const nodeId = node.id;
        tree.items[this.ROOT_ID].children.push(nodeId);
      });
      console.log("TREE FROM MULTI INIT TREE", tree);
      return tree;
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  }

  // Tree filter
  _shouldIncludeNode(
    mainIssue: Issue,
    linkedIssue: Issue,
    issueLink: IssueLink,
    filter: IssueTreeFilter,
    parentIssueId: ID
  ): boolean {
    console.log("called _shouldIncludeNode");
    console.log(mainIssue, linkedIssue, issueLink, filter, parentIssueId);
    console.log(
      "filter.issueTypes.includes(linkedIssue.type?.id)",
      filter.issueTypes.includes(linkedIssue.type?.id)
    );
    if (
      filter.issueTypes.length > 0 &&
      !filter.issueTypes.includes(linkedIssue.type?.id)
    ) {
      return false;
    } else if (
      filter.linkTypes.length > 0 &&
      !filter.linkTypes.includes(issueLink.linkTypeId)
    ) {
      return false;
    } else if (
      filter.priorities.length > 0 &&
      !filter.priorities.includes(linkedIssue.priority?.id)
    ) {
      return false;
    } else if (parentIssueId && parentIssueId === linkedIssue.id) {
      return false;
    }
    return true;
  }

  filterLinks(
    issue: IssueWithLinkedIssues,
    filter: IssueTreeFilter,
    mainNode: AtlasTreeNode,
    issueMap: any
  ): IssueLink[] {
    console.log("called filter links for issue", issue, filter, mainNode);
    const result = [];
    for (const link of issue.links) {
      const linkedIssue = issueMap[link.issueId];
      if (
        this._shouldIncludeNode(
          issue,
          linkedIssue,
          link,
          filter,
          mainNode.parentIssueId
        )
      ) {
        result.push(link);
      }
    }
    return result;
  }

  getMultiSyncChildren(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    mainNode: AtlasTreeNode,
    issue: IssueWithLinkedIssues
  ): AtlasTreeNode[] {
    const prefix = mainNode.id;

    const typeMap = {};
    const issueMap = {};
    issue.linkedIssues.forEach((linkedIssue: Issue) => {
      issueMap[linkedIssue.id] = linkedIssue;
    });
    const filteredLinks = this.filterLinks(issue, filter, mainNode, issueMap);

    for (const link of filteredLinks) {
      const linkedIssue = issueMap[link.issueId];
      const node = this.createTreeNode(
        tree,
        prefix + "/" + link.name,
        linkedIssue,
        issue.id
      );
      if (typeMap[link.name] === undefined) {
        typeMap[link.name] = [];
      }
      typeMap[link.name].push(node.id);
    }
    const result = [];
    const types = Object.keys(typeMap);
    if (types.length > 0) {
      for (const type of types) {
        const typeNode = this.createTypeNode(tree, prefix, type);
        typeNode.children = typeMap[type];
        result.push(typeNode);
      }
    }
    return result;
  }

  async getChildren(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    mainNode: AtlasTreeNode,
    fields: IssueField[],
    issue?: IssueWithLinkedIssues
  ): Promise<AtlasTreeNode[]> {
    const prefix = mainNode.id;
    issue =
      issue ||
      (await this.api.getIssueWithLinks(
        fields,
        (mainNode.data as IssueWithLinkedIssues).id
      ));

    const typeMap = {};
    const issueMap = {};
    issue.linkedIssues.forEach((linkedIssue: Issue) => {
      issueMap[linkedIssue.id] = linkedIssue;
    });
    const filteredLinks = this.filterLinks(issue, filter, mainNode, issueMap);

    for (const link of filteredLinks) {
      const linkedIssue = issueMap[link.issueId];
      const node = this.createTreeNode(
        tree,
        prefix + "/" + link.name,
        linkedIssue,
        issue.id
      );
      if (typeMap[link.name] === undefined) {
        typeMap[link.name] = [];
      }
      typeMap[link.name].push(node.id);
    }
    const result = [];
    const types = Object.keys(typeMap);
    if (types.length > 0) {
      for (const type of types) {
        const typeNode = this.createTypeNode(tree, prefix, type);
        typeNode.children = typeMap[type];
        result.push(typeNode);
      }
    }
    return result;
  }

  applyFilterHook(tree, setTree, filter, fields) {
    console.log("from apply filter hook");
    console.log(tree);
    let firstNodeId;
    if (tree.items !== undefined) {
      firstNodeId = tree.items[this.ROOT_ID].children[0];
    }
    if (firstNodeId !== undefined) {
      const newTree = this.cloneTree(tree);
      const result = this.applyFilter(
        setTree,
        newTree,
        filter,
        fields,
        firstNodeId,
        true
      );
    }
  }

  async applyFilter(
    setTree,
    tree,
    filter,
    fields,
    nodeId,
    isFirstCall
  ): Promise<any> {
    let node = tree.items[nodeId];
    tree = await this.addChildren(nodeId, tree, fields, node.data, filter);
    node = tree.items[nodeId];
    for (const typeNodeId of node.children) {
      // type nodes
      const typeNode = tree.items[typeNodeId];
      for (const childNodeId of typeNode.children) {
        const child = tree.items[childNodeId];
        if (child.hasChildrenLoaded) {
          tree = await this.applyFilter(
            setTree,
            tree,
            filter,
            fields,
            child.id,
            false
          );
        }
      }
    }
    if (isFirstCall) {
      setTree(tree);
    }
    return tree;
  }

  applyMultiFilter(tree, filter, fields, nodeId): AtlasTree {
    let node = tree.items[nodeId];
    tree = this.addMultiSyncChildren(nodeId, tree, fields, node.data, filter);
    node = tree.items[nodeId];
    for (const typeNodeId of node.children) {
      // type nodes
      const typeNode = tree.items[typeNodeId];
      for (const childNodeId of typeNode.children) {
        const child = tree.items[childNodeId];
        if (child.hasChildrenLoaded) {
          tree = this.applyMultiFilter(tree, filter, fields, child.id);
        }
      }
    }
    return tree;
  }

  applyMultiNodeTreeFilter(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    fields: IssueField[]
  ): AtlasTree {
    console.log("from apply filter hook");
    console.log(tree);
    let newTree = this.cloneTree(tree);
    let firstNodeIds;
    if (newTree.items !== undefined) {
      firstNodeIds = newTree.items[this.ROOT_ID].children;
    }

    if (firstNodeIds !== undefined) {
      firstNodeIds.forEach((firstNodeId) => {
        newTree = this.applyMultiFilter(newTree, filter, fields, firstNodeId);
      });
    }
    console.log("new tree at end");
    console.log(newTree);
    return newTree;
  }

  updateTreeNode(setTree, nodeId, data) {
    setTree((prevTree) => {
      const tree = mutateTree(prevTree, nodeId, data);
      return tree;
    });
  }

  async addChildren(nodeId, tree, fields, issue, filter): Promise<void> {
    try {
      const mainNode = tree.items[nodeId];
      console.log(mainNode);
      const children = await this.getChildren(
        tree,
        filter,
        mainNode,
        fields,
        issue
      );
      console.log(children);
      const childIds = children.map((item) => item.id);
      mainNode.children = childIds;
      mainNode.isExpanded = true;
      mainNode.isChildrenLoading = false;
      mainNode.hasChildrenLoaded = true;
      mainNode.hasChildren = childIds.length > 0;
      return tree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children");
    }
  }

  addMultiSyncChildren(nodeId, tree, fields, issue, filter): AtlasTree {
    try {
      const mainNode = tree.items[nodeId];
      console.log(mainNode);
      const children = this.getMultiSyncChildren(tree, filter, mainNode, issue);
      console.log(children);
      const childIds = children.map((item) => item.id);
      mainNode.children = childIds;
      mainNode.isExpanded = true;
      mainNode.isChildrenLoading = false;
      mainNode.hasChildrenLoaded = true;
      mainNode.hasChildren = childIds.length > 0;
      console.log("TREE RETURNED BY ALLMULTISYNC CHILDREN!!!!!!!");
      console.log(tree);
      return tree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children");
    }
  }

  expandTreeHook(
    nodeId: string,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError,
    clearAllErrors
  ) {
    setTree((tree) => {
      const item = tree.items[nodeId];
      if (item.hasChildrenLoaded) {
        return mutateTree(tree, nodeId, { isExpanded: true });
      }
      const result = this.expandTree(
        tree,
        nodeId,
        filter,
        fields,
        setTree,
        handleError,
        clearAllErrors
      );
      return isPromise(result) ? tree : result;
    });
  }

  async expandTree(
    prevTree: AtlasTree,
    nodeId: string,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError,
    clearAllErrors
  ) {
    try {
      const tree = this.cloneTree(prevTree);
      const item = tree.items[nodeId];
      // clear all errors
      clearAllErrors();
      this.updateTreeNode(setTree, nodeId, { isChildrenLoading: true });

      const issue = await this.api.getIssueWithLinks(
        fields,
        (item.data as IssueWithLinkedIssues).id
      );
      await this.addChildren(nodeId, tree, fields, issue, filter);
      setTree(tree);
    } catch (error) {
      console.error(error);
      this.updateTreeNode(setTree, nodeId, { isChildrenLoading: false });
      handleError(error);
    }
  }

  exportTree(tree: AtlasTree) {
    // TODO: make fields dynamic
    const root = tree.items[tree.rootId];
    const mainNodeId = root.children[0];

    const contents: any[] = [];

    const process = (item: AtlasTreeNode, indent) => {
      if (!item) return;
      const content = {
        indent,
        key: "",
        link: "",
        summary: "",
        type: "",
        status: "",
        priority: "",
      };

      if (item.data) {
        const dataObj = item.data;
        if ((dataObj as LinkTypeTreeNode).isType) {
          content.link = (dataObj as LinkTypeTreeNode).title;
        } else {
          const data = dataObj as IssueWithLinkedIssues;
          content.key = data.issueKey;
          content.summary = data.summary;
          content.type = data.type.name;
          content.status = data.status.name;
          content.priority = data.priority.name;
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

    process(tree.items[mainNodeId], 1);
    download("csv", csv(contents, true));
  }

  collapseTreeHook(nodeId, setTree) {
    setTree((tree) => {
      return this.collapseTree(tree, nodeId, setTree);
    });
  }

  collapseTree(tree, nodeId, setTree) {
    return mutateTree(tree, nodeId, {
      isExpanded: false,
      isChildrenLoading: false,
    });
  }

  findJiraFields(fieldMap, selectedFieldIds: string[]): IssueField[] {
    const result = [];
    for (const fieldId of selectedFieldIds) {
      result.push(fieldMap[fieldId] as IssueField);
    }
    return result;
  }
}
