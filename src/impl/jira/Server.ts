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
  HelpLinks,
  JiraMyself,
  JiraAutoCompleteResult,
  JiraAutoCompleteSuggestionsResult,
} from "../../types/jira";

export default class JiraServerImpl implements JiraAPI {
  // @ts-expect-error
  private readonly _AJS: any = AJS;
  // @ts-expect-error
  private readonly _JIRA: any = JIRA;
  private readonly contextPath: string = "";
  private readonly isValidLicense: boolean = false;

  constructor(rootElement: HTMLElement) {
    this.isValidLicense = rootElement.dataset.license === "true";
    this.contextPath = rootElement.dataset.contextpath;
  }

  isJiraCloud(): boolean {
    return false;
  }

  hasValidLicense(): boolean {
    return this.isValidLicense;
  }

  getJiraBaseURL(): string {
    return this.contextPath;
  }

  async getPriorities(): Promise<JiraIssuePriorityFull[]> {
    // @ts-expect-error
    if(typeof lxpPriorities !== "undefined") return lxpPriorities; // This variable is handled through lxp-server repo in velocity template
    else {
      return await this._AJS.$.getJSON(this.contextPath + "/rest/api/2/priority");
    }
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
      url: this.contextPath + "/rest/api/2/search",
      data: JSON.stringify(data),
    });
  }

  async searchAllIssues(
    jql: string,
    fields: string[],
    start?: number,
    max?: number
  ): Promise<JiraIssueSearchResult> {
    let allIssues: JiraIssueFull[] = [];
    const searchResult = await this.searchIssues(jql, fields, start, max);

    const { issues, total } = searchResult;
    allIssues = allIssues.concat(issues);
    if (max !== undefined) {
      while (allIssues.length < max && allIssues.length < total - start) {
        const moreLinkedIssuesData = await this.searchIssues(
          jql,
          fields,
          allIssues.length,
          total
        );
        allIssues = allIssues.concat(moreLinkedIssuesData.issues);
      }
    } else {
      while (allIssues.length < total) {
        const moreLinkedIssuesData = await this.searchIssues(
          jql,
          fields,
          allIssues.length,
          total
        );
        allIssues = allIssues.concat(moreLinkedIssuesData.issues);
      }
    }
    return {
      issues: allIssues,
      expand: searchResult.expand,
      startAt: searchResult.total,
      maxResults: max,
      total: searchResult.total,
    };
  }

  getCurrentIssueId(): Promise<string> {
    let issueID = this._JIRA.Issue.getIssueId();
    if (!issueID) {
      issueID = this._AJS.$("meta[name='ajs-issue-key']").text();
    }
    return Promise.resolve(issueID);
  }

  async getFilters(): Promise<JiraFiltersResponse> {
    // @ts-expect-error
    const res = typeof lxpFilters !== "undefined" ? lxpFilters : []; // This variable is handled through lxp-server repo in velocity template
    return {
      self: null,
      maxResults: res.length,
      startAt: 0,
      total: res.length,
      isLast: true,
      values: res,
    };
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

  getHelpLinks(): HelpLinks {
    return {
      issueTree: "https://optimizory.atlassian.net/l/cp/SpHT1C13",
      traceability: "https://optimizory.atlassian.net/l/cp/ro6jscHZ",
    };
  }

  async getMyself(): Promise<JiraMyself> {
    return await this._AJS.$.getJSON(this.contextPath + "/rest/api/2/myself");
  }

  async getAutoCompleteData(): Promise<JiraAutoCompleteResult> {
    return await this._AJS.$.getJSON(
      this.contextPath + "/rest/api/2/jql/autocompletedata"
    );
  }

  async getAutoCompleteSuggestions(
    query: string
  ): Promise<JiraAutoCompleteSuggestionsResult> {
    return await this._AJS.$.getJSON(
      this.contextPath + "/rest/api/2/jql/autocompletedata/suggestions?" + query
    );
  }
}
