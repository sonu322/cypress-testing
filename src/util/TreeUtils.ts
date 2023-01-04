import { mutateTree } from "@atlaskit/tree";
import LXPAPI, {
  ID,
  Issue,
  IssueField,
  IssueLink,
  IssueTreeFilter,
  IssueWithLinkedIssues,
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
  private ROOT_ID = "0";
  private api: LXPAPI;

  constructor(api: LXPAPI) {
    this.api = api;
  }

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

  initTreeHook(
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError
  ) {
    setTree((tree) => {
      this.initTree(tree, filter, fields, setTree, handleError);
      return tree;
    });
  }

  cloneTree(tree) {
    return JSON.parse(JSON.stringify(tree));
  }

  async initTree(
    prevTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError
  ) {
    try {
      let tree = this.cloneTree(prevTree);
      const issue = await this.api.getIssueWithLinks(fields);
      let mainNode = this.createTreeNode(tree, "", issue, null, true);
      let nodeId = mainNode.id;
      // make actual root a child of fake(hidden) root node
      tree.items[this.ROOT_ID].children = [nodeId];
      await this.addChildren(nodeId, tree, fields, issue, filter);
      setTree(() => {
        return tree;
      });
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
    let result = [];
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

  async getChildren(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    mainNode: AtlasTreeNode,
    fields: IssueField[],
    issue?: IssueWithLinkedIssues
  ): Promise<AtlasTreeNode[]> {
    let prefix = mainNode.id;
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
      let linkedIssue = issueMap[link.issueId];
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
    let result = [];
    let types = Object.keys(typeMap);
    if (types.length) {
      for (const type of types) {
        const typeNode = this.createTypeNode(tree, prefix, type);
        typeNode.children = typeMap[type];
        result.push(typeNode);
      }
    }
    return result;
  }

  applyFilterHook(setTree, filter, fields): void {
    setTree((tree: AtlasTree) => {
      const firstNodeId = tree.items[this.ROOT_ID].children[0];
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
        return isPromise(result) ? tree : result;
      }
      return tree;
    });
  }

  async applyFilter(setTree, tree: AtlasTree, filter, fields, nodeId, isFirstCall: boolean): Promise<AtlasTree> {
    let node = tree.items[nodeId];
    tree = await this.addChildren(nodeId, tree, fields, node.data, filter);
    node = tree.items[nodeId];
    for (const typeNodeId of node.children) {
      // type nodes
      const typeNode = tree.items[typeNodeId];
      for (const childNodeId of typeNode.children) {
        const child = tree.items[childNodeId];
        if (child.hasChildrenLoaded) {
          await this.applyFilter(
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
      setTree(() => tree);
    }
    return tree;
  }

  updateTreeNode(setTree, nodeId, data): void {
    setTree((prevTree) => {
      const tree = mutateTree(prevTree, nodeId, data);
      return tree;
    });
  }

  async addChildren(nodeId, tree, fields, issue, filter): Promise<AtlasTree> {
    const mainNode = tree.items[nodeId];
    const children = await this.getChildren(
      tree,
      filter,
      mainNode,
      fields,
      issue
    );
    const childIds = children.map((item) => item.id);
    mainNode.children = childIds;
    mainNode.isExpanded = true;
    mainNode.isChildrenLoading = false;
    mainNode.hasChildrenLoaded = true;
    mainNode.hasChildren = childIds.length > 0;
    return tree;
  }

  expandTreeHook(
    nodeId: string,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError,
    clearAllErrors
  ): void {
    setTree((tree: AtlasTree) => {
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
  ): Promise<void> {
    const tree = this.cloneTree(prevTree);
    const item = tree.items[nodeId];
    // clear all errors
    clearAllErrors();
    this.updateTreeNode(setTree, nodeId, { isChildrenLoading: true });
    try {
      const issue = await this.api.getIssueWithLinks(
        fields,
        (item.data as IssueWithLinkedIssues).id
      );
      await this.addChildren(nodeId, tree, fields, issue, filter);
      setTree(() => tree);
    } catch (error) {
      console.error(error);
      this.updateTreeNode(setTree, nodeId, { isChildrenLoading: false });
      handleError(error);
    }
  }

  async expandTreeNodes(
    tree: AtlasTree,
    nodeIds: string[],
    filter: IssueTreeFilter,
    fields: IssueField[]
  ): Promise<AtlasTreeNode[]> {
    const issueIds = [];
    for (const nodeId of nodeIds) {
      const item = tree.items[nodeId];
      if (item.hasChildrenLoaded) {
        item.isExpanded = true;
      } else {
        issueIds.push((item.data as IssueWithLinkedIssues).id)
      }
    }
    const issueIdMap = {};
    if (issueIds.length > 0) {
      const issues = await this.api.getIssuesWithLinks(fields, issueIds);
      for (const issue of issues) {
        issueIdMap[issue.id] = issue;
      }
    }
    const nodes: AtlasTreeNode[] = [];
    for (const nodeId of nodeIds) {
      const item = tree.items[nodeId];
      if (!item.hasChildrenLoaded) {
        item.isExpanded = true;
        const issueId = (item.data as IssueWithLinkedIssues).id;
        await this.addChildren(nodeId, tree, fields, issueIdMap[issueId], filter);
      }
      nodes.push(item);
    }
    return nodes;
  }

  async expandAll(
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError,
    clearAllErrors,
    setIsExpandAllLoading
  ): Promise<void> {
    const expandNodes = async (tree: AtlasTree, nodeIds: string[], level: number): Promise<void> => {
      if (level >= 3) return;
      const nodes = await this.expandTreeNodes(tree, nodeIds, filter, fields);
      let children = [];
      for (const node of nodes) {
        for (const typeNodeId of node.children) {
          const typeNode = tree?.items[typeNodeId];
          typeNode.isExpanded = true;
          children = children.concat(typeNode.children);
        }
      }
      if (children.length > 0) {
        await expandNodes(tree, children, level + 1);
      }
    };

    const expandRootNodes = async (tree: AtlasTree): Promise<void> => {
      clearAllErrors();
      try {
        const rootNode = tree?.items[this.ROOT_ID];
        await expandNodes(tree, rootNode.children, 0);
        setIsExpandAllLoading(false);
        setTree(() => tree);
      } catch (err) {
        setIsExpandAllLoading(false);
        console.error(err);
        handleError(err);
      }
    };

    setTree((prevTree) => {
      const tree = this.cloneTree(prevTree);
      setIsExpandAllLoading(true);
      void expandRootNodes(tree);
      return prevTree;
    });
  }

  collapseAll(setTree): void {
    const collapseNode = (tree: AtlasTree, nodeId): void => {
      const node = tree?.items[nodeId];
      if (node !== undefined) {
        node.isExpanded = false;
        const children = node.children;
        if (children.length > 0) {
          for (const childNodeId of children) {
            collapseNode(tree, childNodeId);
          }
        }
      }
    };

    setTree((prevTree) => {
      const tree = this.cloneTree(prevTree);
      collapseNode(tree, tree.rootId);
      return tree;
    });
  }

  exportTree(tree: AtlasTree) {
    // TODO: make fields dynamic
    const root = tree.items[tree.rootId];
    const mainNodeId = root.children[0];

    const contents: any[] = [];

    const process = (item: AtlasTreeNode, indent) => {
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
  };
}
