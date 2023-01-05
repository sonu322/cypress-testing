import { ID, Issue, IssueWithLinkedIssues } from "./api";

export interface AtlasTree {
  rootId: string;
  items: AtlasTreeItems;
}

export interface AtlasTreeItems {
  [itemId: string]: AtlasTreeNode;
}

export interface LinkTypeTreeNode {
  id: string;
  isType: boolean;
  title: string;
}

export interface ButtonTypeTreeNode {
  id: string;
  isButton: boolean;
  title: string;
  startNextCallIndex: number;
  totalSearchResults: number;
  isDataLoading: boolean;
}

export interface AtlasTreeNode {
  id: string;
  children: string[];
  hasChildren: boolean;
  hasChildrenLoaded: boolean;
  isExpanded: boolean;
  isChildrenLoading: boolean;
  parentIssueId: ID;
  data: IssueWithLinkedIssues | Issue | LinkTypeTreeNode | ButtonTypeTreeNode;
}
