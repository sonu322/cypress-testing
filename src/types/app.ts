import { ID, Issue, IssueWithLinkedIssues } from "./api";

export interface AtlasTree {
  rootId: string;
  items: AtlasTreeItems;
}

export interface AtlasTreeItems {
  [itemId: string]: AtlasTreeNode;
}
export enum TreeNodeType {
  LinkNode = "linkNode",
  ButtonNode = "buttonNode",
  IssueNode = "issueNode",
}

export interface LinkTypeTreeNode {
  id: string;
  title: string;
}

export interface ButtonTypeTreeNode {
  id: string;
  title: string;
  startNextCallIndex: number;
  totalSearchResults: number;
  isDataLoading: boolean;
}

export interface AtlasTreeNode {
  nodeType: TreeNodeType;
  id: string;
  children: string[];
  hasChildren: boolean;
  hasChildrenLoaded: boolean;
  isExpanded: boolean;
  isChildrenLoading: boolean;
  parentIssueId: ID;
  data: IssueWithLinkedIssues | Issue | LinkTypeTreeNode | ButtonTypeTreeNode;
  isTogglerDisabled?: boolean;
}


export interface LastSavedReportConfig {
  selectedTabIndex?: number; // convert to enum of tabs
  selectedJQLString?: string;
  selectedIssueTypeIds?: string[];
  selectedLinkTypeIds?: string[];
  selectedIssueFieldIds?: string[];
}