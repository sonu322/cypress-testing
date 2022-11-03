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
}

export interface Issue {
  id: ID;
  priority: IssuePriority;
  type: IssueType;
  fixVersions: IssueVersion[];
  status: IssueStatus;
  summary: string;
  isResolved: boolean;
  storyPoints?: number;
  issueKey: string;
  assignee: IssueUser;
  sprints: IssueSprint[];
  links: IssueLink[];
  // TODO: fix type
  // fields: any; //TODO: need discussion
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
<<<<<<< HEAD
  hasValidLicense: () => boolean;
=======
  hasValidLicense(): boolean;
>>>>>>> develop

  getJiraBaseURL: () => string;

  getPriorities: () => Promise<IssuePriority[]>;

  getIssueTypes: () => Promise<IssueType[]>;

  getIssueLinkTypes: () => Promise<IssueLinkType[]>;

  getIssueFields: () => Promise<IssueField[]>;

<<<<<<< HEAD
  getIssueWithLinks: (
    fields: IssueField[],
    issueId?: string
  ) => Promise<IssueWithLinkedIssues>;
=======
  getIssueWithLinks(
    fields: IssueField[],
    issueId?: string
  ): Promise<IssueWithLinkedIssues>;
>>>>>>> develop

  getCurrentIssueId: () => Promise<string>;

<<<<<<< HEAD
  getIssueById: (fields: IssueField[], issueId?: string) => Promise<Issue>;

  searchIssues: (
=======
  getIssueById(fields: IssueField[], issueId?: string): Promise<Issue>;

  searchIssues(
>>>>>>> develop
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
<<<<<<< HEAD
  ) => Promise<{data: Issue[]; total: number}>;
  searchLinkedIssues: (
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ) => Promise<{data: IssueWithSortedLinks[]; total: number}>;
=======
  ): Promise<{ data: Issue[]; total: number }>;
>>>>>>> develop

  getFilters: () => Promise<Filter[]>;

<<<<<<< HEAD
  getCurrentProject: (projectKey?: string) => Promise<Project>;
}
=======
  getCurrentProject(projectKey?: string): Promise<Project>;
}
>>>>>>> develop
