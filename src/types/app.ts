import { ID, IssueWithLinkedIssues } from "./api";

export interface AtlasTree {
  rootId: string;
  items: AtlasTreeItems;
}

export interface AtlasTreeItems {
  [itemId: string]: AtlasTreeNode;
}

export interface LinkTypeTreeNode {
  isType: boolean;
  title: string;
}

export interface AtlasTreeNode {
  id: string;
  children: string[];
  hasChildren: boolean;
  isExpanded: boolean;
  isChildrenLoading: boolean;
  parentIssueId: ID;
  data: IssueWithLinkedIssues | LinkTypeTreeNode;
}
