import LXPAPI, {
  Filter,
  Issue,
  IssueField,
  IssueLink,
  IssueLinkType,
  IssuePriority,
  IssueStatus,
  IssueType,
  IssueWithLinkedIssues,
  Project
} from "../types/api";

import {
  JiraIssue,
  JiraIssueFull,
  JiraIssueLink,
  JiraIssuePriority,
  JiraIssuePriorityFull,
  JiraIssueSearchResult,
  JiraIssueStatus,
  JiraIssueType,
  JiraLinkType
} from "../types/jira";

import {
  getQueryParam
} from "../util/index";

function throwError(msg: string) {
  throw new Error(msg);
}

export default class CloudImpl implements LXPAPI {

  // @ts-ignore
  private _AP: any  = AP;
  private defaultFields: string[] = [
    "summary",
    "subtasks",
    "parent",
    "issuelinks",
    "issuetype",
    "priority",
    "status",
  ];

  hasValidLicense(): boolean {
    const lic = getQueryParam("lic");
    return !(lic && "none" === lic);
  }

  getJiraBaseURL(): string {
    return getQueryParam("xdm_e") as string;
  }

  private _convertPriority(priority: JiraIssuePriority | JiraIssuePriorityFull): IssuePriority {
    return {
      id: priority.id,
      name: priority.name,
      description: (priority as JiraIssuePriorityFull).description,
      iconUrl: priority.iconUrl,
      statusColor: (priority as JiraIssuePriorityFull).statusColor
    }
  }

  async getPriorities(): Promise < IssuePriority[] > {
    try {
      let response = await this._AP.request("/rest/api/3/priority");
      let items: JiraIssuePriorityFull[] = (response.body && JSON.parse(response.body));

      items || throwError("Issue priorities not found.");

      return items.map((item) => this._convertPriority(item));
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue priorities - " + error.message);
    }
  }

  private _convertIssueType(issueType: JiraIssueType): IssueType {
    return {
      id: issueType.id,
      name: issueType.name,
      description: issueType.description,
      iconUrl: issueType.iconUrl
    }
  }

  async getIssueTypes(): Promise < IssueType[] > {
    try {
      let response = await this._AP.request("/rest/api/3/issuetype");
      let items: JiraIssueType[] = (response.body && JSON.parse(response.body)) 
      
      items || throwError("Issue types not found.");

      return items.map((item) => this._convertIssueType(item));
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getIssueLinkTypes(): Promise < IssueLinkType[] > {
    try {
      let response = await this._AP.request("/rest/api/3/issueLinkType");
      let items: JiraLinkType[] = (response.body && JSON.parse(response.body) ?.issueLinkTypes);
      
      items || throwError("Issue link types not found.");
      
      return items.map((item) => {
        return {
          id: item.id,
          name: item.name
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue link types - " + error.message);
    }
  }

  async getIssueFields(): Promise < IssueField[] > {
    try {
      let response = await this._AP.request("/rest/api/3/field");
      let items = (response.body && JSON.parse(response.body)) || throwError("Issue fields not found.");
      return items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          key: item.key,
          customkey: item.customKey
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getIssueWithLinks(issueId ? : string, fields ? : string[]): Promise < IssueWithLinkedIssues > {
    issueId = issueId || await this.getCurrentIssueId();
    const issue: Issue = await this.getIssueById(issueId);
    let linkedIds = issue.links.map((link) => link.issueId);
    let linkedIssues: Issue[] = [];
    if(linkedIds.length){
      linkedIssues = await this.searchIssues(`id in (${linkedIds})`, undefined, undefined, fields);
    }

    return { ...issue, linkedIssues };
  }

  getCurrentIssueId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._AP.context.getContext((res) => {
        let issueId = res?.jira?.issue?.id;
        if(issueId){
          return resolve(issueId);
        }
        reject(new Error("Error in fetching the current issue key."));
      });
    });
  }

  private _convertIssueStatus(status: JiraIssueStatus): IssueStatus {
    return {
      id: status.id,
      name: status.name,
      description: status.description,
      iconUrl: status.iconUrl,
      statusColor: status.statusCategory?.colorName
    };
  }

  private _convertLinks(issueLinks: JiraIssueLink[], subTasks: JiraIssue[]): IssueLink[] {
    let result: IssueLink[] = [];
    for(let subTask of subTasks){
      result.push({
        id: "SUBTASK", //TODO
        name: "SUBTASK",
        isInward: false,
        issueId: subTask.id
      });
    }

    for(let issueLink of issueLinks){
      result.push({
        id: issueLink.id,
        name: issueLink.type.name,
        isInward: issueLink.inwardIssue ? true : false,
        issueId: (issueLink.inwardIssue || issueLink.outwardIssue)?.id || ""
      });
    }

    return result;
  }

  private _convertIssue(issue: JiraIssueFull): Issue {
    return {
      id: issue.id,
      issueKey: issue.key,
      summary: issue.fields?.summary,
      priority: this._convertPriority(issue.fields?.priority),
      type: this._convertIssueType(issue.fields?.issuetype),
      status: this._convertIssueStatus(issue.fields?.status),
      links: this._convertLinks(issue.fields?.issuelinks || [], issue.fields?.subtasks || [])
    }
  }

  async getIssueById(issueId ?: string, fields ?: string[]): Promise < Issue > {
    try {
      issueId = issueId || await this.getCurrentIssueId();
      fields = fields || this.defaultFields;

      const query = "?fields=" + fields.join(',');
      const response = await this._AP.request(`/rest/api/3/issue/${issueId}${query}`);
      const issue: JiraIssueFull = response.body && JSON.parse(response.body);
      
      issue || throwError("Issue not found.");

      return this._convertIssue(issue);
    } catch (error) {
      console.error(error);
      throw new Error(`Error in fetching the issue ${issueId} -   ${error.message}`);
    }
  }

  async searchIssues(jql: string, start?: number, max?: number, fields?: string[]): Promise<Issue[]> {
    try {
      const data = {
        fields: fields ?? this.defaultFields,
        startAt: start ?? 0,
        maxResults: max ?? 500,
        jql
      };
  
      let issues: JiraIssueSearchResult = await this._AP.request({
        type: "POST",
        contentType: "application/json",
        url: "/rest/api/3/search",
        data: JSON.stringify(data)
      });
  
      let result: Issue[] = [];
      const jiraIssues = issues && issues.issues || [];
      for(let issue of jiraIssues){
        result.push(this._convertIssue(issue));
      }
      return result;
    } catch(error) {
      console.error(error);
      throw new Error("Error in searching issues: " + error.message);
    }
  }

  getFilters(): Promise < Filter[] > {
    throw new Error("Method not implemented.");
  }

  private _convertProject(project){
    return project;
  }

  async getCurrentProject(projectKey?: string): Promise < Project > {
    try {
      const getProjectKey = () => {
        return new Promise<string>((resolve, reject) => {
          this._AP.context.getContext((res) => {
            if (res && res.jira) {
              resolve(res.jira.project?.key);
            } else {
              reject("Project key not found in context.");
            }
          });
        });
      };
      projectKey = projectKey || (await getProjectKey());
      let response = await this._AP.request(`/rest/api/3/project/${projectKey}`);
      let project = (response.body && JSON.parse(response.body)) || throwError("Project not found.");
      return this._convertProject(project);
    } catch(error) {
      console.error(error);
      throw new Error("Error in fetching project: " + error.message);
    }
  }
}