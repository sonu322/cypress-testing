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
  hierarchyLevel?: number; // only available in Jira Cloud
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
  issuelinks: JiraIssueLink[];
  subtasks: JiraIssue[];
  parent: JiraIssue;
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
  inwardIssue?: JiraIssue;
  outwardIssue?: JiraIssue;
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
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
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

export interface JiraProjectProperties {}
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
  key?: string; //only available in Jira Cloud
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
export interface JiraFiltersResponse {
  self: string;
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: JiraFilter[];
}

export interface JiraFilter {
  expand: string;
  self: string;
  id: string;
  name: string;
}

export interface JiraMyself {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  locale: string;
  groups: Groups;
  applicationRoles: Groups;
  expand: string;
}

interface Groups {
  size: number;
  items: any[];
}

interface AvatarUrls {
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
}

export interface HelpLinks {
  issueTree: string;
  traceability: string;
}

export interface JiraAutoCompleteResult {
  visibleFieldNames: VisibleFieldName[];
  visibleFunctionNames: VisibleFunctionName[];
  jqlReservedWords: string[];
}

interface VisibleFunctionName {
  value: string;
  displayName: string;
  isList: string;
  types: string[];
}

interface VisibleFieldName {
  value: string;
  displayName: string;
  orderable: string;
  searchable: string;
  operators: string[];
  types: string[];
  auto?: string;
  cfid?: string;
}

export interface JiraAutoCompleteSuggestionsResult {
  results: SuggestionResult[];
}

interface SuggestionResult {
  value: string;
  displayName: string;
}

export interface JiraAPI {
  linkIssueType(
    inwardIssueKey: string,
    jiraLinkTypeId: string,
    outwardIssueKey: string
  ): Promise<void>;

  isJiraCloud(): boolean;

  hasValidLicense(): boolean;

  getJiraBaseURL(): string;

  getPriorities(): Promise<JiraIssuePriorityFull[]>;

  getMyself(): Promise<JiraMyself>;

  getIssueTypes(): Promise<JiraIssueType[]>;

  getIssueLinkTypes(): Promise<JiraLinkType[]>;

  getIssueFields(): Promise<JiraIssueField[]>;

  getIssueById(issueId: string, query: string): Promise<JiraIssueFull>;

  searchIssues(
    jql: string,
    fields: string[],
    start?: number,
    max?: number
  ): Promise<JiraIssueSearchResult>;

  searchAllIssues(
    jql: string,
    fields: string[],
    start?: number,
    max?: number
  ): Promise<JiraIssueSearchResult>;

  getCurrentIssueId(): Promise<string>;

  getFilters(): Promise<JiraFiltersResponse>;

  getProject(projectKey: string): Promise<JiraProject>;

  getCurrentProjectKey(): Promise<string>;

  getHelpLinks(): HelpLinks;

  getAutoCompleteData(): Promise<JiraAutoCompleteResult>;

  getAutoCompleteSuggestions(
    query: string
  ): Promise<JiraAutoCompleteSuggestionsResult>;
}
