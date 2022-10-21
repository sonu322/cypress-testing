export interface JiraStatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export interface JiraIssueStatus {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: JiraStatusCategory;
}

export interface JiraIssuePriority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface JiraIssuePriorityFull extends JiraIssuePriority {
  description: string;
  statusColor: string;
}

export interface JiraIssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  hierarchyLevel: number;
}

export interface JiraLinkType {
  id: string;
  name: string;
  inward: string;
  outward: string;
  self: string;
}

export interface JiraIssueFields {
  summary: string;
  status: JiraIssueStatus;
  priority: JiraIssuePriority;
  issuetype: JiraIssueType;
}

export interface JiraIssueFieldsFull extends JiraIssueFields {
  issuelinks: JiraIssueLink[],
  subtasks: JiraIssue[]
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraIssueFields;
}

export interface JiraIssueFull extends JiraIssue {
  expand: string;
  fields: JiraIssueFieldsFull;
  // customfield_10039?: number;
  // assignee?: Assignee;
  // resolution?: Resolution;
  // parent?: Subtask;
}

export interface JiraIssueLink {
  id: string;
  self: string;
  type: JiraLinkType;
  inwardIssue ? : JiraIssue;
  outwardIssue ? : JiraIssue;
}

export interface JiraIssueSearchResult {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssueFull[];
}

export interface Resolution {
  self: string;
  id: string;
  description: string;
  name: string;
}

export interface JiraAssignee {
  self: string;
  accountId: string;
  avatarUrls: JiraAvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

export interface JiraAvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}