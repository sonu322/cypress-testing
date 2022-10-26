export type ID = string;

export interface IssueOption {
  id: ID;
  name: string;
}

export interface IssuePriority extends IssueOption { 
  description: string;
  iconUrl: string;
  statusColor: string;
}



export interface IssueField {
  id: ID;
  key: string;
  name: string;
  customKey: string;
}

export interface Issue {
  id: ID;
  priority: IssuePriority;
  type: IssueType;
  // fixVersions: IssueVersion[];
  status: IssueStatus;
  summary: string;
  // storyPoints: number;
  issueKey: string;
  // assignee: IssueUser;
  // sprints: IssueSprint[];
  links: IssueLink[];
  // TODO: fix type
  fields: any;
}

export interface IssueSprint {

}

export interface IssueUser {

}

export interface IssueWithLinkedIssues extends Issue {
  linkedIssues: Issue[];
}

export interface IssueLink {
  id: ID;
  name: string;
  isInward: boolean;
  issueId: ID;
}

export interface IssueVersion {

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

export interface IssueLinkType extends IssueOption { }

export interface Filter {
  expand: string;
  self: string;
  id: string;
  name: string;
}

export interface Project {
  style: string;
}

export default interface LXPAPI {
  
  hasValidLicense(): boolean;

  getJiraBaseURL(): string;

  getPriorities(): Promise<IssuePriority[]>;

  getIssueTypes(): Promise<IssueType[]>;

  getIssueLinkTypes(): Promise<IssueLinkType[]>;

  getIssueFields(): Promise<IssueField[]>;

  getIssueWithLinks(issueId?: string, fields?: string[]): Promise<IssueWithLinkedIssues>;

  getCurrentIssueId(): Promise<string>;

  getIssueById(issueId: string): Promise<Issue>;

  getFilters(): Promise<Filter[]>;

  getCurrentProject(projectKey?: string): Promise<Project>;
}