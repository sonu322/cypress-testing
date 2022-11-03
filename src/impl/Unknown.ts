import LXPAPI, {
  Filter,
  Issue,
  IssueField,
  IssueLinkType,
  IssuePriority,
  IssueType,
  IssueWithLinkedIssues,
  Project,
} from "../types/api";

export default class UnknownImpl implements LXPAPI {
  hasValidLicense(): boolean {
    throw new Error("Method not implemented.");
  }
  getJiraBaseURL(): string {
    throw new Error("Method not implemented.");
  }
  getPriorities(): Promise<IssuePriority[]> {
    throw new Error("Method not implemented.");
  }
  getIssueTypes(): Promise<IssueType[]> {
    throw new Error("Method not implemented.");
  }
  getIssueLinkTypes(): Promise<IssueLinkType[]> {
    throw new Error("Method not implemented.");
  }
  getIssueFields(): Promise<IssueField[]> {
    throw new Error("Method not implemented.");
  }
  getIssueWithLinks(
    fields: IssueField[],
    issueId?: string | undefined
  ): Promise<IssueWithLinkedIssues> {
    throw new Error("Method not implemented.");
  }
  getCurrentIssueId(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getIssueById(fields: IssueField[], issueId: string): Promise<Issue> {
    throw new Error("Method not implemented.");
  }
  getFilters(): Promise<Filter[]> {
    throw new Error("Method not implemented.");
  }
  getCurrentProject(projectKey?: string): Promise<Project> {
    throw new Error("Method not implemented.");
  }
  searchIssues(
    jql: string,
    fields?: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: Issue[]; total: number }> {
    throw new Error("Method not implemented.");
  }
}
