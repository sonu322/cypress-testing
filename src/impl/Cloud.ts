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
  IssueWithSortedLinks,
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
  JiraAPI,
} from "../types/jira";

function throwError(msg: string) {
  throw new Error(msg);
}
// use secondary id field
export default class APIImpl implements LXPAPI {
  private readonly api: JiraAPI;
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

  constructor(api: JiraAPI) {
    this.api = api;
  }

  hasValidLicense(): boolean {
    return this.api.hasValidLicense();
  }

  getJiraBaseURL(): string {
    return this.api.getJiraBaseURL();
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
      const items: JiraIssuePriorityFull[] = await this.api.getPriorities();
      items || throwError("Issue priorities not found.");

      return items.map((item) => this._convertPriority(item));
    } catch (error) {
      console.error(error);
      let msg = "Error in fetching the issue priorities";
      msg += error.message ? " - " + error.message : ".";
      throw new Error(msg);
    }
  }

  private _convertIssueType(issueType: JiraIssueType): IssueType {
    if (issueType) {
      const name = issueType.name.toLowerCase().replace(/-/g, "");
      return {
        id: name,
        name: issueType.name,
        description: issueType.description,
        iconUrl: issueType.iconUrl,
      };
    }
    return null;
  }

  async getIssueTypes(): Promise<IssueType[]> {
    try {
      const items: JiraIssueType[] = await this.api.getIssueTypes();

      items || throwError("Issue types not found.");
      const uniqueIssueTypes: IssueType[] = [];
      items.forEach((issueType) => {
        const name = issueType.name.toLowerCase().replace(/-/g, "");
        const foundType = uniqueIssueTypes.find(
          (uniqueIssueType) => uniqueIssueType.id === name
        );
        if (foundType === undefined) {
          uniqueIssueTypes.push(this._convertIssueType(issueType));
        }
      });
      return uniqueIssueTypes;
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  async getIssueLinkTypes(): Promise<IssueLinkType[]> {
    try {
      const items: JiraLinkType[] = await this.api.getIssueLinkTypes();

      items || throwError("Issue link types not found.");

      const result = [];
      result.push({
        id: CustomLinkType.PARENT,
        name: "Parent",
      });
      result.push({
        id: CustomLinkType.SUBTASK_OR_EPIC_CHILD,
        name: "Subtasks / Epic Child Issues",
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
    fields = fields || (await this.getAllIssueFields());
    const storyPointFieldName = "storypoints";
    const storyPointEstimateFieldName = "storypointestimate";

    let storyPointsFieldId: string, sprintFieldId: string;
    let storyPointEstimateFieldId: string;
    for (const field of fields) {
      const name = field.name.toLowerCase().replace(/ /g, "");
      if (name === storyPointFieldName) {
        storyPointsFieldId = field.id;
      } else if (name === storyPointEstimateFieldName) {
        storyPointEstimateFieldId = field.id;
      } else if (name === "sprints") {
        sprintFieldId = field.id;
      }
    }

    if (storyPointsFieldId !== undefined) {
      const storyPointsData: IssueField = {
        id: "storyPoints",
        name: "Story Points",
        jiraId: storyPointsFieldId,
      };
      if (storyPointEstimateFieldId !== undefined) {
        storyPointsData.secondaryJiraId = storyPointEstimateFieldId;
      }
      issueFields.push(storyPointsData);
    }

    if (sprintFieldId !== undefined) {
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
        {
          id: "fixVersions",
          name: "Fix versions",
          jiraId: "fixVersions",
        },
      ];

      const fields = await this.getAllIssueFields();
      await this.addCustomFields(issueFields, fields);
      const fieldMap = {};
      issueFields.forEach((issueField) => {
        fieldMap[issueField.jiraId] = issueField;
      });

      for (const field of fields) {
        const fieldId = field.key || field.id;
        if (fieldMap[fieldId]) {
          result.push(fieldMap[fieldId]);
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
      const fields = await this.api.getIssueFields();
      fields || throwError("Issue fields not found.");
      return fields;
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching the issue types - " + error.message);
    }
  }

  _addEpicChildrenToLinks(issue: Issue, childIssues: Issue[]): void {
    childIssues.forEach((child) => {
      issue.links.push({
        linkTypeId: CustomLinkType.SUBTASK_OR_EPIC_CHILD,
        name: "Subtasks / Epic Child Issues",
        isInward: false,
        issueId: child.id,
      });
    });
  }

  async getIssueWithLinks(
    fields: IssueField[],
    issueId?: string
  ): Promise<IssueWithLinkedIssues> {
    try {
      issueId = issueId || (await this.getCurrentIssueId());
    const issue: Issue = await this.getIssueById(fields, issueId);
    const linkedIds = issue.links.map((link) => link.issueId);
    let linkedIssues: Issue[] = [];
    // add epic children to issue
    if (issue.type.id === "epic") {
      const childIssuesData = await this.getEpicChildIssues(issue, fields);
      this._addEpicChildrenToLinks(issue, childIssuesData.data);
      linkedIssues = childIssuesData.data;
    }
    if (linkedIds && linkedIds.length) {
      const result = await this.searchIssues(`id in (${linkedIds})`, fields);
      linkedIssues = linkedIssues.concat(result.data);
    }

    return { ...issue, linkedIssues };
    } catch (error) {
      console.log(error);
      throwError(`Error fetching issue ${issueId}`);
    }
  }

  getCurrentIssueId(): Promise<string> {
    return this.api.getCurrentIssueId();
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

    if (parent) {
      result.push({
        linkTypeId: CustomLinkType.PARENT,
        name: "Parent",
        isInward: true,
        issueId: parent.id,
      });
    }
    for (const subTask of subTasks) {
      result.push({
        linkTypeId: CustomLinkType.SUBTASK_OR_EPIC_CHILD,
        name: "Subtasks / Epic Child Issues",
        isInward: false,
        issueId: subTask.id,
      });
    }

    for (const issueLink of issueLinks) {
      const isInward = issueLink.inwardIssue ? true : false;
      let id;
      if (isInward) {
        id = `${issueLink.type.id}-${issueLink.type.inward}`;
      } else {
        id = `${issueLink.type.id}-${issueLink.type.outward}`;
      }
      result.push({
        // item.id-item.outward
        linkTypeId: id,
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
    let sprintFieldId, storyPointsFieldId, storyPointEstimateFieldId;
    if (fields && fields.length) {
      for (const field of fields) {
        if (field.id === "storyPoints") {
          storyPointsFieldId = field.jiraId;
          storyPointEstimateFieldId = field.secondaryJiraId;
        } else if (field.id === "sprints") {
          sprintFieldId = field.jiraId;
        }
      }
    }

    let storyPoints: number = null;
    if (
      issue.fields[storyPointsFieldId] !== undefined &&
      issue.fields[storyPointsFieldId] !== null
    ) {
      storyPoints = issue.fields[storyPointsFieldId];
    } else if (issue.fields[storyPointEstimateFieldId] !== undefined) {
      storyPoints = issue.fields[storyPointEstimateFieldId];
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
      storyPoints,
      sprints: sprintFieldId ? issue.fields[sprintFieldId] : null,
    };
  }

  private _getFieldIds(fields: IssueField[]): string[] {
    let fieldIds = [];
    if (fields) {
      fields.forEach((field) => {
        fieldIds.push(field.jiraId);
        if (field.secondaryJiraId !== undefined) {
          fieldIds.push(field.secondaryJiraId);
        }
      });
      fieldIds = [...fieldIds, ...this.requiredFields];
    } else {
      fieldIds = this.defaultFields;
    }
    return fieldIds;
  }

  async getEpicChildIssues(
    issue: Issue,
    fields: IssueField[]
  ): Promise<{ data: Issue[]; total: number }> {
    try {
      const childIssuesData = await this.searchIssues(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `parent = ${issue.issueKey} OR "Epic Link" = ${issue.issueKey}`,
        fields
      );
      return childIssuesData;
    } catch(error) {
      console.log(error);
      throwError(`Error getting child issues of epic ${issue.issueKey}`);
    }
  }

  async getIssueById(fields: IssueField[], issueId?: string): Promise<Issue> {
    try {
      issueId = issueId || (await this.getCurrentIssueId());
      const fieldIds = this._getFieldIds(fields);
      const query = "?fields=" + fieldIds.join(",");
      const issue: JiraIssueFull = await this.api.getIssueById(issueId, query);
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
  ): Promise<{ data: Issue[]; total: number }> {
    try {
      const fieldIds = this._getFieldIds(fields);
      const issues: JiraIssueSearchResult = await this.api.searchIssues(
        jql,
        fieldIds,
        start,
        max
      );

      const result: Issue[] = [];
      const total = issues.total;
      const jiraIssues = issues?.issues || [];
      for (const issue of jiraIssues) {
        result.push(this._convertIssue(issue, fields));
      }
      return { data: result, total };
    } catch (error) {
      console.error(error);
      throw new Error("Error in searching issues: " + error.message);
    }
  }

  private readonly _getLinkedIssueJQL = (issues: Issue[]): string => {
    const ids: string[] = [];
    issues.forEach((issue) => {
      issue.links.forEach((link) => {
        const { issueId } = link;
        if (!ids.includes(issueId)) {
          ids.push(issueId);
        }
      });
    });

    const jqlComponents = ids.map((id) => `id=${id}`);
    const epicIssues = issues.filter((issue) => issue.type.name === "Epic");
    epicIssues.forEach((epic) => {
      jqlComponents.push(
        `parent = ${epic.issueKey} OR "Epic Link" = ${epic.issueKey}`
      );
    });
    const jqlString = jqlComponents.join(" OR ");
    return jqlString;
  };

  private readonly _populateIssueLinks = (
    issues: Issue[],
    linkedIssues: Issue[]
  ): IssueWithSortedLinks[] => {
    const populatedIssues: IssueWithSortedLinks[] = [];
    issues.forEach((issue) => {
      const sortedLinks = {};
      const item = { ...issue, sortedLinks };
      issue.links.forEach((link) => {
        if (sortedLinks[link.linkTypeId] === undefined) {
          sortedLinks[link.linkTypeId] = [];
        }
        const linkedIssue = linkedIssues.find(
          (linkedIssue) => linkedIssue.id === link.issueId
        );
        if (linkedIssue !== undefined) {
          sortedLinks[link.linkTypeId].push(linkedIssue);
        } else {
          throwError(`search could not fetch linked issues of ${link.issueId}`);
        }
      });
      // add epic child issues
      if (issue.type.name === "Epic") {
        sortedLinks[CustomLinkType.SUBTASK_OR_EPIC_CHILD] = linkedIssues.filter(
          (linkedIssue) => {
            const parent = linkedIssue.links?.find(
              (issue) => issue.linkTypeId === "PARENT"
            );
            if (parent?.issueId === issue.id) {
              return true;
            } else {
              return false;
            }
          }
        );
      }
      populatedIssues.push(item);
    });
    return populatedIssues;
  };

  async searchLinkedIssues(
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: IssueWithSortedLinks[]; total: number }> {
    const searchResult = await this.searchIssues(jql, fields, start, max);
    const issues: Issue[] = searchResult.data;

    const linkedIssuesJQL = this._getLinkedIssueJQL(issues);
    let linkedIssues = [];
    if (linkedIssuesJQL !== undefined && linkedIssuesJQL.length > 0) {
      const linkedIssuesResult = await this.searchIssues(
        linkedIssuesJQL,
        fields,
        0
      );
      linkedIssues = linkedIssuesResult.data;
      const totalLinkedIssues = linkedIssuesResult.total;
      // danger - while loop may lead to infinite looping
      while (linkedIssues.length < totalLinkedIssues) {
        const moreLinkedIssuesData = await this.searchIssues(
          linkedIssuesJQL,
          fields,
          linkedIssues.length,
          totalLinkedIssues
        );
        linkedIssues = linkedIssues.concat(moreLinkedIssuesData.data);
      }
      // danger end
    }

    const populatedIssues = this._populateIssueLinks(issues, linkedIssues);
    return { data: populatedIssues, total: searchResult.total };
  }

  private _convertFilter(filter: JiraFilter): Filter {
    return {
      ...filter,
      id: `filter=${filter.id}`,
    };
  }

  async getFilters(): Promise<Filter[]> {
    try {
      const filtersResponseData: JiraFiltersResponse =
        await this.api.getFilters();

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
      projectKey = projectKey || (await this.api.getCurrentProjectKey());
      const project: JiraProject = await this.api.getProject(projectKey);
      project || throwError("Project not found.");
      return this._convertProject(project);
    } catch (error) {
      console.error(error);
      throw new Error("Error in fetching project: " + error.message);
    }
  }
}
