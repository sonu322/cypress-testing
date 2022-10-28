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
  assignee: JiraAssignee;
  resolution: JiraResolution;
  fixVersions: JiraVersion[];
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
}

export interface JiraIssueFieldsFull extends JiraIssueFields {
  issuelinks: JiraIssueLink[],
  subtasks: JiraIssue[],
  parent: JiraIssue
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraIssueFieldsFull;
}

export interface JiraIssueFull extends JiraIssue {
  expand: string;
  fields: JiraIssueFieldsFull;
  // customfield_10039?: number;
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

export interface JiraResolution {
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

export interface JiraProject {
  expand: string;
  self: string;
  id: string;
  key: string;
  description: string;
  lead: JiraProjectLead;
  components: any[];
  issueTypes: JiraIssueType[];
  assigneeType: string;
  versions: JiraProjectVersion[];
  name: string;
  roles: JiraRoles;
  avatarUrls: JiraAvatarUrls;
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties: JiraProjectProperties;
}

export interface JiraProjectProperties {
}

export interface JiraRoles {
  [roleName: string]: string;
}

export interface JiraProjectVersion extends JiraVersion {
  userReleaseDate?: string;
  projectId: number;
  overdue?: boolean;
}

export interface JiraProjectLead {
  self: string;
  accountId: string;
  avatarUrls: JiraAvatarUrls;
  displayName: string;
  active: boolean;
}

export interface JiraIssueField {
  id: string;
  key: string;
  name: string;
  custom: boolean;
  orderable: boolean;
  navigable: boolean;
  searchable: boolean;
  clauseNames: string[];
  schema: JiraIssueFieldSchema;
}

export interface JiraIssueFieldSchema {
  type: string;
  system: string;
}

export interface JiraVersion {
  self: string;
  id: string;
  name: string;
  archived: boolean;
  released: boolean;
  releaseDate: string;
}