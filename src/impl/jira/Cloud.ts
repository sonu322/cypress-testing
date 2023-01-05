import i18n from "../../../i18n";
import {
  JiraAPI,
  JiraFiltersResponse,
  JiraIssueField,
  JiraIssueFull,
  JiraIssuePriorityFull,
  JiraIssueSearchResult,
  JiraIssueType,
  JiraLinkType,
  JiraMyself,
  JiraProject,
  HelpLinks,
  JiraAutoCompleteResult,
} from "../../types/jira";

import { getQueryParam } from "../../util/index";

export default class JiraCloudImpl implements JiraAPI {
  // @ts-ignore
  private _AP: any = AP;

  isJiraCloud(): boolean {
    return true;
  }

  hasValidLicense(): boolean {
    const lic = getQueryParam("lic");
    return !(lic && "none" === lic);
  }

  getJiraBaseURL(): string {
    return getQueryParam("xdm_e") as string;
  }

  async getMyself(): Promise<JiraMyself> {
    let response = await this._AP.request("/rest/api/3/myself");
    return response.body && JSON.parse(response.body);
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
        const message = i18n.t("lxp.jira.current-issuekey-error");
        reject(new Error(message));
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
          const message = i18n.t("lxp.api.project-error");
          reject(message);
        }
      });
    });
  }

  async getProject(projectKey?: string): Promise<JiraProject> {
    let response = await this._AP.request(`/rest/api/3/project/${projectKey}`);
    return response.body && JSON.parse(response.body);
  }

  getHelpLinks(): HelpLinks {
    return {
      issueTree: "https://optimizory.atlassian.net/l/cp/xj7rXies",
      traceability: "https://optimizory.atlassian.net/l/cp/77caidqE"
    };
  }

  async getAutoCompleteData(): Promise<JiraAutoCompleteResult> {
    const response = await this._AP.request("/rest/api/3/jql/autocompletedata");
    return response.body && JSON.parse(response.body);
  }

  async getAutoCompleteSuggestions(query: string): Promise<JiraAutoCompleteSuggestionsResult> {
    const response = await this._AP.request("/rest/api/3/jql/autocompletedata/suggestions?" + query);
    return response.body && JSON.parse(response.body);
  }
}
