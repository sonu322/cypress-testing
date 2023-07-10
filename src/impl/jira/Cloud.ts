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
  // @ts-expect-error
  private readonly _AP: any = AP;

  isJiraCloud(): boolean {
    return true;
  }

  async linkIssueType(
    inwardIssueKey: string,
    jiraLinkTypeId: string,
    outwardIssueKey: string
  ): Promise<void> {
    const linkIssueBody = {
      inwardIssue: {
        key: inwardIssueKey,
      },
      outwardIssue: {
        key: outwardIssueKey,
      },
      type: {
        id: jiraLinkTypeId,
      },
    };
    await this._AP.request({
      url: "/rest/api/3/issueLink",
      type: "POST",
      contentType: "application/json",

      data: JSON.stringify(linkIssueBody),
    });
  }

  async checkIssueLinkExists(
    inwardIssueKey: string,
    jiraLinkTypeId: string,
    outwardIssueKey: string
  ): Promise<boolean> {
    try {
      const inwardIssue = await this.getIssueById(
        inwardIssueKey,
        "?fields=issuelinks"
      );
      const outwardIssue = await this.getIssueById(
        outwardIssueKey,
        "?fields=issuelinks"
      );

      if (
        inwardIssue &&
        inwardIssue.fields &&
        inwardIssue.fields.issuelinks &&
        outwardIssue &&
        outwardIssue.fields &&
        outwardIssue.fields.issuelinks
      ) {
        const linkExists = inwardIssue.fields.issuelinks.some((link) => {
          return (
            link.type &&
            link.type.id === jiraLinkTypeId &&
            link.outwardIssue &&
            link.outwardIssue.key === outwardIssueKey
          );
        });

        return linkExists;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  hasValidLicense(): boolean {
    const lic = getQueryParam("lic");
    return !(lic && lic === "none");
  }

  getJiraBaseURL(): string {
    return getQueryParam("xdm_e");
  }

  async getMyself(): Promise<JiraMyself> {
    const response = await this._AP.request("/rest/api/3/myself");
    return response?.body && JSON.parse(response.body);
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
      maxResults: max ?? 100,
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
    return new Promise((resolve, reject) => {
      this._AP.context.getContext((res) => {
        let issueId = res?.jira?.issue?.id;
        if (issueId) {
          return resolve(issueId);
        }
        const message = i18n.t("otpl.lxp.jira.current-issuekey-error");
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
          const message = i18n.t("otpl.lxp.api.project-error");
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
      issueTree: "https://optimizory.atlassian.net/l/cp/1R9sKugt",
      traceability: "https://optimizory.atlassian.net/l/cp/bweX21AS",
    };
  }

  async getAutoCompleteData(): Promise<JiraAutoCompleteResult> {
    const response = await this._AP.request("/rest/api/3/jql/autocompletedata");
    return response.body && JSON.parse(response.body);
  }

  async getAutoCompleteSuggestions(
    query: string
  ): Promise<JiraAutoCompleteSuggestionsResult> {
    const response = await this._AP.request(
      "/rest/api/3/jql/autocompletedata/suggestions?" + query
    );
    return response.body && JSON.parse(response.body);
  }

  getDashboardGadgetConfig = async (
    dashboardId: string,
    dashboardItemId: string
  ): Promise<any> => {
    const response = await this._AP.request({
      url: `/rest/api/3/dashboard/${dashboardId}/items/${dashboardItemId}/properties/config`,
    });
    const data = JSON.parse(response.body);
    return data;
  };

  editDashboardItemProperty = async (
    dashboardId: string,
    dashboardItemId: string,
    propertyKey: string,
    propertyValue: Object
  ): Promise<void> => {
    await this._AP.request({
      url: `/rest/api/3/dashboard/${dashboardId}/items/${dashboardItemId}/properties/config`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(propertyValue),
    });
  };

  editDashboardItemTitle = async (
    dashboardId: string,
    dashboardItemId: string,
    title: string
  ): Promise<void> => {
    await this._AP.request({
      url: `/rest/api/3/dashboard/${dashboardId}/gadget/${dashboardItemId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ title }),
    });
  };

  resizeWindow(width: string | number, height: string | number): void {
    this._AP.resize(width, height);
  }
}
