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

import { getQueryParam } from "../../util/index";

export default class JiraCloudImpl implements JiraAPI {
  // @ts-ignore
  private _AP: any = AP;

  hasValidLicense(): boolean {
    const lic = getQueryParam("lic");
    return !(lic && "none" === lic);
  }

  getJiraBaseURL(): string {
    return getQueryParam("xdm_e") as string;
  }

  async getPriorities(): Promise<JiraIssuePriorityFull[]> {
    let response = await this._AP.request("/rest/api/3/priority");
    return response.body && JSON.parse(response.body);
  }

  async getIssueTypes(): Promise<JiraIssueType[]> {
    let response = await this._AP.request("/rest/api/3/issuetype");
    return response.body && JSON.parse(response.body);
  }

  async getIssueLinkTypes(): Promise<JiraLinkType[]> {
    let response = await this._AP.request("/rest/api/3/issueLinkType");
    return response.body && JSON.parse(response.body)?.issueLinkTypes;
  }

  async getIssueFields(): Promise<JiraIssueField[]> {
    let response = await this._AP.request("/rest/api/3/field");
    return response.body && JSON.parse(response.body);
  }

  async getIssueById(issueId: string, query: string): Promise<JiraIssueFull> {
    const response = await this._AP.request(
      `/rest/api/3/issue/${issueId}${query}`
    );
    return response.body && JSON.parse(response.body);
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

    const response = await this._AP.request({
      type: "POST",
      contentType: "application/json",
      url: "/rest/api/3/search",
      data: JSON.stringify(data),
    });
    return response.body && JSON.parse(response.body);

  }

  getCurrentIssueId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._AP.context.getContext((res) => {
        let issueId = res?.jira?.issue?.id;
        if (issueId) {
          return resolve(issueId);
        }
        reject(new Error("Error in fetching the current issue key."));
      });
    });
  }

  async getFilters(): Promise<JiraFiltersResponse> {
    let response = await this._AP.request("/rest/api/3/filter/search");
    return response.body && JSON.parse(response.body);
  }

  getCurrentProjectKey(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._AP.context.getContext((res) => {
        if (res && res.jira) {
          resolve(res.jira.project?.key);
        } else {
          reject("Project key not found in context.");
        }
      });
    });
  }

  async getProject(projectKey?: string): Promise<JiraProject> {
    let response = await this._AP.request(`/rest/api/3/project/${projectKey}`);
    return response.body && JSON.parse(response.body);
  }
}
