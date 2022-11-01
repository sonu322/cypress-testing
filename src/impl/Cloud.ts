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
  IssueWithPopulatedLinks,
  Project,
} from "../types/api";

import {
  JiraFilter,
  JiraFiltersResponse,
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
  JiraVersion,
} from "../types/jira";

import {getQueryParam} from "../util/index";
import {
  getJQLStringFromIds,
  getLinkedIssueIds,
} from "../util/tracebilityReportsUtils";

function throwError(msg: string) {
  throw new Error(msg);
}

export default class CloudImpl implements LXPAPI {
  // @ts-ignore
  private readonly _AP: any = AP;
  private readonly defaultFields: string[] = [
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
    "issuekey",
  ];

  private readonly requiredFields: string[] = [
    "subtasks",
    "parent",
    "issuelinks",
    "resolution",
    "issuekey",
    "priority",
    "issuetype",
  ];

  hasValidLicense(): boolean {
    const lic = getQueryParam("lic");
    return !(lic && "none" === lic);
  }

  getJiraBaseURL(): string {
    return getQueryParam("xdm_e") as string;
  }

  private _convertPriority(
    priority: JiraIssuePriority | JiraIssuePriorityFull
  ): IssuePriority {
    if (priority) {
      return {
        id: priority.id,
        name: priority.name,
        description: (priority as JiraIssuePriorityFull).description,
        iconUrl: priority.iconUrl,
        statusColor: (priority as JiraIssuePriorityFull).statusColor,
      };
    }
    return null;
  }

