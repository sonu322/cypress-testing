import LXPAPI, {
  Filter,
  Issue,
  IssueField,
  IssueLinkType,
  IssuePriority,
  IssueType,
  IssueWithLinkedIssues,
  IssueWithSortedLinks,
  Project,
} from "../types/api";
import { HelpLinks, JiraAutoCompleteResult, JiraAutoCompleteSuggestionsResult } from "../types/jira";

export default class UnknownImpl implements LXPAPI {
  hasValidLicense(): boolean {
    throw new Error("Method not implemented.");
  }

  isJiraCloud(): boolean {
    throw new Error("Method not implemented.");
  }

  getJiraBaseURL(): string {
    throw new Error("Method not implemented.");
  }

  async getPriorities(): Promise<IssuePriority[]> {
    throw new Error("Method not implemented.");
  }


  async getLocale(): Promise<string> {
    throw new Error("Method not implemented");
  }

  async getIssueTypes(): Promise<IssueType[]> {
    throw new Error("Method not implemented.");
  }

  async getIssueLinkTypes(): Promise<IssueLinkType[]> {
    throw new Error("Method not implemented.");
  }

  async getIssueFields(): Promise<IssueField[]> {
    throw new Error("Method not implemented.");
  }

  async getIssueWithLinks(
    fields: IssueField[],
    issueId?: string | undefined
  ): Promise<IssueWithLinkedIssues> {
    throw new Error("Method not implemented.");
  }

  async getCurrentIssueId(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async getIssueById(fields: IssueField[], issueId: string): Promise<Issue> {
    throw new Error("Method not implemented.");
  }

  async getFilters(): Promise<Filter[]> {
    throw new Error("Method not implemented.");
  }

  async getCurrentProject(projectKey?: string): Promise<Project> {
    throw new Error("Method not implemented.");
  }

  async searchIssues(
    jql: string,
    fields?: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: Issue[]; total: number }> {
    throw new Error("Method not implemented.");
  }
  async searchAllIssues(
    jql: string,
    fields?: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: Issue[]; total: number }> {
    throw new Error("Method not implemented.");
  }
  async searchOrphanIssues(
    jql: string,
    fields?: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: Issue[]; total: number }> {
    throw new Error("Method not implemented.");
  }

  async searchLinkedIssues(
    jql: string,
    fields?: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: IssueWithSortedLinks[]; total: number }> {
    throw new Error("Method not implemented.");
  }

  getHelpLinks(): HelpLinks {
    throw new Error("Method not implemented.");
  }

  async getAutoCompleteData(): Promise<JiraAutoCompleteResult> {
    throw new Error("Method not implemented.");
  }

  async getAutoCompleteSuggestions(
    query: string
  ): Promise<JiraAutoCompleteSuggestionsResult> {
    throw new Error("Method not implemented.");
  }

  async getDashboardGadgetConfig(
    dashboardId: string,
    dashboardItemId: string
  ): Promise<any> {
    throw new Error("Method not implemented");
  }

  resizeWindow(width: string | number, height: string | number): void {
    throw new Error("Method not implemented");
  }

  async editDashboardItemProperty(
    dashboardId: string,
    dashboardItemId: string,
    propertyKey: string,
    propertyValue: Object
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  async editDashboardItemTitle(
    dashboardId: string,
    dashboardItemId: string,
    title: string
  ): Promise<void> {
    throw new Error("Method not implemented");
  }
}
