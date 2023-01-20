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
  emptyTreeFilter,
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
    return JSON.parse(JSON.stringify(tree));
    // console.log("clone tree called");
    // const prevTree = { ...tree };
    // const rootNode = prevTree.items[this.ROOT_ID];
    // const newChildren = [...rootNode.children];
    // console.log(rootNode);
    // const newRootNode = {
    //   ...rootNode,
    //   data: { ...rootNode.data },
    //   children: newChildren,
    // };
    // const newTree = mutateTree(prevTree, this.ROOT_ID, newRootNode);

    // return newTree;
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

  getChildren(
    tree: AtlasTree,
    mainNode: AtlasTreeNode,
    fields: IssueField[],
    filter?: IssueTreeFilter,
    issue?: IssueWithLinkedIssues
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

  getChildrenNew(
    tree: AtlasTree,
    mainNode: AtlasTreeNode
    // issue: IssueWithLinkedIssues
  ): AtlasTreeNode[] {
    const prefix = mainNode.id;

    const typeMap = {};
    const issueMap: Map<string, Issue> = {};
    console.log("main node", mainNode);
    console.log("tree", tree);
    const issue = mainNode.data;
    issue.linkedIssues.forEach((linkedIssue: Issue) => {
      issueMap[linkedIssue.id] = linkedIssue;
    });
    console.log("issue map", issueMap);
    const issueLinks = mainNode?.data?.links;

    for (const link of issueLinks) {
      const linkedIssue: Issue = issueMap[link.issueId];
      const foundNodeId = Object.keys(tree.items).find((nodeId) => {
        return nodeId === prefix + "/" + link.name + "/" + linkedIssue.id;
      });
      let node: AtlasTreeNode;
      if (foundNodeId !== undefined) {
        console.log("tree", tree);
        console.log(
          "found node id",
          foundNodeId,
          prefix + "/" + link.name + linkedIssue.id
        );
        node = tree.items[foundNodeId];
        console.log("found node", node);
      } else {
        node = this.createTreeNode(
          tree,
          prefix + "/" + link.name,
          linkedIssue,
          issue.id
        );
      }
      if (typeMap[link.name] === undefined) {
        typeMap[link.name] = [];
      }
      if (node !== undefined) {
        typeMap[link.name].push(node?.id);
      } else {
        throw new Error("Error occured while adding children");
      }
    }
    const result: AtlasTreeNode[] = [];
    const types = Object.keys(typeMap);
    if (types.length > 0) {
      for (const type of types) {
        // const typeNode = this.createTypeNode(tree, prefix, type);
        let typeNode: AtlasTreeNode;
        const typeNodeId = Object.keys(tree.items).find(
          (nodeId) => nodeId === prefix + "/" + type
        );
        if (typeNodeId !== undefined) {
          console.log(typeNodeId, prefix + "/" + type, tree);
          typeNode = tree.items[typeNodeId];
        } else {
          typeNode = this.createTypeNode(tree, prefix, type);
        }
        if (typeNode !== undefined) {
          typeNode.children = typeMap[type];
          result.push(typeNode);
        } else {
          throw new Error("Error occured while adding children");
        }
      }
    }
    return result;
  }

  applyFilterHook(tree: AtlasTree, filter, fields): AtlasTree {
    console.log("filter", filter);
    // TODO: use setState(func) to make the filter apply on to previous tree
    let firstNodeId;
    if (tree.items !== undefined) {
      firstNodeId = tree.items[this.ROOT_ID].children[0];
    }
    if (firstNodeId !== undefined) {
      const node = tree.items[firstNodeId];
      if (node.hasChildrenLoaded) {
        console.log("children are loaded");
        const newTree = this.cloneTree(tree);
        const result = this.applyFilterNew(
          newTree,
          filter,
          fields,
          firstNodeId
        );
        return result;
      }
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

  applyFilterNew(tree, filter, fields, nodeId): AtlasTree {
    try {
      console.log("filter tree new called", nodeId);
      console.log(tree.items[nodeId]);
      const node = tree.items[nodeId];
      // tree = this.addChildrenNew(nodeId, tree, filter); // filters
      tree = this.filterNodeChildren(nodeId, tree, filter);
      for (const typeNodeId of node.children) {
        // type nodes
        const typeNode = tree.items[typeNodeId];
        for (const childNodeId of typeNode.children) {
          const child = tree.items[childNodeId];
          if (child.hasChildrenLoaded) {
            tree = this.applyFilterNew(tree, filter, fields, child.id);
          }
        }
      }
      return tree;
    } catch (e) {
      console.log("e from apply filter new");
      console.log(e);
    }
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

  expandSingleNode(nodeId: string, tree: AtlasTree): AtlasTree {
    const expandedNodeTree = mutateTree(tree, nodeId, { isExpanded: true });
    return expandedNodeTree;
  }

  async addChildren(
    nodeId,
    tree,
    fields,
    issue,
    filter = undefined
  ): Promise<AtlasTree> {
    // TODO: use setState(func) to make the filter apply on to previous tree
    try {
      const mainNode = tree.items[nodeId];
      const children = await this.getChildren(
        tree,
        mainNode,
        fields,
        filter,
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

  addChildrenNew(nodeId, tree): AtlasTree {
    try {
      const mainNode = tree.items[nodeId];
      console.log(mainNode);
      const children = this.getChildrenNew(tree, mainNode);
      const childIds = children.map((item) => item.id);
      const newTree = mutateTree(tree, mainNode.id, {
        children: childIds,
        hasChildren: childIds.length > 0,
        hasChildrenLoaded: true,
      });
      return newTree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children for issue");
    }
  }

  filterNodeChildren(
    nodeId: string,
    tree: AtlasTree,
    filter: IssueTreeFilter
  ): AtlasTree {
    try {
      const mainNode = tree.items[nodeId];
      const prefix = mainNode.id;
      console.log(mainNode, "from filter node children");
      // const children = this.getChildrenNew(tree, filter, mainNode);
      // const childIds = children.map((item) => item.id);
      const issue = mainNode.data;
      const issueMap: Map<string, IssueWithLinkedIssues> = new Map();
      const typeMap: Map<string, string> = new Map();
      issue.linkedIssues?.forEach((linkedIssue: Issue) => {
        issueMap[linkedIssue.id] = linkedIssue;
      });
      const filteredLinks = this.filterLinks(issue, filter, mainNode, issueMap);

      for (const link of filteredLinks) {
        const linkedIssue: Issue = issueMap[link.issueId];
        const foundNodeId = Object.keys(tree.items).find((nodeId) => {
          return nodeId === prefix + "/" + link.name + "/" + linkedIssue.id;
        });
        let node: AtlasTreeNode;
        if (foundNodeId !== undefined) {
          console.log("tree", tree);
          console.log(
            "found node id",
            foundNodeId,
            prefix + "/" + link.name + linkedIssue.id
          );
          node = tree.items[foundNodeId];
          console.log("found node", node);
        } else {
          throw new Error("could not filter");
        }
        if (typeMap[link.name] === undefined) {
          typeMap[link.name] = [];
        }
        if (node !== undefined) {
          typeMap[link.name].push(node?.id);
        } else {
          throw new Error("Error occured while adding children");
        }
      }

      const children: AtlasTreeNode[] = [];
      const types = Object.keys(typeMap);
      if (types.length > 0) {
        for (const type of types) {
          let typeNode: AtlasTreeNode;
          const typeNodeId = Object.keys(tree.items).find(
            (nodeId) => nodeId === prefix + "/" + type
          );
          if (typeNodeId !== undefined) {
            console.log(typeNodeId, prefix + "/" + type, tree);
            typeNode = tree.items[typeNodeId];
          } else {
            throw new Error("Error occured while adding children");
          }
          if (typeNode !== undefined) {
            typeNode.children = typeMap[type];
            children.push(typeNode);
          } else {
            throw new Error("Error occured while adding children");
          }
        }
      }

      const childIds = children.map((item) => item.id);
      const newTree = mutateTree(tree, mainNode.id, {
        children: childIds,
        hasChildren: childIds.length > 0,
      });

      return newTree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children for issue");
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
      // mainNode.hasChildrenLoaded = true;
      mainNode.hasChildren = childIds.length > 0;
      return tree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children");
    }
  }

  // expandTreeHook(
  //   nodeId: string,
  //   filter: IssueTreeFilter,
  //   fields: IssueField[],
  //   setTree: React.Dispatch<React.SetStateAction<AtlasTree>>,
  //   handleError: (err: unknown) => void,
  //   clearAllErrors: () => void
  // ): void {
  //   console.log("from expand", nodeId);

  //   setTree(() => {
  //     const result = this.expandTree(
  //       nodeId,
  //       filter,
  //       fields,
  //       setTree,
  //       handleError,
  //       clearAllErrors
  //     );
  //     return isPromise(result) ? tree : result;
  //   });
  // }

  async expandTree(
    nodeId: string,
    issueId: string,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree: React.Dispatch<React.SetStateAction<AtlasTree>>,
    handleError: (err: unknown) => void,
    clearAllErrors: () => void
  ): Promise<void> {
    try {
      console.log("calleld expand tree", nodeId);
      clearAllErrors();
      setTree((prevTree) => {
        const item = prevTree.items[nodeId];
        console.log("item", item);
        if (item.hasChildrenLoaded) {
          return mutateTree(prevTree, nodeId, { isExpanded: true });
        }
        let newTree = mutateTree(prevTree, nodeId, { isChildrenLoading: true });
        const otherNodeIds = Object.keys(prevTree.items).filter(
          (otherNodeId) => otherNodeId !== nodeId
        );
        otherNodeIds.forEach((otherNodeId) => {
          newTree = mutateTree(newTree, otherNodeId, {
            isTogglerDisabled: true,
          });
        });
        console.log("if link type, just expand it and filter");
        return newTree;
      });

      const issue = await this.api.getIssueWithLinks(fields, issueId);

      if (issue !== undefined) {
        console.log("issue", issue);
        setTree((prevTree) => {
          const populatedIssueWithLinksTree = mutateTree(prevTree, nodeId, {
            data: issue,
          });
          const treeWithAddedChildren = this.addChildrenNew(
            nodeId,
            populatedIssueWithLinksTree
          );
          let loadingResetTree = mutateTree(treeWithAddedChildren, nodeId, {
            isExpanded: true,
            hasChildrenLoaded: true,
            isChildrenLoading: false, // TODO: reset loading
          });
          const otherNodeIds = Object.keys(treeWithAddedChildren.items).filter(
            (otherNodeId) => otherNodeId !== nodeId
          );
          otherNodeIds.forEach((otherNodeId) => {
            loadingResetTree = mutateTree(loadingResetTree, otherNodeId, {
              isTogglerDisabled: false,
            });
          });

          console.log("populatedIssueWithLinksTree", loadingResetTree);
          if (loadingResetTree !== undefined) {
            console.log("loading reset tree", loadingResetTree);
            const filteredTree = this.applyFilterHook(
              loadingResetTree,
              filter,
              fields
            );
            console.log("filteredTree", filteredTree);
            return filteredTree;
          }
          return prevTree;
        });
      }
      // const tree = this.cloneTree(prevTree);
      // const item = tree.items[nodeId];
      // clear all errors

      // this.updateTreeNode(setTree, nodeId, { isChildrenLoading: true });

      // const issue = await this.api.getIssueWithLinks(
      //   fields,
      //   (item.data as IssueWithLinkedIssues).id
      // );
      // await this.addChildren(nodeId, tree, fields, issue, filter);
    } catch (error) {
      console.error(error);
      setTree((prevTree) =>
        mutateTree(prevTree, nodeId, { isChildrenLoading: false })
      );
      handleError(error);
    }
  }

  async expandTreeNodes(
    prevTree: AtlasTree,
    nodeIds: string[],
    filter: IssueTreeFilter,
    fields: IssueField[]
  ): Promise<AtlasTreeNode[]> {
    console.log("caleld expnd tree nodes");
    try {
      let tree = prevTree;
      const issueIds = [];
      for (const nodeId of nodeIds) {
        const item = tree.items[nodeId];
        if (item.hasChildrenLoaded) {
          tree = mutateTree(tree, nodeId, {
            isExpanded: true,
          });
          console.log("tree", tree);
          // item.isExpanded = true;
        } else {
          issueIds.push((item.data as IssueWithLinkedIssues).id);
        }
      }
      const issueIdMap = {};
      if (issueIds.length > 0) {
        const issues = await this.api.getIssuesWithLinks(fields, issueIds);
        console.log(issues);
        for (const issue of issues) {
          issueIdMap[issue.id] = issue;
          const items = Object.values(tree.items).filter((item) => {
            return item.data.id === issue.id;
          });
          items.forEach((item) => {
            tree = mutateTree(tree, item, { data: issue });
          });
        }
        if (issues?.length > 0) {
          const nodes: AtlasTreeNode[] = [];
          for (const nodeId of nodeIds) {
            const item = tree.items[nodeId];
            if (!item.hasChildrenLoaded) {
              item.isExpanded = true;
              // const issueId = (item.data as IssueWithLinkedIssues).id;
              tree = this.addChildrenNew(nodeId, tree);
              console.log(tree);
              // filter
            }
            nodes.push(item);
          }
          return nodes;
        }
      }
      // add linked issues to data of main issue
    } catch (e) {
      console.log("expand al error");
      console.log(e);
    }
  }

  async expandTreeNodesNew(
    prevTree: AtlasTree,
    nodeIds: string[],
    filter: IssueTreeFilter,
    fields: IssueField[]
  ): Promise<{ tree: AtlasTree; nodes: AtlasTreeNode[] }> {
    console.log("caleld expnd tree nodes");
    try {
      let tree;
      const issueIds = [];
      for (const nodeId of nodeIds) {
        const item = prevTree.items[nodeId];
        if (item.hasChildrenLoaded) {
          tree = mutateTree(prevTree, nodeId, {
            isExpanded: true,
          });
          console.log("tree from children loaded loaded", tree);
          return { tree, nodes: [] };
          // item.isExpanded = true;
        } else {
          issueIds.push((item.data as IssueWithLinkedIssues).id);
        }
      }
      const issueIdMap = {};
      if (issueIds.length > 0) {
        console.log("issue ids", issueIds);
        const issues = await this.api.getIssuesWithLinks(fields, issueIds);
        console.log(issues);
        for (const issue of issues) {
          issueIdMap[issue.id] = issue;
          const items = Object.values(tree.items).filter((item) => {
            return item.data.id === issue.id;
          });
          items.forEach((item) => {
            tree = mutateTree(tree, item, { data: issue });
          });
        }
        if (issues?.length > 0) {
          const nodes: AtlasTreeNode[] = [];
          for (const nodeId of nodeIds) {
            const item = tree.items[nodeId];
            if (!item.hasChildrenLoaded) {
              item.isExpanded = true;
              // const issueId = (item.data as IssueWithLinkedIssues).id;
              tree = this.addChildrenNew(nodeId, tree);
              console.log("tree from add children new", tree);
              // filter
            }
            nodes.push(item);
          }
          return { tree, nodes };
        }
      }
      // add linked issues to data of main issue
    } catch (e) {
      console.log("expand al error");
      console.log(e);
    }
  }

  async expandAllNew(
    filter: IssueTreeFilter,
    fields: IssueField[],
    prevTree: AtlasTree,
    setTree,
    handleError,
    clearAllErrors,
    setIsExpandAllLoading
  ): Promise<void> {
    // NOTE: using setTree without function is ok because, the node ids to be expanded are not being changed from prev tree to now. we just need the node ids. we dont need the most recent value. its ok if batched.
    try {
      setIsExpandAllLoading(true);
      clearAllErrors();
      console.log("expand all new called");
      let newTree = await this.expandAllNodes(
        prevTree,
        prevTree.items[this.ROOT_ID].children,
        0,
        fields,
        setTree
      );
      console.log("newtree", newTree);
      if (newTree?.items !== undefined) {
        console.log(
          "new tree from expand all new returned from expand all nodes",
          newTree
        );
        setTree(() => {
          console.log("newtree from settree", newTree);
          // newTree = this.applyFilterHook(newTree, filter, fields);
          return newTree;
        });
        setIsExpandAllLoading(false);
      }
    } catch (error) {
      handleError(error);
    }
  }

  async expandAllNodes(
    prevTree: AtlasTree,
    nodeIds: string[],
    level: number,
    issueFields: IssueField[],
    setTree
  ): Promise<AtlasTree> {
    console.log("EXPAND ALL NODES CALLED");
    console.log("level", level);
    console.log("given tree", prevTree);
    // eslint-disable-next-line no-useless-catch
    try {
      if (level >= 3) {
        return prevTree;
      }
      let newTree = this.cloneTree(prevTree);
      let nextNodeIds: string[] = [];
      const issueNodeIdMap = new Map<string, string[]>();
      const issuesToFetch: string[] = [];
      nodeIds.forEach((nodeId) => {
        const node = prevTree.items[nodeId];
        if (!node.isExpanded) {
          newTree = mutateTree(newTree, nodeId, { isExpanded: true });
        }

        if (!node.hasChildrenLoaded) {
          const lastSlashIndex = nodeId.lastIndexOf("/");
          const issueId = nodeId.substring(lastSlashIndex + 1);
          console.log(issueId);
          issuesToFetch.push(issueId);
          if (issueNodeIdMap[issueId] === undefined) {
            issueNodeIdMap[issueId] = [nodeId];
          } else {
            issueNodeIdMap[issueId] = issueNodeIdMap[issueId].concat([nodeId]);
          }
        }

        if (node.children.length > 0) {
          node.children.forEach((typeNodeId) => {
            const typeNode = newTree.items[typeNodeId];
            if (!typeNode.isExpanded) {
              newTree = mutateTree(newTree, typeNodeId, { isExpanded: true });
            }
            nextNodeIds = nextNodeIds.concat(typeNode.children);
          });
        }
      });

      console.log("issuesToFetch", issuesToFetch);
      console.log("nextnodeids", nextNodeIds);
      if (issuesToFetch?.length > 0) {
        console.log("fetch issuees and add children ");
        const issues = await this.api.getIssuesWithLinks(
          issueFields,
          issuesToFetch
        );
        console.log("issue node id map", issueNodeIdMap);
        for (const issue of issues) {
          const issueNodeIds = issueNodeIdMap[issue.id];
          issueNodeIds.forEach((nodeId) => {
            newTree = mutateTree(newTree, nodeId, { data: issue });
            newTree = this.addChildrenNew(nodeId, newTree);
          });
        }

        // return newTree;
        newTree = await this.expandAllNodes(
          newTree,
          nextNodeIds,
          level + 1,
          issueFields,
          setTree
        );
        return newTree;
      } else {
        console.log("returned from else");
        console.log(newTree);
        // return newTree;
        newTree = await this.expandAllNodes(
          newTree,
          nextNodeIds,
          level + 1,
          issueFields,
          setTree
        );
        return newTree;
      }
    } catch (error) {
      console.log("error has occured", error);
      throw error;
    }
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
