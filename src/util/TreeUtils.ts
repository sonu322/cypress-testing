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
  TreeNodeType,
} from "../types/app";
import {
  loadMoreOrphansButtonName,
  orphansMaxResults,
  orphansTreeBranchName,
} from "../constants/traceabilityReport";

// root node
const root: AtlasTree = {
  rootId: "0",
  items: {
    0: {
      id: "0",
      nodeType: TreeNodeType.LinkNode,
      children: [],
      hasChildren: true,
      hasChildrenLoaded: false,
      isExpanded: true,
      isChildrenLoading: false,
      parentIssueId: null,
      data: {
        id: "0",
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
        id: issueType,
        title: issueType,
      },
      null,
      TreeNodeType.LinkNode,
      true,
      true
    );
  }

  createTreeNode(
    tree: AtlasTree,
    prefix: string,
    data: IssueWithLinkedIssues | Issue | LinkTypeTreeNode | ButtonTypeTreeNode,
    parentIssueId: ID,
    nodeType: TreeNodeType,
    isExpanded = false,
    hasChildrenLoaded = false,
    hasChildren = true
  ): AtlasTreeNode {
    const node: AtlasTreeNode = {
      nodeType,
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
      const mainNode = this.createTreeNode(
        tree,
        "",
        issue,
        null,
        TreeNodeType.IssueNode,
        true
      );
      const nodeId = mainNode.id;
      // make actual root a child of fake(hidden) root node
      tree.items[this.ROOT_ID].children = [nodeId];
      const newTree = await this.addChildren(nodeId, tree, issue, filter);
      setTree(newTree);
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

      tree.items[this.ROOT_ID].children = [];
      filteredIssuesWithLinks.forEach((issueWithLinks) => {
        const node = this.createTreeNode(
          tree,
          "",
          issueWithLinks,
          null,
          TreeNodeType.IssueNode,
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
              TreeNodeType.IssueNode,
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
          isDataLoading: false,
        },
        orphanTypeNode.id,
        TreeNodeType.ButtonNode,
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
          TreeNodeType.IssueNode,
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
    } else if (parentIssueId?.length > 0 && parentIssueId === linkedIssue.id) {
      return false;
    }
    return true;
  }

  filterLinks(
    issue: IssueWithLinkedIssues,
    filter: IssueTreeFilter,
    mainNode: AtlasTreeNode,
    issueMap: Map<string, Issue>
  ): IssueLink[] {
    const filteredIssueLinks: IssueLink[] = [];
    for (const link of issue.links) {
      const linkedIssue: Issue = issueMap[link.issueId];
      if (
        this._shouldIncludeNode(
          linkedIssue,
          link,
          filter,
          mainNode.parentIssueId
        )
      ) {
        filteredIssueLinks.push(link);
      }
    }
    return filteredIssueLinks;
  }

  getChildren(
    tree: AtlasTree,
    mainNode: AtlasTreeNode,
    filter?: IssueTreeFilter,
    issue?: IssueWithLinkedIssues
  ): AtlasTreeNode[] {
    const prefix = mainNode.id;
    const typeMap: Map<string, string[]> = new Map(); // TODO: convert to map
    const issueMap: Map<string, Issue> = new Map();
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
        issue.id,
        TreeNodeType.IssueNode
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

    const typeMap = {}; // TODO: convert to map
    const issueMap: Map<string, Issue> = new Map();
    const issue = mainNode.data;
    issue.linkedIssues.forEach((linkedIssue: Issue) => {
      issueMap[linkedIssue.id] = linkedIssue;
    });
    const issueLinks = mainNode?.data?.links;

    for (const link of issueLinks) {
      const linkedIssue: Issue = issueMap[link.issueId];
      const foundNodeId = Object.keys(tree.items).find((nodeId) => {
        return nodeId === prefix + "/" + link.name + "/" + linkedIssue.id;
      });
      let node: AtlasTreeNode;
      if (foundNodeId !== undefined) {
        node = tree.items[foundNodeId];
      } else {
        node = this.createTreeNode(
          tree,
          prefix + "/" + link.name,
          linkedIssue,
          issue.id,
          TreeNodeType.IssueNode
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

  applySingleNodeTreeFilter(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    firstNodeId: string
  ): AtlasTree {
    if (firstNodeId !== undefined) {
      const node = tree.items[firstNodeId];
      if (node.hasChildrenLoaded) {
        const newTree = this.cloneTree(tree);
        const result = this.filterSubtree(newTree, filter, fields, firstNodeId);
        return result;
      }
    }
  }

  filterSubtree(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    nodeId: string
  ): AtlasTree {
    try {
      tree = this.filterNodeChildren(nodeId, tree, filter);
      const node = tree.items[nodeId];
      for (const typeNodeId of node.children) {
        // type nodes
        const typeNode = tree.items[typeNodeId];
        for (const childNodeId of typeNode.children) {
          const child = tree.items[childNodeId];
          if (child.hasChildrenLoaded) {
            tree = this.filterSubtree(tree, filter, fields, child.id);
          }
        }
      }
      return tree;
    } catch (e) {
      console.log("e from apply filter new");
      console.log(e);
      // TODO: add error handling
    }
  }

  applyMultiNodeTreeFilter(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    fields: IssueField[]
  ): AtlasTree {
    let newTree = this.cloneTree(tree);
    let firstNodeIds: string[];
    if (newTree.items !== undefined) {
      firstNodeIds = newTree.items[this.ROOT_ID].children;
    }

    if (firstNodeIds !== undefined) {
      firstNodeIds.forEach((firstNodeId) => {
        const firstNode = tree.items[firstNodeId];
        if (
          firstNode.nodeType !== TreeNodeType.ButtonNode &&
          (firstNode.data as IssueWithLinkedIssues).linkedIssues !==
            undefined &&
          (firstNode.data as IssueWithLinkedIssues).linkedIssues.length > 0 &&
          firstNode.isExpanded
        ) {
          newTree = this.filterSubtree(newTree, filter, fields, firstNodeId);
        }
      });
    }
    return newTree;
  }

  expandLinkNode(nodeId: string, tree: AtlasTree): AtlasTree {
    const expandedNodeTree = mutateTree(tree, nodeId, { isExpanded: true });
    return expandedNodeTree;
  }

  async addChildren(
    nodeId,
    tree,
    issue,
    filter = undefined
  ): Promise<AtlasTree> {
    try {
      const mainNode = tree.items[nodeId];
      const children = await this.getChildren(tree, mainNode, filter, issue);
      const childIds = children.map((item) => item.id);
      const newTree = mutateTree(tree, nodeId, {
        children: childIds,
        isExpanded: true,
        isChildrenLoading: false,
        hasChildrenLoaded: true,
        hasChildren: childIds.length > 0,
      });
      return newTree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children");
      // TODO: add error handling
    }
  }

  addChildrenNew(nodeId, tree): AtlasTree {
    try {
      const mainNode = tree.items[nodeId];
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
      throw new Error("Error occured while adding children for issue", nodeId);
      // TODO: add error handling
    }
  }

  filterNodeChildren(
    mainNodeId: string,
    tree: AtlasTree,
    filter: IssueTreeFilter
  ): AtlasTree {
    try {
      const mainNode = tree.items[mainNodeId];
      const prefix = mainNode.id;
      const issue = mainNode.data;
      const issueMap: Map<string, IssueWithLinkedIssues> = new Map();
      const typeMap: Map<string, string[]> = new Map();
      (issue as IssueWithLinkedIssues).linkedIssues?.forEach(
        (linkedIssue: Issue) => {
          issueMap[linkedIssue.id] = linkedIssue;
        }
      );
      const filteredLinks = this.filterLinks(
        issue as IssueWithLinkedIssues,
        filter,
        mainNode,
        issueMap
      );

      // get linked issue nodes corresponding to filtered links
      // and store them in type map.

      for (const link of filteredLinks) {
        const linkedIssue: Issue = issueMap[link.issueId];
        const linkedIssueNodeId = Object.keys(tree.items).find((nodeId) => {
          return nodeId === prefix + "/" + link.name + "/" + linkedIssue.id;
        });
        let linkedIssueNode: AtlasTreeNode;
        if (linkedIssueNodeId !== undefined) {
          linkedIssueNode = tree.items[linkedIssueNodeId];
        } else {
          throw new Error("could not filter"); // TODO: add translation
        }
        if (typeMap[link.name] === undefined) {
          typeMap[link.name] = [];
        }
        if (linkedIssueNode !== undefined) {
          typeMap[link.name].push(linkedIssueNode.id);
        } else {
          throw new Error("could not filter"); // TODO: add translation
        }
      }
      // get type nodes corresponding to filtered links
      // add filtered linked issue nodes as children to type nodes
      const mainNodeChildIds: string[] = [];
      const types = Object.keys(typeMap);
      if (types.length > 0) {
        for (const type of types) {
          let typeNode: AtlasTreeNode;
          const typeNodeId = Object.keys(tree.items).find(
            (nodeId) => nodeId === prefix + "/" + type
          );
          if (typeNodeId !== undefined) {
            typeNode = tree.items[typeNodeId];
          } else {
            throw new Error("could not filter"); // TODO: add translation
          }
          if (typeNode !== undefined) {
            tree = mutateTree(tree, typeNodeId, {
              children: typeMap[type],
            });
            mainNodeChildIds.push(typeNodeId);
          } else {
            throw new Error("could not filter"); // TODO: add translation
          }
        }
      }
      // set filtered type nodes as children of main node
      const newTree = mutateTree(tree, mainNode.id, {
        children: mainNodeChildIds,
        hasChildren: mainNodeChildIds.length > 0,
        hasChildrenLoaded: true,
      });

      return newTree;
    } catch (error) {
      console.log(error);
      throw new Error("Error occured while adding children for issue");
      // TODO: add error handling
    }
  }

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
      clearAllErrors();
      setTree((prevTree) => {
        const item = prevTree.items[nodeId];
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
        return newTree;
      });

      const issue = await this.api.getIssueWithLinks(fields, issueId);

      if (issue !== undefined) {
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
            isChildrenLoading: false,
          });
          const otherNodeIds = Object.keys(treeWithAddedChildren.items).filter(
            (otherNodeId) => otherNodeId !== nodeId
          );
          otherNodeIds.forEach((otherNodeId) => {
            loadingResetTree = mutateTree(loadingResetTree, otherNodeId, {
              isTogglerDisabled: false,
            });
          });

          if (loadingResetTree !== undefined) {
            const filteredTree = this.applySingleNodeTreeFilter(
              loadingResetTree,
              filter,
              fields,
              nodeId
            ); // TODO: make it handle only its tree does not work for multinode

            return filteredTree;
          }
          return prevTree;
        });
      }
    } catch (error) {
      console.error("caught error from expand", error);
      setTree((prevTree) =>
        mutateTree(prevTree, nodeId, { isChildrenLoading: false })
      );
      handleError(error);
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
    setIsExpandAllLoading(true);
    // NOTE: using setTree without function is ok because, the node ids to be expanded are not being changed from prev tree to now. we just need the node ids. we dont need the most recent value. its ok if batched.
    try {
      clearAllErrors();
      let newTree = await this.expandAllNodes(
        prevTree,
        prevTree.items[this.ROOT_ID].children,
        0,
        fields,
        setTree
      );
      if (newTree?.items !== undefined) {
        setTree(() => {
          const rootNode = newTree.items[this.ROOT_ID];
          const rootIssueNodeId = rootNode.children[0];
          newTree = this.applySingleNodeTreeFilter(
            newTree,
            filter,
            fields,
            rootIssueNodeId
          );
          return newTree;
        });
        setIsExpandAllLoading(false);
      }
    } catch (error) {
      setIsExpandAllLoading(false);
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
    // TODO: add error handling
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

      if (issuesToFetch?.length > 0) {
        const issues = await this.api.getIssuesWithLinks(
          issueFields,
          issuesToFetch
        );
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
      // TODO: add error handling
      console.log("error has occured", error);
      throw error;
    }
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
        if (item.nodeType === TreeNodeType.LinkNode) {
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

    const process = (item: AtlasTreeNode, indent: number): void => {
      if (!item || item.nodeType === TreeNodeType.ButtonNode) {
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
        if (item.nodeType === TreeNodeType.LinkNode) {
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
