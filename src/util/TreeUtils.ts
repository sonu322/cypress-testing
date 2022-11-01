import { mutateTree } from "@atlaskit/tree";
import LXPAPI, { ID, Issue, IssueField, IssueLink, IssueTreeFilter, IssueWithLinkedIssues } from "../types/api";
import { csv, download, UUID } from "./index";
import { AtlasTree, AtlasTreeNode, LinkTypeTreeNode } from "../types/app";

// constants
const SUB_TASKS = "Subtasks";
const PARENT = "Parent";

// root node
const root: AtlasTree = {
  rootId: "0",
  items: {
    0: {
      id: "0",
      children: [],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      parentIssueId: null,
      data: {
        isType: true,
        title: "Fake Root Node",
      },
    },
  },
};

export default class TreeUtils {
  private ROOT_ID = "0";
  private api: LXPAPI;

  constructor(api: LXPAPI){
    this.api = api;
  }

  getRootTree(): AtlasTree {
    return root;
  }
  
  addTypeNode(issueType: string, tree: AtlasTree){
    return this.addTreeNode({ isType: true, title: issueType}, null, tree, true);
  }

  addTreeNode(data: IssueWithLinkedIssues | LinkTypeTreeNode, parentIssueId: ID, tree: AtlasTree, isExpanded = false){
    const node: AtlasTreeNode = {
      id: UUID(),
      children: [],
      hasChildren: true,
      isExpanded,
      isChildrenLoading: false,
      parentIssueId,
      data,
    };
    tree.items[node.id] = node;
    return node;
  }

  async initTree(filter: IssueTreeFilter, fields: IssueField[], setTree, handleError){
    this.handleExpand({ ...root }, this.ROOT_ID, fields, filter, setTree, handleError);
  }

  //Tree filter
  _shouldIncludeNode(mainIssue: Issue, linkedIssue: Issue, 
    issueLink: IssueLink, filter: IssueTreeFilter, parentIssueId: ID): boolean {
    if(!filter.issueTypes.includes(linkedIssue.type.id)){
      return false;
    } else if(!filter.linkTypes.includes(issueLink.linkTypeId)){
      return false;
    } else if(!filter.priorities.includes(linkedIssue.priority.id)){
      return false;
    } else if(parentIssueId && parentIssueId === linkedIssue.id){
      return false;
    }
    return true;
  }

  async handleExpand(tree: AtlasTree, nodeId: string, fields: IssueField[], filter: IssueTreeFilter, setTree, handleError){
    const item = tree.items[nodeId];
    if(nodeId !== this.ROOT_ID){
      setTree(mutateTree(tree, nodeId, { isChildrenLoading: true }));
      if (item.hasChildren && item.children.length > 0) {
        setTree(
          mutateTree(tree, nodeId, {
            isExpanded: true,
            isChildrenLoading: false,
          })
        );
        return;
      }
    }
    try {
      const issue = await this.api.getIssueWithLinks(fields,
        nodeId === this.ROOT_ID ? undefined : (item.data as IssueWithLinkedIssues).id);

      const newTree = { ...tree };
      let mainNode;
      if(nodeId === this.ROOT_ID){
        mainNode = this.addTreeNode(issue, null, newTree, true);
        // make actual root a child of fake(hidden) root node
        newTree.items[this.ROOT_ID].children = [ mainNode.id ];
      } else {
        mainNode = newTree.items[nodeId];
      }

      const typeMap = {},
        issueMap = {};
      issue.linkedIssues.forEach((linkedIssue: Issue) => {
        issueMap[linkedIssue.id] = linkedIssue;
      });

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
          const node = this.addTreeNode(linkedIssue, issue.id, newTree);
          if (typeMap[link.name] === undefined) {
            typeMap[link.name] = [];
          }
          typeMap[link.name].push(node.id);
        }
      }

      let types = Object.keys(typeMap), hasChildren = true;
      if(types.length){
        for (const type of types) {
          const typeNode = this.addTypeNode(type, newTree);
          typeNode.children = typeMap[type];
          mainNode.children.push(typeNode.id);
        }
      } else {
        hasChildren = false;
      }
      
      const changes = { isExpanded: true, isChildrenLoading: false, hasChildren };
      setTree(mutateTree(newTree, nodeId, changes));
      if(nodeId !== mainNode.id){
        setTree(mutateTree(newTree, mainNode.id, changes));
      }
    } catch(error){
      setTree(mutateTree(tree, nodeId, { isChildrenLoading: false }));
      handleError(error);
    }
  }

  exportTree (tree: AtlasTree) {
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
          content.type = data.type.name
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
    }

    process(tree.items[mainNodeId], 1);
    download("csv", csv(contents, true));
  }

  handleCollapse(itemId, tree, setTree){
    setTree(
      mutateTree(tree, itemId, {
        isExpanded: false,
        isChildrenLoading: false,
      })
    );
  }
}