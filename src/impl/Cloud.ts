import i18n from "../../i18n";
import LXPAPI, {
  Constants,
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
  Labels,
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
  HelpLinks,
  JiraAutoCompleteResult,
  JiraAutoCompleteSuggestionsResult,
} from "../types/jira";

function throwError(msg: string) {
  throw new Error(i18n.t(msg));
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
      items || throwError("lxp.api.priority-error-main");

      return items.map((item) => this._convertPriority(item));
    } catch (error) {
      console.error(error);
      let msg = i18n.t("lxp.api.priority-error-prefix");
      msg += error.message ? " - " + error.message : ".";
      throw new Error(msg);
    }
  }

  async getLocale(): Promise<string> {
    try {
      const myself = await this.api.getMyself();
      return myself.locale;
    } catch (error) {
      console.error(error);
      const msg = i18n.t("lxp.api.locale-error");
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

      items || throwError("lxp.api.issue-type-error");
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
      const prefix = i18n.t("lxp.api.issue-type-error-prefix");
      throw new Error(prefix + error.message);
    }
  }

  async getIssueLinkTypes(): Promise<IssueLinkType[]> {
    try {
      const items: JiraLinkType[] = await this.api.getIssueLinkTypes();

      items || throwError("lxp.api.link-type-error-main");

      const result = [];
      result.push({
        id: CustomLinkType.PARENT,
        name: Labels.PARENT,
      });
      result.push({
        id: CustomLinkType.SUBTASKS,
        name: Labels.SUBTASKS,
      });
      result.push({
        id: CustomLinkType.CHILD_ISSUES,
        name: Labels.CHILD_ISSUES,
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
      throw new Error("lxp.api.link-type-error-prefix" + error.message);
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

  async addLanguageTranslatedNames(
    issueFields: IssueField[],
    fields?: JiraIssueField[]
  ): Promise<any> {
    fields = fields || (await this.getAllIssueFields());
    issueFields = issueFields.map((issueField) => {
      const jiraIssueField = fields.find(
        (jiraField) => jiraField.id === issueField.jiraId
      );
      if (jiraIssueField === undefined) {
        throwError("lxp.api.issue-field-error-main");
      }
      return {
        ...issueField,
        name: jiraIssueField.name,
      };
    });
    return issueFields;
  }

  async getIssueFields(): Promise<IssueField[]> {
    try {
      const result: IssueField[] = [];
      let issueFields: IssueField[] = [
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
      issueFields = await this.addLanguageTranslatedNames(issueFields, fields);
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
      const prefix = i18n.t("lxp.api.issue-field-error-prefix");
      throw new Error(prefix + error.message);
    }
  }

  async getAllIssueFields(): Promise<JiraIssueField[]> {
    try {
      const fields = await this.api.getIssueFields();
      fields || throwError("lxp.api.issue-field-error-main");
      return fields;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  _addEpicChildrenToLinks(issue: Issue, childIssues: Issue[]): void {
    childIssues.forEach((child) => {
      issue.links.push({
        linkTypeId: CustomLinkType.CHILD_ISSUES,
        name: Labels.CHILD_ISSUES,
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
      if (issue.type.id === "epic" || issue.type.id === "initiative") {
        const childIssuesData = await this.getChildIssues(issue, fields, issue.type.id === "epic");
        this._addEpicChildrenToLinks(issue, childIssuesData.data);
        linkedIssues = childIssuesData.data;
      }
      if (linkedIds?.length > 0) {
        const result = await this.searchIssues(`id in (${linkedIds.join(",")})`, fields);
        linkedIssues = linkedIssues.concat(result.data);
      }

      return { ...issue, linkedIssues };
    } catch (error) {
      console.log(error);
      throwError(`Error fetching issue ${issueId}`);
    }
  }

  async getIssuesWithLinks(
    fields: IssueField[],
    issueIds: string[]
  ): Promise<IssueWithLinkedIssues[]> {
    try {
      const issues: Issue[] = await this.searchIssuesByIds(issueIds, fields);
      const issueIdLinksMap = {};
      let allLinkIds = [];
      for (const issue of issues) {
        const linkedIds = issue.links.map((link) => link.issueId);
        issueIdLinksMap[issue.id] = linkedIds;
        allLinkIds = allLinkIds.concat(linkedIds);
      }
      const linkedIssuesMap = {};
      if (allLinkIds.length > 0) {
        const allLinkedIssues = await this.searchIssuesByIds(allLinkIds, fields);
        for (const linkedIssue of allLinkedIssues) {
          linkedIssuesMap[linkedIssue.id] = linkedIssue;
        }
      }

      const result: IssueWithLinkedIssues[] = [];
      for (const issue of issues) {
        const linkedIds = issueIdLinksMap[issue.id];
        let linkedIssues: Issue[] = [];
        for (const linkedId of linkedIds) {
          if (linkedIssuesMap[linkedId] !== undefined) {
            linkedIssues.push(linkedIssuesMap[linkedId]);
          }
        }
        // add epic children to issue
        if (issue.type.id === "epic" || issue.type.id === "initiative") {
          const childIssuesData = await this.getChildIssues(issue, fields, issue.type.id === "epic");
          this._addEpicChildrenToLinks(issue, childIssuesData.data);
          linkedIssues = linkedIssues.concat(childIssuesData.data);
        }
        result.push({ ...issue, linkedIssues });
      }

      return result;
    } catch (error) {
      console.log(error);
      throwError(`Error fetching issues ${issueIds.join(",")}`);
    }
  }

  async getCurrentIssueId(): Promise<string> {
    return await this.api.getCurrentIssueId();
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
        name: Labels.PARENT,
        isInward: true,
        issueId: parent.id,
      });
    }
    for (const subTask of subTasks) {
      result.push({
        linkTypeId: CustomLinkType.SUBTASKS,
        name: Labels.SUBTASKS,
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

  async getChildIssues(
    issue: Issue,
    fields: IssueField[],
    isEpic: boolean
  ): Promise<{ data: Issue[]; total: number }> {
    try {
      let query = `"${Constants.PARENT_LINK_FLD}" = ${issue.issueKey}`;
      if (isEpic) {
        query = `parent = ${issue.issueKey} OR "${Constants.EPIC_LINK_FLD}" = ${issue.issueKey}`;
      }
      return await this.searchIssues(query, fields);
    } catch (error) {
      console.log(error);
      throwError(`Error getting child issues of issue ${issue.issueKey}`);
    }
  }

  async getIssueById(fields: IssueField[], issueId?: string): Promise<Issue> {
    try {
      issueId = issueId || (await this.getCurrentIssueId());
      const fieldIds = this._getFieldIds(fields);
      const query = "?fields=" + fieldIds.join(",");
      const issue: JiraIssueFull = await this.api.getIssueById(issueId, query);
      issue || throwError("lxp.api.issue-by-id-error-main");

      return this._convertIssue(issue, fields);
    } catch (error) {
      console.error(error);
      const prefix = i18n.t("lxp.api.issue-by-id-error-prefix");

      let finalMessage = `${prefix} ${issueId}`;
      if (error.message) {
        finalMessage = finalMessage.concat(`- ${error.message}`);
      }
      throw new Error(finalMessage);
    }
  }

  async searchIssuesByIds(
    ids: string[],
    fields: IssueField[]
  ): Promise<Issue[]> {
    const jql = `id in (${ids.join(",")})`;
    let result = await this.searchIssues(jql, fields);
    let allIssues = result.data;
    const maxIterations = 100; // to eliminate the infinite looping danger
    let iteration = 0;
    while (allIssues.length < result.total && iteration < maxIterations) {
      result = await this.searchIssues(jql, fields, allIssues.length);
      allIssues = allIssues.concat(result.data);
      iteration++;
    }
    return allIssues;
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
      let finalMessage = i18n.t("lxp.api.search-issues-error");
      if (error.message) {
        finalMessage = finalMessage.concat(`: + ${error.message}`);
      }
      throw new Error(finalMessage);
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
    const epicIssues = issues.filter((issue) => issue.type.id === "epic");
    epicIssues.forEach((epic) => {
      jqlComponents.push(
        `parent = ${epic.issueKey} OR "${Constants.EPIC_LINK_FLD}" = ${epic.issueKey}`
      );
    });

    const initiativeIssues = issues.filter((issue) => issue.type.id === "initiative");
    initiativeIssues.forEach((initiative) => {
      jqlComponents.push(
        `"${Constants.PARENT_LINK_FLD}" = ${initiative.issueKey}`
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
      if (issue.type.id === "epic" || issue.type.id === "initiative") {
        sortedLinks[CustomLinkType.CHILD_ISSUES] = linkedIssues.filter(
          (linkedIssue) => {
            const parent = linkedIssue.links?.find(
              (issue) => issue.linkTypeId === CustomLinkType.PARENT && linkedIssue.type.id !== "subtask"
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
      let message = i18n.t("lxp.api.filters-error");
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
      project || throwError("lxp.api.project-error");
      return this._convertProject(project);
    } catch (error) {
      console.error(error);
      let message = i18n.t("lxp.api.project-error");
      if (error.message && error.message !== message) {
        message = message.concat(`: ${error.message}`);
      }
      throw new Error(message);
    }
  }

  getHelpLinks(): HelpLinks {
    return this.api.getHelpLinks();
  }

  async getAutoCompleteData(): Promise<JiraAutoCompleteResult> {
    return await this.api.getAutoCompleteData();
  }

  async getAutoCompleteSuggestions(query: string): Promise<JiraAutoCompleteSuggestionsResult> {
    return await this.api.getAutoCompleteSuggestions(query);
  }
}
