import {
  JiraAPI,
  JiraFiltersResponse,
  JiraIssueField,
  JiraIssueFull,
  JiraIssuePriorityFull,
  JiraIssueSearchResult,
  JiraIssueType,
  JiraLinkType,
  JiraProject,
} from "../../types/jira";

export default class JiraServerImpl implements JiraAPI {
  // @ts-ignore
  private _AJS: any = AJS;
  // @ts-ignore
  private _JIRA: any = JIRA;
  private contextPath: string = "";

  hasValidLicense(): boolean {
    // throw new Error("Method not implemented.");
    return true;
  }

  getJiraBaseURL(): string {
    // throw new Error("Method not implemented.");
    return "http://localhost:8082";
  }

  async getPriorities(): Promise<JiraIssuePriorityFull[]> {
    return await this._AJS.$.getJSON(this.contextPath + "/rest/api/2/priority");
  }

  async getIssueTypes(): Promise<JiraIssueType[]> {
    return await this._AJS.$.getJSON(
      this.contextPath + "/rest/api/2/issuetype"
    );
  }

  async getIssueLinkTypes(): Promise<JiraLinkType[]> {
    let result = await this._AJS.$.getJSON(
      this.contextPath + "/rest/api/2/issueLinkType"
    );
    return result?.issueLinkTypes;
  }

  async getIssueFields(): Promise<JiraIssueField[]> {
    return await this._AJS.$.getJSON(this.contextPath + "/rest/api/2/field");
  }

  async getIssueById(issueId: string, query: string): Promise<JiraIssueFull> {
    return await this._AJS.$.getJSON(
      this.contextPath + `/rest/api/2/issue/${issueId}${query}`
    );
  }

  async searchIssues(
    jql: string,
    fields: string[],
    start?: number,
    max?: number
  ): Promise<JiraIssueSearchResult> {
    const data = {
      fields,
      startAt: start ?? 0,
      maxResults: max ?? 500,
      jql,
    };

    return await this._AJS.$.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/rest/api/2/search",
      data: JSON.stringify(data),
    });
  }

  getCurrentIssueId(): Promise<string> {
    let issueID = this._JIRA.Issue.getIssueId();
    if (!issueID) {
      issueID = this._AJS.$("meta[name='ajs-issue-key']").text();
    }
    return Promise.resolve(issueID);
  }

  async getFilters(): Promise<JiraFiltersResponse> {
    let response = await this._AJS.getJSON("/rest/api/2/filter/search");
    return response.body && JSON.parse(response.body);
  }

  getCurrentProjectKey(): Promise<string> {
    let projectField = document.getElementById("project-field");
    let projectId = projectField?.textContent;
    if (!projectId) {
      projectId = this._JIRA.API.Projects.getCurrentProjectId();
    }
    return Promise.resolve(projectId);
  }

  //TODO: format is not similar
  async getProject(projectKey?: string): Promise<JiraProject> {
    return await this._AJS.$.getJSON(
      this.contextPath + `/rest/api/2/project/${projectKey}`
    );
  }
}