  async getPriorities(): Promise<IssuePriority[]> {
    try {
      const response = await this._AP.request("/rest/api/3/priority");
      const items: JiraIssuePriorityFull[] =
        response.body && JSON.parse(response.body);

      items || throwError("Issue priorities not found.");

      return items.map((item) => this._convertPriority(item));
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error in fetching the issue priorities - " + error.message
      );
    }
  }

  private _convertIssueType(issueType: JiraIssueType): IssueType {
    if (issueType) {
      return {
        id: issueType.id,
        name: issueType.name,
        description: issueType.description,
        iconUrl: issueType.iconUrl,
      };
    }
    return null;
  }

  async getIssueTypes(): Promise<IssueType[]> {
    try {
      const response = await this._AP.request("/rest/api/3/issuetype");
      const items: JiraIssueType[] = response.body && JSON.parse(response.body);

      items || throwError("Issue types not found.");

      return items.map((item) => this._convertIssueType(item));
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getIssueLinkTypes(): Promise<IssueLinkType[]> {
    try {
      const response = await this._AP.request("/rest/api/3/issueLinkType");
      const items: JiraLinkType[] =
        response.body && JSON.parse(response.body)?.issueLinkTypes;

      items || throwError("Issue link types not found.");

      const result = [];
      result.push({
        id: CustomLinkType.PARENT,
        name: "Parent",
      });
      result.push({
        id: CustomLinkType.SUBTASK,
        name: "Subtasks",
      });

      items.forEach((item) => {
        result.push({
          id: `${item.id}-${item.inward}`,
          name: item.inward,
        });
        if (item.inward !== item.outward) {
          result.push({
            id: `${item.id}-${item.outward}`,
            name: item.outward,
          });
        }
      });
      
      
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error in fetching the issue link types - " + error.message
      );
    }
  }

  async addCustomFields(
    issueFields: IssueField[],
    fields?: JiraIssueField[]
  ): Promise<string> {
    const project = await this.getCurrentProject();
    fields = fields || (await this.getAllIssueFields());
    let storyPointFieldName = "storypointestimate";
    if (project.style === "classic") {
      storyPointFieldName = "storypoints";
    }
    let storyPointsFieldId: string, sprintFieldId: string;
    for (const field of fields) {
      const name = field.name.toLowerCase().replace(/ /g, "");
      if (name === storyPointFieldName) {
        storyPointsFieldId = field.id;
      } else if (name === "sprints") {
        sprintFieldId = field.id;
      }
    }
    if (storyPointsFieldId) {
      issueFields.push({
        id: "storyPoints",
        name: "Story Points",
        jiraId: storyPointsFieldId,
      });
    }
    if (sprintFieldId) {
      issueFields.push({
        id: "sprints",
        name: "Sprint",
        jiraId: sprintFieldId,
      });
    }
    return null;
  }

  async getIssueFields(): Promise<IssueField[]> {
    try {
      const result: IssueField[] = [];
      const issueFields: IssueField[] = [
        {
          id: "summary",
          name: "Summary",
          jiraId: "summary",
        },
        {
          id: "status",
          name: "Status",
          jiraId: "status",
        },
        {
          id: "issueType",
          name: "Issue Type",
          jiraId: "issuetype",
        },
        {
          id: "priority",
          name: "Priority",
          jiraId: "priority",
        },
        {
          id: "assignee",
          name: "Assignee",
          jiraId: "assignee",
        },
      ];

      const fields = await this.getAllIssueFields();
      await this.addCustomFields(issueFields, fields);
      const fieldMap = {};
      issueFields.forEach((issueField) => {
        fieldMap[issueField.jiraId] = issueField;
      });

      for (const field of fields) {
        if (fieldMap[field.key]) {
          result.push(fieldMap[field.key]);
        }
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getAllIssueFields(): Promise<JiraIssueField[]> {
    try {
      const response = await this._AP.request("/rest/api/3/field");
      return (
        (response.body && JSON.parse(response.body)) ||
        throwError("Issue fields not found.")
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getIssueWithLinks(
    fields: IssueField[],
    issueId?: string
  ): Promise<IssueWithLinkedIssues> {
    issueId = issueId || (await this.getCurrentIssueId());
    const issue: Issue = await this.getIssueById(fields, issueId);
    const linkedIds = issue.links.map((link) => link.issueId);
    let linkedIssues: Issue[] = [];
    if (linkedIds && linkedIds.length) {
      const result = await this.searchIssues(`id in (${linkedIds})`, fields);
      linkedIssues = result.data;
    }

    return {...issue, linkedIssues};
  }

  getCurrentIssueId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._AP.context.getContext((res) => {
        const issueId = res?.jira?.issue?.id;
        if (issueId) {
          return resolve(issueId);
        }
        reject(new Error("Error in fetching the current issue key."));
      });
    });
  }

  private _convertIssueStatus(status: JiraIssueStatus): IssueStatus {
    if (status) {
      return {
        id: status.id,
        name: status.name,
        description: status.description,
        iconUrl: status.iconUrl,
        statusColor: status.statusCategory?.colorName,
      };
    }
    return null;
  }

  private _convertLinks(
    issueLinks: JiraIssueLink[],
    subTasks: JiraIssue[],
    parent: JiraIssue
  ): IssueLink[] {
    const result: IssueLink[] = [];
    for (const subTask of subTasks) {
      result.push({
        linkTypeId: CustomLinkType.SUBTASK,
        name: "Subtasks",
        isInward: false,
        issueId: subTask.id,
      });
    }

    if (parent) {
      result.push({
        linkTypeId: CustomLinkType.PARENT,
        name: "Parent",
        isInward: true,
        issueId: parent.id,
      });
    }

    for (const issueLink of issueLinks) {
      const isInward = issueLink.inwardIssue ? true : false;
      result.push({
        linkTypeId: issueLink.type.id,
        name: isInward ? issueLink.type.inward : issueLink.type.outward,
        isInward,
        issueId: (issueLink.inwardIssue || issueLink.outwardIssue)?.id || "",
      });
    }
    return result;
  }

  private _convertIssueAssignee(assignee: JiraAssignee): IssueUser {
    if (assignee) {
      return {
        displayName: assignee.displayName,
        active: assignee.active,
        avatarUrl: assignee.avatarUrls["48x48"],
      };
    }
    return null;
  }

  private _convertVersions(versions: JiraVersion[]): IssueVersion[] {
    const result = [];
    for (const version of versions) {
      result.push({
        id: version.id,
        name: version.name,
        archived: version.archived,
        released: version.released,
        releaseDate: version.releaseDate,
      });
    }

    return result;
  }

  private _convertIssue(issue: JiraIssueFull, fields: IssueField[]): Issue {
    let sprintFieldId, storyPointsFieldId;
    if (fields && fields.length) {
      for (const field of fields) {
        if (field.id === "storyPoints") {
          storyPointsFieldId = field.jiraId;
        } else if (field.id === "sprints") {
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
        issue.fields?.issuelinks || [],
        issue.fields?.subtasks || [],
        issue.fields.parent
      ),
      assignee: this._convertIssueAssignee(issue.fields.assignee),
      fixVersions: this._convertVersions(issue.fields.fixVersions || []),
      isResolved: issue.fields.resolution ? true : false,
      storyPoints: storyPointsFieldId ? issue.fields[storyPointsFieldId] : null,
      sprints: sprintFieldId ? issue.fields[sprintFieldId] : null,
    };
  }

  private _getFieldIds(fields: IssueField[]): string[] {
    let fieldIds = [];
    if (fields) {
      fieldIds = fields.map((field) => field.jiraId);
      fieldIds = [...fieldIds, ...this.requiredFields];
    } else {
      fieldIds = this.defaultFields;
    }
    return fieldIds;
  }

  async getIssueById(fields: IssueField[], issueId?: string): Promise<Issue> {
    try {
      issueId = issueId || (await this.getCurrentIssueId());
      const fieldIds = this._getFieldIds(fields);

      const query = "?fields=" + fieldIds.join(",");
      const response = await this._AP.request(
        `/rest/api/3/issue/${issueId}${query}`
      );
      const issue: JiraIssueFull = response.body && JSON.parse(response.body);

      issue || throwError("Issue not found.");

      return this._convertIssue(issue, fields);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error in fetching the issue ${issueId} - ${error.message}`
      );
    }
  }

  async searchIssues(
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ): Promise<{data: Issue[]; total: number}> {
    try {
      const fieldIds = this._getFieldIds(fields);
      const data = {
        fields: fieldIds,
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
      const issues: JiraIssueSearchResult =
        response.body && JSON.parse(response.body);

      const result: Issue[] = [];
      const total = issues.total;
      const jiraIssues = issues?.issues || [];
      for (const issue of jiraIssues) {
        result.push(this._convertIssue(issue, fields));
      }
      return {data: result, total};
    } catch (error) {
      console.error(error);
      throw new Error("Error in searching issues: " + error.message);
    }
  }

  private readonly _getLinkedIssueJQL = (
    issues: Issue[]
  ): {jqlString: string; total: number} => {
    const ids: string[] = [];
    issues.forEach((issue) => {
      issue.links.forEach((link) => {
        const {issueId} = link;
        if (!ids.includes(issueId)) {
          ids.push(issueId);
        }
      });
    });
    const jqlComponents = ids.map((id) => `id=${id}`);
    const jqlString = jqlComponents.join(" OR ");
    const total = ids.length;
    return {jqlString, total};
  };

  private readonly _populateIssueLinks = (
    issues: IssueWithPopulatedLinks[],
    linkedIssues: Issue[]
  ): IssueWithPopulatedLinks[] => {
    const populatedIssues: IssueWithPopulatedLinks[] = [];
    issues.forEach((issue) => {
      issue.links.forEach((link) => {
        const linkedIssue = linkedIssues.find(
          (linkedIssue) => linkedIssue.id === link.issueId
        );
        link.issue = linkedIssue;
      });
      populatedIssues.push(issue);
    });
    return populatedIssues;
  };

  async searchLinkedIssues(
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ): Promise<{data: IssueWithPopulatedLinks[]; total: number}> {
    const searchResult = await this.searchIssues(jql, fields, start, max);
    console.log("searchLinkedIssues");
    const issues: IssueWithPopulatedLinks[] = searchResult.data;
    const {jqlString: linkedIssuesJQL, total} = this._getLinkedIssueJQL(issues);
    console.log("realatedIsuesJql");
    console.log(linkedIssuesJQL);
    console.log([...issues]);
    const linkedIssuesResult = await this.searchIssues(
      linkedIssuesJQL,
      fields,
      0,
      total
    );
    console.log("realted issues result");
    const linkedIssues = linkedIssuesResult.data;
    console.log([...linkedIssues]);
    const populatedIssues = this._populateIssueLinks(issues, linkedIssues);
    console.log("populatedIssues!!!!!!!!!!!!!!!!!!!!");
    console.log(populatedIssues);
    // const oldIssueIds = getAllRelatedIssueIds(data);
    // let newIssueIds = getAllRelatedIssueIds(issues);
    // newIssueIds = newIssueIds.filter((id) => {
    //   return !oldIssueIds.includes(id);
    // });
    return {data: populatedIssues, total};
  }

  private _convertFilter(filter: JiraFilter): Filter {
    return {
      ...filter,
      id: `filter=${filter.id}`,
    };
  }

  async getFilters(): Promise<Filter[]> {
    try {
      const response = await this._AP.request("/rest/api/3/filter/search");
      const filtersResponseData: JiraFiltersResponse =
        response.body && JSON.parse(response.body);

      filtersResponseData;

      return filtersResponseData.values.map((item) =>
        this._convertFilter(item)
      );
    } catch (error) {
      console.error(error);
      let message = "Error in fetching the issue filters ";
      if (error.message) {
        message += " - " + error.message;
      }
      throw new Error(message);
    }
  }

  private _convertProject(project: JiraProject): Project {
    return {
      style: project.style,
    };
  }

  async getCurrentProject(projectKey?: string): Promise<Project> {
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
      const response = await this._AP.request(
        `/rest/api/3/project/${projectKey}`
      );
      const project: JiraProject =
        (response.body && JSON.parse(response.body)) ||
        throwError("Project not found.");
      return this._convertProject(project);
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching project: " + error.message);
    }
  }
}