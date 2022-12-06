export type ID = string;

export interface IssueOption {
  id: ID;
  name: string;
}

export interface IssuePriority extends IssueOption {
  description?: string;
  iconUrl: string;
  statusColor?: string;
}

export interface IssueField {
  id: ID;
  name: string;
  jiraId: ID;
  secondaryJiraId?: ID;
}

export interface Issue {
  id: ID;
  priority: IssuePriority;
  type: IssueType;
  fixVersions: IssueVersion;
  status: IssueStatus;
  summary: string;
  isResolved: boolean;
  storyPoints?: number;
  issueKey: string;
  assignee: IssueUser;
  sprints: IssueSprint[];
  links: IssueLink[];
}

export interface IssueSprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
}

export interface IssueUser {
  displayName: string;
  active: boolean;
  avatarUrl: string;
}

export interface IssueLink {
  linkTypeId: ID;
  name: string;
  isInward: boolean;
  issueId: ID;
}

export interface IssueWithLinkedIssues extends Issue {
  linkedIssues: Issue[];
}

export interface IssueWithSortedLinks extends Issue {
  sortedLinks: {
    [key: string]: Issue[];
  };
}

export interface IssueVersion { 
  id: ID;
  name: string;
  archived: boolean;
  released: boolean;
  releaseDate: string;
  versionsColor: string;
}

export interface IssueStatus extends IssueOption {
  iconUrl: string;
  statusColor: string;
  description: string;
}

export interface IssueType extends IssueOption {
  description: string;
  iconUrl: string;
}

export interface IssueLinkType extends IssueOption {}

export interface Filter {
  expand: string;
  self: string;
  id: string;
  name: string;
}

export interface Project {
  style: string;
}

export interface IssueTreeFilter {
  priorities: ID[];
  issueTypes: ID[];
  linkTypes: ID[];
}

export enum CustomLinkType {
  SUBTASK = "SUBTASK",
  PARENT = "PARENT",
}

export default interface LXPAPI {
  hasValidLicense: () => boolean;

  getJiraBaseURL: () => string;

  getPriorities: () => Promise<IssuePriority[]>;

  getIssueTypes: () => Promise<IssueType[]>;

  getIssueLinkTypes: () => Promise<IssueLinkType[]>;

  getIssueFields: () => Promise<IssueField[]>;

  getIssueWithLinks: (
    fields: IssueField[],
    issueId?: string
  ) => Promise<IssueWithLinkedIssues>;

  getCurrentIssueId: () => Promise<string>;

  getIssueById: (fields: IssueField[], issueId?: string) => Promise<Issue>;

  searchIssues: (
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ) => Promise<{ data: Issue[]; total: number }>;
  searchLinkedIssues: (
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ) => Promise<{ data: IssueWithSortedLinks[]; total: number }>;

  getFilters: () => Promise<Filter[]>;

  getCurrentProject: (projectKey?: string) => Promise<Project>;
};
