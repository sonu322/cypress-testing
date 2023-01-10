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
import {
  AtlasTree,
  AtlasTreeNode,
  ButtonTypeTreeNode,
  LinkTypeTreeNode,
} from "../types/app";
import { isPromise } from "./common";
import {
  loadMoreOrphansButtonName,
  orphansMaxResults,
  orphansTreeBranchName,
} from "../constants/traceabilityReport";
import {
  buttonTypeTreeNodeName,
  linkTypeTreeNodeName,
} from "../constants/common";

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
        type: linkTypeTreeNodeName,
        title: "Fake Root Node",
      },
    },
  },
};

export default class TreeUtils {
  readonly ROOT_ID = "0";
  private readonly api: LXPAPI;

  constructor(api: LXPAPI) {
    this.api = api;
  }

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
      ]);

      const priorities = result[0];
      const issueTypes = result[1];
      const linkTypes = result[2];

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

  createTypeNode(tree, prefix: string, issueType: string): AtlasTreeNode {
    return this.createTreeNode(
      tree,
      prefix,
      {
        type: linkTypeTreeNodeName,
        id: issueType,
        title: issueType,
      },
      null,
      true,
      true
    );
  }

  createTreeNode(
    tree: AtlasTree,
    prefix: string,
    data: IssueWithLinkedIssues | Issue | LinkTypeTreeNode | ButtonTypeTreeNode,
    parentIssueId: ID,
    isExpanded = false,
    hasChildrenLoaded = false,
    hasChildren = true
  ): AtlasTreeNode {
    const node: AtlasTreeNode = {
      id: prefix + "/" + data.id,
      children: [],
      hasChildren,
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
    try {
      const tree = this.getRootTree();
      await this.initTree(tree, filter, fields, setTree, handleError);
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  }

  cloneTree(tree: AtlasTree): AtlasTree {
    console.log(tree);
    console.log({ ...tree });
    return { ...tree };
  }

  async initTree(
    prevTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError
  ): Promise<void> {
    try {
      const tree = this.cloneTree(prevTree);
      const issue = await this.api.getIssueWithLinks(fields);
      const mainNode = this.createTreeNode(tree, "", issue, null, true);
      const nodeId = mainNode.id;
      // make actual root a child of fake(hidden) root node
      tree.items[this.ROOT_ID].children = [nodeId];
      await this.addChildren(nodeId, tree, fields, issue, filter);
      setTree(tree);
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  }

  initMultiNodeTree(
    handleError,
    filteredIssues: IssueWithSortedLinks[]
  ): AtlasTree {
    try {
      const prevTree = this.getRootTree();
      const tree = this.cloneTree(prevTree);

      const filteredIssuesWithLinks: IssueWithLinkedIssues[] =
        filteredIssues.map((filteredIssue) => {
          let linkedIssues = [];
          Object.values(filteredIssue.sortedLinks).forEach((issuesOfType) => {
            linkedIssues = linkedIssues.concat(issuesOfType);
          });

          const issueWithLinkedIssues = {
            ...filteredIssue,
            linkedIssues,
          };
          delete issueWithLinkedIssues.sortedLinks;
          return issueWithLinkedIssues;
        });

      // filteredIssuesWithLinks = await Promise.all(allPromises);

      tree.items[this.ROOT_ID].children = [];
      filteredIssuesWithLinks.forEach((issueWithLinks) => {
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

      return tree;
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  }

  removeOrphansBranch(tree: AtlasTree): AtlasTree {
    let newTree = this.cloneTree(tree);
    const rootNode = tree.items[this.ROOT_ID];
    const orphansTreeBranchId = `/${orphansTreeBranchName}`;
    if (rootNode.children.includes(orphansTreeBranchId)) {
      const newChildren = rootNode.children.filter(
        (child) => child !== orphansTreeBranchId
      );
      newTree = mutateTree(tree, this.ROOT_ID, { children: newChildren });
    }
    return newTree;
  }

  addOrphansBranch(tree: AtlasTree): AtlasTree {
    let newTree = this.cloneTree(tree);
    const rootNode = tree.items[this.ROOT_ID];
    const orphansTreeBranchId = `/${orphansTreeBranchName}`;
    if (tree.items[orphansTreeBranchId] !== undefined) {
      const newChildren = [...rootNode.children];
      newChildren.unshift(orphansTreeBranchId);
      newTree = mutateTree(tree, this.ROOT_ID, { children: newChildren });
    }
    return newTree;
  }

  async handleLoadMoreOrphanIssues(
    jql: string,
    fields: IssueField[],
    start: number,
    setTree: React.Dispatch<React.SetStateAction<AtlasTree>>,
    handleError: (err: unknown) => void
  ): Promise<void> {
    try {
      setTree((tree) => {
        const loadMoreButtonNode =
          tree.items[`/${orphansTreeBranchName}/${loadMoreOrphansButtonName}`];
        const newButtonData: ButtonTypeTreeNode = {
          ...loadMoreButtonNode.data,
          isDataLoading: true,
        };
        let newTree = mutateTree(
          tree,
          `/${orphansTreeBranchName}/${loadMoreOrphansButtonName}`,
          {
            data: newButtonData,
          }
        );
        return newTree;
      });
      const searchResult = await this.api.searchOrphanIssues(
        jql,
        fields,
        start,
        orphansMaxResults
      );
      if (searchResult?.data !== undefined) {
        setTree((tree) => {
          const loadMoreButtonNode =
            tree.items[
              `/${orphansTreeBranchName}/${loadMoreOrphansButtonName}`
            ];

          const newButtonData: ButtonTypeTreeNode = {
            ...loadMoreButtonNode.data,
            startNextCallIndex:
              loadMoreButtonNode.data.startNextCallIndex + orphansMaxResults,
            isDataLoading: false,
          };
          let newTree = mutateTree(
            tree,
            `/${orphansTreeBranchName}/${loadMoreOrphansButtonName}`,
            {
              data: newButtonData,
            }
          );
          const orphanTypeNode = tree.items[`/${orphansTreeBranchName}`];
          const issues = searchResult.data;
          const newOrphanNodeIds = [];
          issues.forEach((issueWithLinks) => {
            const node = this.createTreeNode(
              newTree,
              orphanTypeNode.id,
              issueWithLinks,
              orphanTypeNode.id,
              false,
              false,
              false
            );
            const nodeId = node.id;
            newOrphanNodeIds.push(nodeId);
            // newTree.items[orphanTypeNode.id].children.push(nodeId);
          });

          const oldChildren = [...orphanTypeNode.children];
          const loadMoreButtonId = oldChildren.pop(); // removes button
          const newChildren = oldChildren.concat(newOrphanNodeIds);
          newChildren.push(loadMoreButtonId);
          newTree = mutateTree(newTree, `/${orphansTreeBranchName}`, {
            children: newChildren,
          });

          return newTree;
        });
      }
    } catch (error) {
      setTree((tree) => {
        const loadMoreButtonNode =
          tree.items[`/${orphansTreeBranchName}/${loadMoreOrphansButtonName}`];
        const newButtonData: ButtonTypeTreeNode = {
          ...loadMoreButtonNode.data,
          isDataLoading: false,
        };
        let newTree = mutateTree(
          tree,
          `/${orphansTreeBranchName}/${loadMoreOrphansButtonName}`,
          {
            data: newButtonData,
          }
        );
        return newTree;
      });
      handleError(error);
    }
  }

  initOrphanBranch(
    issues: Issue[],
    totalSearchResults: number,
    tree: AtlasTree,
    handleError: (err: unknown) => void
  ): AtlasTree {
    try {
      let newTree = this.cloneTree(tree);
      const orphanTypeNode = this.createTypeNode(
        newTree,
        "",
        orphansTreeBranchName
      );
      const loadMoreButtonNode = this.createTreeNode(
        newTree,
        `${orphanTypeNode.id}`,
        {
          id: loadMoreOrphansButtonName,
          title: loadMoreOrphansButtonName,
          startNextCallIndex: orphansMaxResults,
          totalSearchResults,
          type: buttonTypeTreeNodeName,
          isDataLoading: false,
        },
        orphanTypeNode.id,
        false,
        false,
        false
      );

      const orphanNodeIds = [];
      issues.forEach((issueWithLinks) => {
        const node = this.createTreeNode(
          newTree,
          orphanTypeNode.id,
          issueWithLinks,
          null,
          false,
          false,
          false
        );
        const nodeId = node.id;
        orphanNodeIds.push(nodeId);
      });
      orphanNodeIds.push(loadMoreButtonNode.id);
      newTree = mutateTree(newTree, orphanTypeNode.id, {
        children: orphanNodeIds,
      });

      const newChildren = newTree.items[this.ROOT_ID].children;
      newChildren.unshift(orphanTypeNode.id);
      newTree = mutateTree(newTree, this.ROOT_ID, { children: newChildren });
      return newTree;
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  }

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
    // TODO: use setState(func) to make the filter apply on to previous tree
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
    let newTree = this.cloneTree(tree);
    let firstNodeIds;
    if (newTree.items !== undefined) {
      firstNodeIds = newTree.items[this.ROOT_ID].children;
    }

    if (firstNodeIds !== undefined) {
      firstNodeIds.forEach((firstNodeId) => {
        const firstNode = tree.items[firstNodeId];
        if (
          firstNode.data.type !== buttonTypeTreeNodeName &&
          firstNode.data.linkedIssues !== undefined &&
          firstNode.data.linkedIssues.length > 0
        ) {
          newTree = this.applyMultiFilter(newTree, filter, fields, firstNodeId);
        }
      });
    }
    return newTree;
  }

  updateTreeNode(setTree, nodeId, data) {
    setTree((prevTree) => {
      const tree = mutateTree(prevTree, nodeId, data);
      return tree;
    });
  }

  async addChildren(nodeId, tree, fields, issue, filter): Promise<AtlasTree> {
    // TODO: use setState(func) to make the filter apply on to previous tree
    try {
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
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children");
    }
  }

  addMultiSyncChildren(nodeId, tree, fields, issue, filter): AtlasTree {
    try {
      const mainNode = tree.items[nodeId];
      const children = this.getMultiSyncChildren(tree, filter, mainNode, issue);
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
    try {
      const tree = this.cloneTree(prevTree);
      const item = tree.items[nodeId];
      // clear all errors
      clearAllErrors();
      let newTree = mutateTree(prevTree, nodeId, { isChildrenLoading: true });
      const otherNodeIds = Object.keys(tree.items).filter(
        (otherNodeId) => otherNodeId !== nodeId
      );
      otherNodeIds.forEach((otherNodeId) => {
        newTree = mutateTree(newTree, otherNodeId, {
          isTogglerDisabled: true,
        });
      });
      setTree(newTree);
      // this.updateTreeNode(setTree, nodeId, { isChildrenLoading: true });

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
        issueIds.push((item.data as IssueWithLinkedIssues).id);
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
        await this.addChildren(
          nodeId,
          tree,
          fields,
          issueIdMap[issueId],
          filter
        );
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
    const expandNodes = async (
      tree: AtlasTree,
      nodeIds: string[],
      level: number
    ): Promise<void> => {
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
        if ((dataObj as LinkTypeTreeNode).type === linkTypeTreeNodeName) {
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

  exportMultiTree(tree: AtlasTree): void {
    const root = tree.items[tree.rootId];

    const contents: any[] = [];

    const process = (item: AtlasTreeNode, indent) => {
      if (!item || item.data?.type === buttonTypeTreeNodeName) {
        return;
      }
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
        if ((dataObj as LinkTypeTreeNode).type === linkTypeTreeNodeName) {
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
      if (item.hasChildren && item.isExpanded) {
        const nextIndent = indent + 1;
        item.children.forEach((key) => {
          process(tree.items[key], nextIndent);
        });
      }
    };

    // process(tree.items[mainNodeId], 1);
    root.children.forEach((mainNodeId) => {
      process(tree.items[mainNodeId], 1);
    });
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
