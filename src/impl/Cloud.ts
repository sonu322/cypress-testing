import LXPAPI, {
  CustomLinkType,
  Filter,
  Issue,
  IssueField,
  IssueLink,
  IssueLinkType,
  IssuePriority,
  IssueStatus,
  IssueType,
  IssueUser,
  IssueVersion,
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
  JiraLinkType,
  JiraProject,
  JiraIssueField,
  JiraAssignee,
  JiraVersion
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
    "assignee",
    "resolution",
    "fixVersions",
    "issuekey"
  ];

  private requiredFields: string[] = [
    "subtasks",
    "parent",
    "issuelinks",
    "resolution",
    "issuekey",
    "priority",
    "issuetype"
  ];

  hasValidLicense(): boolean {
    const lic = getQueryParam("lic");
    return !(lic && "none" === lic);
  }

  getJiraBaseURL(): string {
    return getQueryParam("xdm_e") as string;
  }

  private _convertPriority(priority: JiraIssuePriority | JiraIssuePriorityFull): IssuePriority {
    if(priority){
      return {
        id: priority.id,
        name: priority.name,
        description: (priority as JiraIssuePriorityFull).description,
        iconUrl: priority.iconUrl,
        statusColor: (priority as JiraIssuePriorityFull).statusColor
      }
    }
    return null;
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
    if(issueType){
      return {
        id: issueType.id,
        name: issueType.name,
        description: issueType.description,
        iconUrl: issueType.iconUrl
      }
    }
    return null;
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
      
      let result = items.map((item) => {
        return {
          id: item.id,
          name: item.name
        }
      });
      result.push({
        id: CustomLinkType.SUBTASK,
        name: "Subtasks"
      });
      result.push({
        id: CustomLinkType.PARENT,
        name: "Parent"
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue link types - " + error.message);
    }
  }

  async addCustomFields(issueFields: IssueField[], fields?: JiraIssueField[]): Promise< string > {
    let project = await this.getCurrentProject();
    fields = fields || await this.getAllIssueFields();
    let storyPointFieldName = "storypointestimate";
    if(project.style === "classic"){
      storyPointFieldName = "storypoints";
    }
    let storyPointsFieldId: string, sprintFieldId: string;
    for(let field of fields){
      let name = field.name.toLowerCase().replace(/ /g, "");
      if(name === storyPointFieldName){
        storyPointsFieldId = field.id;
      } else if(name === "sprints"){
        sprintFieldId = field.id;
      }
    }
    if(storyPointsFieldId){
      issueFields.push({
        id: "storyPoints",
        name: "Story Points",
        jiraId: storyPointsFieldId
      });
    }
    if(sprintFieldId){
      issueFields.push({
        id: "sprints",
        name: "Sprint",
        jiraId: sprintFieldId
      });
    }
    return null;
  }

  async getIssueFields(): Promise < IssueField[] > {
    try {
      let result: IssueField[] = [];
      let issueFields: IssueField[] = [
        {
          id: "summary",
          name: "Summary",
          jiraId: "summary"
        },
        {
          id: "status",
          name: "Status",
          jiraId: "status"
        },
        {
          id: "issueType",
          name: "Issue Type",
          jiraId: "issuetype"
        },
        {
          id: "priority",
          name: "Priority",
          jiraId: "priority"
        },
        {
          id: "assignee",
          name: "Assignee",
          jiraId: "assignee"
        },
      ];
      
      let fields = await this.getAllIssueFields();
      await this.addCustomFields(issueFields, fields);
      let fieldMap = {};
      issueFields.forEach((issueField) => {
        fieldMap[issueField.jiraId] = issueField;
      });

      for(let field of fields){
        if(fieldMap[field.key]){
          result.push(fieldMap[field.key]);
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getAllIssueFields(): Promise < JiraIssueField[] > {
    try {
      let response = await this._AP.request("/rest/api/3/field");
      return (response.body && JSON.parse(response.body)) || throwError("Issue fields not found.");
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getIssueWithLinks(fields: IssueField[], issueId ? : string): Promise < IssueWithLinkedIssues > {
    issueId = issueId || await this.getCurrentIssueId();
    const issue: Issue = await this.getIssueById(fields, issueId);
    let linkedIds = issue.links.map((link) => link.issueId);
    let linkedIssues: Issue[] = [];
    if(linkedIds && linkedIds.length){
      linkedIssues = await this.searchIssues(`id in (${linkedIds})`, fields);
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
    if(status){
      return {
        id: status.id,
        name: status.name,
        description: status.description,
        iconUrl: status.iconUrl,
        statusColor: status.statusCategory?.colorName
      };
    }
    return null;
  }

  private _convertLinks(issueLinks: JiraIssueLink[], subTasks: JiraIssue[], parent: JiraIssue): IssueLink[] {
    let result: IssueLink[] = [];
    for(let subTask of subTasks){
      result.push({
        linkTypeId: CustomLinkType.SUBTASK,
        name: "Subtasks",
        isInward: false,
        issueId: subTask.id
      });
    }

    if(parent){
      result.push({
        linkTypeId: CustomLinkType.PARENT,
        name: "Parent",
        isInward: true,
        issueId: parent.id
      })
    }

    for(let issueLink of issueLinks){
      const isInward = issueLink.inwardIssue ? true : false;
      result.push({
        linkTypeId: issueLink.type.id,
        name: isInward ? issueLink.type.inward : issueLink.type.outward,
        isInward,
        issueId: (issueLink.inwardIssue || issueLink.outwardIssue)?.id || ""
      });
    }
    return result;
  }

  private _convertIssueAssignee(assignee: JiraAssignee): IssueUser {
    if(assignee){
      return {
        displayName: assignee.displayName,
        active: assignee.active,
        avatarUrl: assignee.avatarUrls["48x48"]
      };
    }
    return null;
  }

  private _convertVersions(versions: JiraVersion[]): IssueVersion[] {
    let result = [];
    for(let version of versions){
      result.push({
        id: version.id,
        name: version.name,
        archived: version.archived,
        released: version.released,
        releaseDate: version.releaseDate
      });
    }
    
    return result;
  }

  private _convertIssue(issue: JiraIssueFull, fields: IssueField[]): Issue {
    let sprintFieldId, storyPointsFieldId;
    if(fields && fields.length){
      for(let field of fields){
        if(field.id === "storyPoints"){
          storyPointsFieldId = field.jiraId;
        } else if(field.id === "sprints"){
          sprintFieldId = field.jiraId;
        }
      }
    }
    return {
      id: issue.id,
      issueKey: issue.key,
      summary: issue.fields?.summary,
      priority: this._convertPriority(issue.fields?.priority),
      type: this._convertIssueType(issue.fields?.issuetype),
      status: this._convertIssueStatus(issue.fields?.status),
      links: this._convertLinks(
        issue.fields?.issuelinks || [], issue.fields?.subtasks || [], issue.fields.parent),
      assignee: this._convertIssueAssignee(issue.fields.assignee),
      fixVersions: this._convertVersions(issue.fields.fixVersions || []),
      isResolved: issue.fields.resolution ? true : false,
      storyPoints: storyPointsFieldId ? issue.fields[storyPointsFieldId]: null,
      sprints: sprintFieldId ? issue.fields[sprintFieldId] : null,
    }
  }

  private _getFieldIds(fields: IssueField[]): string[] {
    let fieldIds = [];
    if(fields){
      fieldIds = fields.map((field) => field.jiraId);
      fieldIds = [ ...fieldIds, ...this.requiredFields];
    } else {
      fieldIds = this.defaultFields;
    }
    return fieldIds;
  }

  async getIssueById(fields: IssueField[], issueId ?: string): Promise < Issue > {
    try {
      issueId = issueId || await this.getCurrentIssueId();
      const fieldIds = this._getFieldIds(fields);

      const query = "?fields=" + fieldIds.join(',');
      const response = await this._AP.request(`/rest/api/3/issue/${issueId}${query}`);
      const issue: JiraIssueFull = response.body && JSON.parse(response.body);
      
      issue || throwError("Issue not found.");

      return this._convertIssue(issue, fields);
    } catch (error) {
      console.error(error);
      throw new Error(`Error in fetching the issue ${issueId} - ${error.message}`);
    }
  }

  async searchIssues(jql: string, fields: IssueField[], start?: number, max?: number): Promise<Issue[]> {
    try {
      const fieldIds = this._getFieldIds(fields);
      const data = {
        fields: fieldIds,
        startAt: start ?? 0,
        maxResults: max ?? 500,
        jql
      };
  
      const response = await this._AP.request({
        type: "POST",
        contentType: "application/json",
        url: "/rest/api/3/search",
        data: JSON.stringify(data)
      });
      let issues: JiraIssueSearchResult = response.body && JSON.parse(response.body);
  
      let result: Issue[] = [];
      const jiraIssues = issues?.issues || [];
      for(let issue of jiraIssues){
        result.push(this._convertIssue(issue, fields));
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

  private _convertProject(project: JiraProject): Project {
    return {
      style: project.style
    };
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
      let project: JiraProject = (response.body && JSON.parse(response.body)) || throwError("Project not found.");
      return this._convertProject(project);
    } catch(error) {
      console.error(error);
      throw new Error("Error in fetching project: " + error.message);
    }
  }
}