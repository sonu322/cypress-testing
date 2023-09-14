import { mutateTree as mutateTreeMain } from "@atlaskit/tree";
import i18n from "../../i18n";
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
  LastSavedTreeConfig,
  LinkTypeTreeNode,
  TreeNodeType,
} from "../types/app";
import {
  loadMoreOrphansButtonName,
  orphansMaxResults,
  orphansTreeBranchName,
} from "../constants/traceabilityReport";
import { getItemInLocalStorage, setItemInLocalStorage, addIssueDetails, toCSV } from "./common";
import { EXPAND_ALL_LEVEL, lastSavedTreeConfigKey, NOT_SET } from "../constants/common";

function mutateTree(tree: AtlasTree, id, updateData, mutateMain = true): AtlasTree {
  if (mutateMain) {
    return mutateTreeMain(tree, id, updateData);
  } else {
    const node = tree.items[id];
    if (node !== undefined) {
      for (const key in updateData) {
        node[key] = updateData[key];
      }
    }
    return tree;
  }
}

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

  getIssueIdFromNodeId = (nodeId: string): string => {
    const lastSlashIndex = nodeId.lastIndexOf("/");
    if (lastSlashIndex > -1) {
      const issueId = nodeId.substring(lastSlashIndex + 1);
      return issueId;
    } else {
      return "";
    }
  };


  handleSetItemInSavedTreeConfig = (key: string, value: any): void => {
    const lastSavedTreeConfig = getItemInLocalStorage(lastSavedTreeConfigKey);
    let newReportConfig: Object;
    if (lastSavedTreeConfig !== null || lastSavedTreeConfig !== undefined) {
      newReportConfig = { ...lastSavedTreeConfig, [key]: value };
    } else {
      newReportConfig = {
        [key]: value,
      };
    }
    setItemInLocalStorage(lastSavedTreeConfigKey, newReportConfig);
  };

  handleGetItemInSavedTreeConfig = (key: string): any => {
    const lastSavedTreeConfig: LastSavedTreeConfig = getItemInLocalStorage(
      lastSavedTreeConfigKey
    );
    if (lastSavedTreeConfig !== undefined && lastSavedTreeConfig !== null) {
      return lastSavedTreeConfig[key];
    } else {
      return undefined;
    }
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

  async handleInitTree(
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree,
    handleError,
    rootIssueKey?: string
  ): Promise<void> {
    try {
      const tree = this.getRootTree();
      await this.initTree(
        tree,
        filter,
        fields,
        setTree,
        handleError,
        rootIssueKey
      );
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
    handleError,
    rootIssueKey?: string
  ): Promise<void> {
    try {
      const tree = this.cloneTree(prevTree);
      const issue = await this.api.getIssueWithLinks(fields, rootIssueKey);
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
      const treeWithAddedChildren = this.addChildren(mainNode.id, tree);
      const filteredTree = this.applySingleNodeTreeFilter(
        treeWithAddedChildren,
        filter,
        fields,
        nodeId,
        handleError
      );
      setTree(filteredTree);
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

  addNewNodes(
    handleError,
    filteredIssues: IssueWithSortedLinks[],
    prevTree: AtlasTree,
    shouldShowOrphans: boolean
  ): AtlasTree {
    try {
      let tree = this.cloneTree(prevTree);
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
      if (shouldShowOrphans) {
        tree = this.addOrphansBranch(tree);
        return tree;
      }
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
    if(!linkedIssue){
      return false;
    }
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
    } else if (filter.priorities.length > 0){
      if(!linkedIssue.priority && !filter.priorities.includes(NOT_SET)){
        return false;
      } else if(linkedIssue.priority && !filter.priorities.includes(linkedIssue.priority.id)){
        return false;
      }
    } 
    if (parentIssueId?.length > 0 && parentIssueId === linkedIssue.id) {
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

  getChildren(tree: AtlasTree, mainNode: AtlasTreeNode): AtlasTreeNode[] {
    const prefix = mainNode.id;

    const typeMap: Map<string, string[]> = new Map();
    const issueMap: Map<string, Issue> = new Map();
    const issue: IssueWithLinkedIssues = mainNode.data as IssueWithLinkedIssues;
    issue.linkedIssues.forEach((linkedIssue) => {
      issueMap[linkedIssue.id] = linkedIssue;
    });
    const issueLinks = issue.links;
    for (const link of issueLinks) {
      const linkedIssue: Issue = issueMap[link.issueId];
      let node: AtlasTreeNode;
      if (linkedIssue !== undefined) {
        node = tree.items[prefix + "/" + link.name + "/" + linkedIssue.id];
        if (node === undefined) {
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
          typeMap[link.name].push(node.id);
        } else {
          throw new Error(i18n.t("otpl.lxp.api.add-node-children-error"));
        }
      }
    }
    const result: AtlasTreeNode[] = [];
    const types = Object.keys(typeMap);
    if (types.length > 0) {
      for (const type of types) {
        let typeNode: AtlasTreeNode = tree.items[prefix + "/" + type];
        if (typeNode === undefined) {
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
    firstNodeId: string,
    handleError: (err: unknown) => void
  ): AtlasTree {
    try {
      if (firstNodeId !== undefined) {
        const node = tree.items[firstNodeId];
        if (node.hasChildrenLoaded) {
          const newTree = this.cloneTree(tree);
          const result = this.filterSubtree(
            newTree,
            filter,
            fields,
            firstNodeId
          );
          return result;
        }
      }
    } catch (err) {
      handleError(err);
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
      console.log(e);
      throw e;
    }
  }

  applyMultiNodeTreeFilter(
    tree: AtlasTree,
    filter: IssueTreeFilter,
    fields: IssueField[],
    handleError: (err: unknown) => void
  ): AtlasTree {
    try {
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
    } catch (error) {
      handleError(error);
    }
  }

  expandLinkNode(nodeId: string, tree: AtlasTree): AtlasTree {
    const expandedNodeTree = mutateTree(tree, nodeId, { isExpanded: true });
    return expandedNodeTree;
  }

  addChildren(nodeId, tree): AtlasTree {
    try {
      const mainNode = tree.items[nodeId];
      if ((mainNode.data as IssueWithLinkedIssues).linkedIssues !== undefined) {
        const children = this.getChildren(tree, mainNode);
        const childIds = children.map((item) => item.id);
        const newTree = mutateTree(tree, mainNode.id, {
          children: childIds,
          hasChildren: childIds.length > 0,
          hasChildrenLoaded: true,
        });
        return newTree;
      } else {
        return tree;
      }
    } catch (error) {
      console.log(error);
      throw new Error(i18n.t("otpl.lxp.api.add-node-children-error"));
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
        const linkedIssueNode: AtlasTreeNode = tree.items[prefix + "/" + link.name + "/" + linkedIssue.id];
        if (linkedIssueNode === undefined) {
          throw new Error(i18n.t("otpl.lxp.api.filters-error"));
        }
        if (typeMap[link.name] === undefined) {
          typeMap[link.name] = [];
        }
        typeMap[link.name].push(linkedIssueNode.id);
      }
      // get type nodes corresponding to filtered links
      // add filtered linked issue nodes as children to type nodes
      const mainNodeChildIds: string[] = [];
      const types = Object.keys(typeMap);
      if (types.length > 0) {
        for (const type of types) {
          const typeNode: AtlasTreeNode = tree.items[prefix + "/" + type];
          if (typeNode === undefined) {
            throw new Error(i18n.t("otpl.lxp.api.filters-error"));
          }
          tree = mutateTree(tree, typeNode.id, {
            children: typeMap[type],
          });
          mainNodeChildIds.push(typeNode.id);
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
      throw new Error(i18n.t("otpl.lxp.api.add-node-children-error"));
    }
  }

  startLoadingNode = (tree: AtlasTree, loadingNodeId: string): AtlasTree => {
    let newTree = mutateTree(tree, loadingNodeId, { isChildrenLoading: true });
    const otherNodeIds = Object.keys(tree.items).filter(
      (otherNodeId) => otherNodeId !== loadingNodeId
    );
    otherNodeIds.forEach((otherNodeId) => {
      newTree = mutateTree(newTree, otherNodeId, {
        isTogglerDisabled: true,
      });
    });
    return newTree;
  };

  stopLoadingNode = (tree: AtlasTree, loadingNodeId: string): AtlasTree => {
    let loadingResetTree = mutateTree(tree, loadingNodeId, {
      isExpanded: true,
      hasChildrenLoaded: true,
      isChildrenLoading: false,
    });
    const otherNodeIds = Object.keys(tree.items).filter(
      (otherNodeId) => otherNodeId !== loadingNodeId
    );
    otherNodeIds.forEach((otherNodeId) => {
      loadingResetTree = mutateTree(loadingResetTree, otherNodeId, {
        isTogglerDisabled: false,
      });
    });
    return loadingResetTree;
  };

  async expandIssueNode(
    nodeId: string,
    hasNodeChildrenLoaded: boolean,
    filter: IssueTreeFilter,
    fields: IssueField[],
    setTree: React.Dispatch<React.SetStateAction<AtlasTree>>,
    handleError: (err: unknown) => void,
    clearAllErrors: () => void
  ): Promise<void> {
    try {
      clearAllErrors();
      setTree((prevTree) => {
        const newTree = this.startLoadingNode(prevTree, nodeId);
        return newTree;
      });
      const issueId = this.getIssueIdFromNodeId(nodeId);
      if (issueId?.length > 0 && !hasNodeChildrenLoaded) {
        const issue = await this.api.getIssueWithLinks(fields, issueId);
        if (issue !== undefined) {
          setTree((prevTree) => {
            const populatedIssueWithLinksTree = mutateTree(prevTree, nodeId, {
              data: issue,
            });
            const treeWithAddedChildren = this.addChildren(
              nodeId,
              populatedIssueWithLinksTree
            );
            const loadingResetTree = this.stopLoadingNode(
              treeWithAddedChildren,
              nodeId
            );

            if (loadingResetTree !== undefined) {
              const filteredTree = this.applySingleNodeTreeFilter(
                loadingResetTree,
                filter,
                fields,
                nodeId,
                handleError
              );

              return filteredTree;
            }
            return prevTree;
          });
        }
      } else {
        setTree((prevTree) => {
          const filteredTree = this.applySingleNodeTreeFilter(
            prevTree,
            filter,
            fields,
            nodeId,
            handleError
          );
          const loadingResetTree = this.stopLoadingNode(filteredTree, nodeId);
          return loadingResetTree;
        });
      }
    } catch (error) {
      console.error("caught error from expand", error);
      setTree((prevTree) => {
        const loadingResetTree = this.startLoadingNode(prevTree, nodeId);
        return loadingResetTree;
      });
      handleError(error);
    }
  }

  async handleSingleExpandAllNodes(
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
        EXPAND_ALL_LEVEL
      );
      if (newTree?.items !== undefined) {
        setTree(() => {
          const rootNode = newTree.items[this.ROOT_ID];
          const rootIssueNodeId = rootNode.children[0];
          newTree = this.applySingleNodeTreeFilter(
            newTree,
            filter,
            fields,
            rootIssueNodeId,
            handleError
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

  async handleMultipleExpandAllNodes(
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
        EXPAND_ALL_LEVEL,
        true,
        false
      );
      if (newTree?.items !== undefined) {
        setTree(() => {
          newTree = this.applyMultiNodeTreeFilter(
            newTree,
            filter,
            fields,
            handleError
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

  getChildIssueNodeIds = (
    prevTree: AtlasTree,
    typeNodeIds: string[],
    mutateMain = true
  ): { newTree?: AtlasTree; childIssueNodeIds: string[] } => {
    // takes typeNodeIds of an issue node and returns all their child node ids - these will be issues
    // takes prevTree and expands any collapsed type nodes
    let newTree = prevTree;
    let childIssueNodeIds: string[] = [];
    typeNodeIds.forEach((typeNodeId) => {
      const typeNode = newTree.items[typeNodeId];
      if (!typeNode.isExpanded) {
        newTree = mutateTree(newTree, typeNodeId, { isExpanded: true }, mutateMain);
      }
      childIssueNodeIds = childIssueNodeIds.concat(typeNode.children);
    });
    return { newTree, childIssueNodeIds };
  };

  async expandAllNodes(
    prevTree: AtlasTree,
    nodeIds: string[],
    level: number,
    issueFields: IssueField[],
    maxLevels: number,
    cloneTree = true,
    mutateMain = true
  ): Promise<AtlasTree> {
    if (level >= maxLevels) {
      return prevTree;
    }
    let newTree;
    if (cloneTree) {
      newTree = this.cloneTree(prevTree);
    } else {
      newTree = prevTree;
    }

    let nextNodeIds: string[] = [];
    const issueNodeIdMap = new Map<string, string[]>();
    const issuesToFetch: string[] = [];
    nodeIds.forEach((nodeId) => {
      const node = prevTree.items[nodeId];
      if (!node.isExpanded) {
        newTree = mutateTree(newTree, nodeId, { isExpanded: true }, mutateMain);
      }

      if (!node.hasChildrenLoaded) {
        const issueId = this.getIssueIdFromNodeId(nodeId);
        issuesToFetch.push(issueId);
        if (issueNodeIdMap[issueId] === undefined) {
          issueNodeIdMap[issueId] = [nodeId];
        } else {
          issueNodeIdMap[issueId].push(nodeId);
        }
      }

      if (node.children.length > 0) {
        const childIssueNodesInfo = this.getChildIssueNodeIds(
          newTree,
          node.children,
          mutateMain
        );
        if (childIssueNodesInfo.newTree !== undefined) {
          newTree = childIssueNodesInfo.newTree;
        }
        nextNodeIds = nextNodeIds.concat(childIssueNodesInfo.childIssueNodeIds);
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
          newTree = mutateTree(newTree, nodeId, { data: issue }, mutateMain);
          newTree = this.addChildren(nodeId, newTree);
          const node = newTree.items[nodeId];
          if (node.children.length > 0) {
            const childIssueNodesInfo = this.getChildIssueNodeIds(
              newTree,
              node.children,
              mutateMain
            );
            if (childIssueNodesInfo.newTree !== undefined) {
              newTree = childIssueNodesInfo.newTree;
            }
            nextNodeIds = nextNodeIds.concat(
              childIssueNodesInfo.childIssueNodeIds
            );
          }
        });
      }

      // return newTree;
      newTree = await this.expandAllNodes(
        newTree,
        nextNodeIds,
        level + 1,
        issueFields,
        maxLevels,
        false,
        mutateMain
      );
      return newTree;
    } else {
      // return newTree;
      newTree = await this.expandAllNodes(
        newTree,
        nextNodeIds,
        level + 1,
        issueFields,
        maxLevels,
        false,
        mutateMain
      );
      return newTree;
    }
  }

  collapseAll(setTree): void {
    const collapseNode = (tree: AtlasTree, nodeId: string): void => {
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

  exportTree(
    tree: AtlasTree,
    issueFields: IssueField[],
    selectedIssueFieldIds: string[]
  ): void {
    const root = tree.items[tree.rootId];
    const headerItems = ["Indent", "Issue Key", "Link"];
    issueFields.forEach((issueField) => {
      if (selectedIssueFieldIds.includes(issueField.id)) {
        headerItems.push(issueField.name);
      }
    });
    const contents: any[] = [];
    contents.push(headerItems);

    const process = (
      item: AtlasTreeNode,
      indent: number,
      link: string
    ): void => {
      let currentNodeLink = "";
      if (!item || !item.data || item.nodeType === TreeNodeType.ButtonNode) {
        return;
      } else {
        const dataObj = item.data;
        if (item.nodeType === TreeNodeType.LinkNode) {
          currentNodeLink = (dataObj as LinkTypeTreeNode).title;
        } else {
          const data = dataObj as IssueWithLinkedIssues;
          const rowItems = [indent, data.issueKey, link];
          addIssueDetails(data, issueFields, selectedIssueFieldIds, rowItems);
          contents.push(rowItems);
        }
      }
      if (item.hasChildren && item.isExpanded) {
        let nextIndent = indent;
        if (currentNodeLink !== "") {
          nextIndent++;
        }
        item.children.forEach((key) => {
          process(tree.items[key], nextIndent, currentNodeLink);
        });
      }
    };

    root.children.forEach((mainNodeId) => {
      process(tree.items[mainNodeId], 1, "");
    });
    download("csv", toCSV(contents, true));
  }

  collapseNode(
    nodeId: string,
    setTree: React.Dispatch<React.SetStateAction<AtlasTree>>
  ): void {
    setTree((tree) => {
      return mutateTree(tree, nodeId, {
        isExpanded: false,
        isChildrenLoading: false,
      });
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
