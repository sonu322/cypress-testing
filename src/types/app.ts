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
  hasLoadMoreButton?: boolean;
  loadMoreHandler?: Function;
}

export interface AtlasTreeNode {
  id: string;
  children: string[];
  hasChildren: boolean;
  hasChildrenLoaded: boolean;
  isExpanded: boolean;
  isChildrenLoading: boolean;
  parentIssueId: ID;
  data: IssueWithLinkedIssues | Issue | LinkTypeTreeNode;
}
