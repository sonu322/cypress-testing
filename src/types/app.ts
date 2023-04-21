import {
  HEIGHT_FIELD_NAME,
  ISSUE_KEY_FIELD_NAME,
} from "../constants/gadgetTree";
import {
  HEIGHT_FIELD_NAME as HEIGHT_FIELD_NAME_TRACEABILITY,
  ISSUE_KEY_FIELD_NAME as ISSUE_KEY_FIELD_NAME_TRACEABILITY,
} from "../constants/gadgetTraceability";
import { ID, Issue, IssueTreeFilter, IssueWithLinkedIssues } from "./api";

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
  treeFilter?: IssueTreeFilter;
  isOrphansBranchPresent?: boolean;
}

export interface LastSavedTreeConfig {
  selectedIssueFieldIds?: string[];
  treeFilter?: IssueTreeFilter;
}

export interface TreeGadgetConfig {
  [ISSUE_KEY_FIELD_NAME]: string;
  [HEIGHT_FIELD_NAME]: number;
}

export interface TraceabilityGadgetConfig {
  [ISSUE_KEY_FIELD_NAME_TRACEABILITY]: string;
  [HEIGHT_FIELD_NAME_TRACEABILITY]: number;
}
