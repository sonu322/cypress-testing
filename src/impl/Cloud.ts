import i18n from "../../i18n";
import { NOT_SET } from "../constants/common";
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

function throwError(msg: string, error = null): void {
  msg = i18n.t(msg);
  if (error) {
    msg += ` - ${error.message}`;
  }
  throw new Error(msg);
}
// use secondary id field
export default class APIImpl implements LXPAPI {
  private readonly api: JiraAPI;

  private jiraIssueFields: JiraIssueField[];
  private epicLinkField: JiraIssueField = null;
  private parentLinkField: JiraIssueField = null;

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

  isServer: boolean;

  constructor(api: JiraAPI, isServer: boolean = false) {
    // this console statement is written to easily find out our batch script in Jira server environment
    console.log("=== Links Explorer ===");
    this.api = api;
    this.isServer = isServer;
  }

  async init(): Promise<void> {
    this.jiraIssueFields = await this.getAllIssueFields();
    if(!this.isJiraCloud()){
      this.epicLinkField = this.getEpicLinkFieldForServer(this.jiraIssueFields);
      this.parentLinkField = this.getParentLinkFieldForServer(this.jiraIssueFields);
    }
  }

  hasValidLicense(): boolean {
    return this.api.hasValidLicense();
  }

  isJiraCloud(): boolean {
    return this.api.isJiraCloud();
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
      items || throwError("otpl.lxp.api.priority-error-main");
      
      items.unshift({
        self: "",
        iconUrl: null,
        name: "Not Set",
        id: NOT_SET,
        description: "",
        statusColor: ""
      });

      return items.map((item) => this._convertPriority(item));
    } catch (error) {
      console.error(error);
      let msg = i18n.t("otpl.lxp.api.priority-error-prefix");
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
      const msg = i18n.t("otpl.lxp.api.locale-error");
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

      items || throwError("otpl.lxp.api.issue-type-error");
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
      const prefix = i18n.t("otpl.lxp.api.issue-type-error-prefix");
      throw new Error(prefix + error.message);
    }
  }

  async getIssueLinkTypes(): Promise<IssueLinkType[]> {
    try {
      const items: JiraLinkType[] = await this.api.getIssueLinkTypes();

      items || throwError("otpl.lxp.api.link-type-error-main");

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
      const prefix = i18n.t("otpl.lxp.api.link-type-error-prefix");
      throw new Error(prefix + error.message);
    }
  }

  async addCustomFields(
    issueFields: IssueField[]
  ): Promise<string> {
    const fields = this.jiraIssueFields;
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
    issueFields: IssueField[]
  ): Promise<any> {
    const fields = this.jiraIssueFields;
    issueFields = issueFields.map((issueField) => {
      const jiraIssueField = fields.find(
        (jiraField) => jiraField.id === issueField.jiraId
      );
      if (jiraIssueField === undefined) {
        throwError("otpl.lxp.api.issue-field-error-main");
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

      const fields = this.jiraIssueFields;
      await this.addCustomFields(issueFields);
      issueFields = await this.addLanguageTranslatedNames(issueFields);
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
      const prefix = i18n.t("otpl.lxp.api.issue-field-error-prefix");
      throw new Error(prefix + error.message);
    }
  }

  async getAllIssueFields(): Promise<JiraIssueField[]> {
    try {
      const fields = await this.api.getIssueFields();
      fields || throwError("otpl.lxp.api.issue-field-error-main");
      this.jiraIssueFields = fields;
      return fields;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  _addEpicChildrenToLinks(issue: Issue, childIssues: Issue[]): void {
    childIssues.forEach((child) => {
      if (child.type.id !== "subtask") {
        issue.links.push({
          linkTypeId: CustomLinkType.CHILD_ISSUES,
          name: Labels.CHILD_ISSUES,
          isInward: false,
          issueId: child.id,
        });
      }
    });
  }

  private _shouldAddChildIssues(issue: Issue): boolean {
    return true;
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
      if (this._shouldAddChildIssues(issue)) {
        const childIssuesData = await this.getChildIssues(
          issue,
          fields,
          issue.type.id === "epic"
        );
        this._addEpicChildrenToLinks(issue, childIssuesData.data);
        linkedIssues = childIssuesData.data;
      }
      if (linkedIds?.length > 0) {
        const result = await this.searchIssues(
          `id in (${linkedIds.join(",")})`,
          fields
        );
        linkedIssues = linkedIssues.concat(result.data);
      }

      return { ...issue, linkedIssues };
    } catch (error) {
      console.log(error);
      throwError(`Error fetching issue ${issueId} - ${error.message}`);
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
        const allLinkedIssues = await this.searchIssuesByIds(
          allLinkIds,
          fields
        );
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
        if (this._shouldAddChildIssues(issue)) {
          const childIssuesData = await this.getChildIssues(
            issue,
            fields,
            issue.type.id === "epic"
          );
          this._addEpicChildrenToLinks(issue, childIssuesData.data);
          linkedIssues = linkedIssues.concat(childIssuesData.data);
        }
        result.push({ ...issue, linkedIssues });
      }

      return result;
    } catch (error) {
      console.log(error);
      throwError(`Error fetching issues ${issueIds.join(",")} - ${error.message}`);
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

  private async _convertIssue(issue: JiraIssueFull, fields: IssueField[], epicLinkFieldId: string = null, parentLinkFieldId = null): Promise<Issue> {
    let sprintFieldId, storyPointsFieldId, storyPointEstimateFieldId;
    if (fields?.length) {
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
    let parent = issue.fields.parent;
    if(!parent){
      let parentId;
      if(epicLinkFieldId){
        parentId = issue.fields[epicLinkFieldId];
      }
      if (parentLinkFieldId && !parentId) {
        parentId = issue.fields[parentLinkFieldId];
      }
      if (parentId) {
        const fieldIds = this._getFieldIds(fields);
        if(epicLinkFieldId){
          fieldIds.push(epicLinkFieldId);
        }
        if(parentLinkFieldId){
          fieldIds.push(parentLinkFieldId);
        }
        
        const query = "?fields=" + fieldIds.join(",");
        try {
          parent = await this.api.getIssueById(parentId, query);
        } catch(err){
          console.error(err);
        }
      }
    }
    let result = {
      id: issue.id,
      issueKey: issue.key,
      summary: issue.fields?.summary,
      priority: this._convertPriority(issue.fields?.priority),
      type: this._convertIssueType(issue.fields?.issuetype),
      status: this._convertIssueStatus(issue.fields?.status),
      links: this._convertLinks(
        issue.fields?.issuelinks || [],
        issue.fields?.subtasks || [],
        parent
      ),
      assignee: this._convertIssueAssignee(issue.fields.assignee),
      fixVersions: this._convertVersions(issue.fields.fixVersions || []),
      isResolved: issue.fields.resolution ? true : false,
      storyPoints,
      sprints: sprintFieldId ? issue.fields[sprintFieldId] : null,
    };
    return result;
  }

  private _getFieldIds(fields: IssueField[]): string[] {
    let fieldIds = [];
    if (fields) {
      fields.forEach((field) => {
        fieldIds.push(field.jiraId);
        if (field.secondaryJiraId) {
          fieldIds.push(field.secondaryJiraId);
        }
      });
      fieldIds = [...fieldIds, ...this.requiredFields];
    } else {
      fieldIds = this.defaultFields;
    }
    return fieldIds;
  }

  getEpicLinkClause(): string {
    return this.epicLinkField?.clauseNames?.length > 0? 
      this.epicLinkField.clauseNames[0] : Constants.EPIC_LINK_FLD;
  }

  getParentLinkClause(): string {
    return this.parentLinkField?.clauseNames?.length > 0? 
      this.parentLinkField.clauseNames[0] : Constants.PARENT_LINK_FLD;
  }

  async getChildIssues(
    issue: Issue,
    fields: IssueField[],
    isEpic: boolean
  ): Promise<{ data: Issue[]; total: number }> {
    const epicLinkClause = this.getEpicLinkClause();
    const parentLinkClause = this.getParentLinkClause();
    try {
      let query = `"${parentLinkClause}" = ${issue.issueKey}`;
      if (isEpic) {
        query = `parent = ${issue.issueKey} OR "${epicLinkClause}" = ${issue.issueKey}`;
      }
      return await this.searchIssues(query, fields);
    } catch (error) {
      console.log(error);
      throwError(`Error getting child issues of issue ${issue.issueKey} - ${error.message}`);
    }
  }

  getEpicLinkFieldForServer(fields: JiraIssueField[]): JiraIssueField {
    let epicField = null;
    for (const field of fields) {
      if (field.name === Constants.EPIC_LINK_FLD || field.schema?.custom === Constants.EPIC_LINK_SCHEMA) {
        epicField = field;
      }
    }
    return epicField;
  }

  getParentLinkFieldForServer(fields: JiraIssueField[]): JiraIssueField {
    let parentField = null;
    for (const field of fields) {
      if (field.name === Constants.PARENT_LINK_FLD || field.schema?.custom === Constants.PARENT_LINK_SCHEMA) {
        parentField = field;
      }
    }
    return parentField;
  }

  async getIssueById(fields: IssueField[], issueId?: string): Promise<Issue> {
    try {
      issueId = issueId || (await this.getCurrentIssueId());
      const fieldIds = this._getFieldIds(fields);
      let epicLinkField = null;
      let parentLinkField = null;
      if (!this.api.isJiraCloud()) {
        const fields = this.jiraIssueFields;
        epicLinkField = this.getEpicLinkFieldForServer(fields);
        parentLinkField = this.getParentLinkFieldForServer(fields);
        if(epicLinkField){
          fieldIds.push(epicLinkField.id);
        }
        if(parentLinkField){
          fieldIds.push(parentLinkField.id);
        }
      }
      const query = "?fields=" + fieldIds.join(",");
      const issue: JiraIssueFull = await this.api.getIssueById(issueId, query);
      issue || throwError("otpl.lxp.api.issue-by-id-error-main");
      return await this._convertIssue(issue, fields, epicLinkField?.id, parentLinkField?.id);
    } catch (error) {
      console.error(error);
      const prefix = i18n.t("otpl.lxp.api.issue-by-id-error-prefix");

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
      let epicLinkField = null;
      let parentLinkField = null;
      if (!this.api.isJiraCloud()) {
        const fields = this.jiraIssueFields;
        epicLinkField = await this.getEpicLinkFieldForServer(fields);
        parentLinkField = await this.getParentLinkFieldForServer(fields);
        if(epicLinkField){
          fieldIds.push(epicLinkField.id);
        }
        if(parentLinkField){
          fieldIds.push(parentLinkField.id);
        }
      }
      const issuesSearchResult: JiraIssueSearchResult =
        await this.api.searchAllIssues(jql, fieldIds, start, max);
      const result: Issue[] = [];
      const total = issuesSearchResult.total;
      const jiraIssues = issuesSearchResult?.issues || [];
      for (const issue of jiraIssues) {
        result.push(await this._convertIssue(issue, fields, epicLinkField?.id, parentLinkField?.id));
      }
      return { data: result, total };
    } catch (error) {
      console.error(error);
      let finalMessage = i18n.t("otpl.lxp.api.search-issues-error");
      if (error.message) {
        finalMessage = finalMessage.concat(`: + ${error.message}`);
      }
      throw new Error(finalMessage);
    }
  }

  private readonly _getLinkedIssueJQL = (issues: Issue[]): string => {
    const epicLinkClause = this.getEpicLinkClause();
    const parentLinkClause = this.getParentLinkClause();
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
    issues.forEach((issue) => {
      if (issue.type.id === "epic") {
        jqlComponents.push(
          `parent = ${issue.issueKey} OR "${epicLinkClause}" = ${issue.issueKey}`
        );
      } else {
        jqlComponents.push(
          `"${parentLinkClause}" = ${issue.issueKey}`
        );
      }
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
      if (this._shouldAddChildIssues(issue)) {
        sortedLinks[CustomLinkType.CHILD_ISSUES] = linkedIssues.filter(
          (linkedIssue) => {
            const parent = linkedIssue.links?.find(
              (issue) =>
                issue.linkTypeId === CustomLinkType.PARENT &&
                linkedIssue.type.id !== "subtask"
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
    }

    const populatedIssues = this._populateIssueLinks(issues, linkedIssues);
    return { data: populatedIssues, total: searchResult.total };
  }

  async searchOrphanIssues(
    jql: string,
    fields: IssueField[],
    start?: number,
    max?: number
  ): Promise<{ data: IssueWithLinkedIssues[]; total: number }> {
    try {
      const isOrderingJqlRegex = /order*/;

      let orphansSearchJql: string;
      if (this.isServer) {
        orphansSearchJql = jql;
      } else {
        const shouldOmitPrefix =
          jql?.length === 0 || isOrderingJqlRegex.test(jql);
        const jqlPrefix = shouldOmitPrefix ? "" : "and";
        orphansSearchJql = `issueLinkType is EMPTY and parent is EMPTY and "Epic Link" is EMPTY ${jqlPrefix} ${jql}`;
      }
      const searchResult = await this.searchIssues(
        orphansSearchJql,
        fields,
        start,
        max
      );

      if (searchResult.data !== undefined) {
        const orphansWithoutChildren = searchResult.data.filter(
          (issue) => issue.links === undefined || issue.links.length === 0
        ); // in case of server, it removes all links
        const epics = orphansWithoutChildren.filter(
          (issue) => issue.type.name === "Epic"
        );
        const issuesWithoutEpics = orphansWithoutChildren.filter(
          (issue) => issue.type.name !== "Epic"
        );
        const removeChildrenPromises = epics.map(
          async (epic) =>
            await this.getChildIssues(epic, fields, true).then((response) => {
              if (response.total === 0) {
                return true;
              } else {
                return false;
              }
            })
        );

        const responses = await Promise.all(removeChildrenPromises);
        const epicsWithoutChildren = [];
        if (epics.length === 0 || responses !== undefined) {
          for (let i = 0; i < epics.length; i++) {
            if (responses[i]) {
              epicsWithoutChildren.push(epics[i]);
            }
          }
          const orphansAndEpicsWithoutChildren =
            epicsWithoutChildren.concat(issuesWithoutEpics);
          // TODO: if we add optiton to make orphans fetch more than 100 issues, add handling

          const issueWithLinkedIssues: IssueWithLinkedIssues[] =
            orphansAndEpicsWithoutChildren.map((issue) => ({
              ...issue,
              linkedIssues: [],
            }));
          return { data: issueWithLinkedIssues, total: searchResult.total };
        }
      }
    } catch (error) {
      console.log(error);
      throwError("otpl.lxp.api.search-issues-error", error);
    }
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
      let message = i18n.t("otpl.lxp.api.filters-error");
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
      project || throwError("otpl.lxp.api.project-error");
      return this._convertProject(project);
    } catch (error) {
      console.error(error);
      let message = i18n.t("otpl.lxp.api.project-error");
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

  async getAutoCompleteSuggestions(
    query: string
  ): Promise<JiraAutoCompleteSuggestionsResult> {
    return await this.api.getAutoCompleteSuggestions(query);
  }

  async getDashboardGadgetConfig(
    dashboardId: string,
    dashboardItemId: string
  ): Promise<any> {
    try {
      const config = await this.api.getDashboardGadgetConfig(
        dashboardId,
        dashboardItemId
      );
      if (config.value === undefined) {
        throwError("otpl.lxp.api.dashboard-gadget-get-config-error");
      }
      return config;
    } catch (error) {
      throwError("otpl.lxp.api.dashboard-gadget-get-config-error");
    }
  }

  resizeWindow(width: string | number, height: string | number): void {
    this.api.resizeWindow(width, height);
  }

  async editDashboardItemProperty(
    dashboardId: string,
    dashboardItemId: string,
    propertyKey: string,
    propertyValue: Object
  ): Promise<void> {
    try {
      await this.api.editDashboardItemProperty(
        dashboardId,
        dashboardItemId,
        propertyKey,
        propertyValue
      );
    } catch (error) {
      console.log(error);
      throwError("otpl.lxp.api.dashboard-gadget-edit-config-error");
    }
  }

  async editDashboardItemTitle(
    dashboardId: string,
    dashboardItemId: string,
    title: string
  ): Promise<void> {
    try {
      await this.api.editDashboardItemTitle(
        dashboardId,
        dashboardItemId,
        title
      );
    } catch (error) {
      console.log(error);
      throwError("otpl.lxp.api.dashboard-gadget-edit-title-error");
    }
  }
}
