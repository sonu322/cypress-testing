import fetch from "node-fetch";
import { getRandomPositiveNumber, getRandomWholeNumber, getRNG } from "./util";
import mockIssueData from "./mockIssueData";
import labels from "./labels";
import versions from "./versions";
import type { RequestHeaders } from "./types";
const base64 = require("base-64");
const rngIssueData = getRNG("mockissuedata");
const rngParentKey = getRNG("parent");
const rngPriorities = getRNG("priorities");
const rngStoryPoints = getRNG("story");
const rngLabels = getRNG("labels");
const rngAssignee = getRNG("assignee");
const rngReporter = getRNG("reporter");
const rngTransition = getRNG("transition");
const rngCreateProjectVersion = getRNG("projectVersion");
const rngFixVersion = getRNG("chosenversion");
interface IssueData {
  [key: string]: any;
}
export default class LXPAPI {
  private readonly baseURL: string;
  private readonly username: string;
  private readonly password: string;
  constructor(baseURL: string, username: string, password: string) {
    this.baseURL = baseURL;
    this.username = username;
    this.password = password;
  }

  _getHeaders(): RequestHeaders {
    const headers: RequestHeaders = {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Authorization: `Basic ${base64.encode(
        `${this.username}:${this.password}`
      )}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return headers;
  }

  async _makeFetchRequest(
    apiEndpoint: string,
    requestMethod?: string,
    bodyData?: object,
    requestHeaders?: RequestHeaders,
    shouldNotReturnResponse?: boolean
  ): Promise<any> {
    try {
      let headers = requestHeaders;
      let body;
      if (bodyData !== undefined) {
        body = JSON.stringify(bodyData);
      }
      if (headers === undefined) {
        headers = this._getHeaders();
      }
      const method = requestMethod ?? "GET";
      const res = await fetch(`${this.baseURL}/${apiEndpoint}`, {
        method,
        headers,
        body,
      });
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (res.ok) {
        if (!shouldNotReturnResponse) {
          const data = await res.json();
          return data;
        }
      } else {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Error fetching url: ${this.baseURL}/${apiEndpoint}. Status: ${res.status}: ${res.statusText}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getFullProject(project: any): Promise<any> {
    const data = await this._makeFetchRequest(`project/${project.key}`);
    return data;
  }

  async getIssueLinkTypeNames(): Promise<string[]> {
    try {
      const data = await this._makeFetchRequest("issueLinkType");
      return data.issueLinkTypes.map((issueLinkType) => issueLinkType.name);
    } catch (error) {
      console.log("Some error occured fetching link type names");
      console.log(error);
    }
  }

  async getFields(): Promise<any[]> {
    const data = await this._makeFetchRequest("field");
    return data;
  }

  async getPriorities(): Promise<any[]> {
    const data = await this._makeFetchRequest("priority");
    return data;
  }

  async getAssignableUsers(projectKeys: string[]): Promise<any[]> {
    const projectKeyString = projectKeys.toString();
    const data = await this._makeFetchRequest(
      `user/assignable/multiProjectSearch?projectKeys=${projectKeyString}`
    );
    return data;
  }

  _createIssueBodyData(
    projectKey: string,
    storyPointsFieldKey,
    config: any,
    shouldSetPriority: boolean
  ): any {
    const {
      issueTypeName,
      priorityName,
      storyPoints,
      summary,
      assigneeId,
      reporterId,
      labels,
      versionIds,
    } = config;
    const issueData: IssueData = {
      fields: {
        summary,
        project: {
          key: projectKey,
        },

        issuetype: {
          name: issueTypeName,
        },
        labels,
        assignee: {
          id: assigneeId,
        },
        reporter: {
          id: reporterId,
        },
      },
    };
    if (shouldSetPriority) {
      issueData.fields.priority = {
        name: priorityName,
      };
    }
    if (storyPoints !== undefined) {
      issueData.fields[storyPointsFieldKey] = storyPoints;
    }
    if (versionIds !== undefined && versionIds.length > 0) {
      issueData.fields.fixVersions = versionIds.map((versionId) => ({
        id: versionId,
      }));
    }
    return issueData;
  }

  async _createIssueDataList(
    projectKey: string,
    issueTypeNames: string[],
    numberOfIssues: number,
    versionIds: string[],
    shouldSetStoryPointsEstimate: boolean,
    issueDataGenerator
  ): Promise<any[]> {
    const priorities = await this.getPriorities();
    const assignableUsers = await this.getAssignableUsers([projectKey]);
    let priorityNames = [];
    if (priorities.length > 0) {
      priorityNames = priorities.map((priority) => priority.name);
    }
    const rng = getRNG("issuetype");
    const issues = [];
    for (let i = 0; i < numberOfIssues; i++) {
      let selectedTypeIndex = 0;
      let selectedPriorityIndex;
      if (issueTypeNames.length > 1) {
        selectedTypeIndex = getRandomWholeNumber(rng, issueTypeNames.length);
      }
      if (priorityNames.length > 0) {
        selectedPriorityIndex = getRandomWholeNumber(
          rngPriorities,
          priorityNames.length
        );
      }
      const selectedPriorityName = priorities[selectedPriorityIndex].name;

      const selectedTypeName = issueTypeNames[selectedTypeIndex];
      let storyPoints: number;
      if (shouldSetStoryPointsEstimate) {
        storyPoints = getRandomPositiveNumber(rngStoryPoints, 10);
      }

      const issueDataIndex = getRandomWholeNumber(
        rngIssueData,
        mockIssueData.length
      );
      const summary = mockIssueData[issueDataIndex].summary;

      if (selectedTypeName === undefined) {
        throw new Error("type NAME undefined");
      }
      let chosenVersionIds: string[] = [];
      if (versionIds.length > 0) {
        const startIndex = getRandomWholeNumber(
          rngFixVersion,
          versionIds.length
        );
        const endIndex = getRandomWholeNumber(rngFixVersion, versionIds.length);
        chosenVersionIds = versionIds.slice(startIndex, endIndex);
      }

      const index1 = getRandomWholeNumber(rngLabels, labels.length);
      const index2 = getRandomWholeNumber(rngLabels, labels.length);
      const selectedLabels = labels.slice(index1, index2);

      const selectedAssigneeIndex = getRandomWholeNumber(
        rngAssignee,
        assignableUsers.length
      );
      const selectedReporterIndex = getRandomWholeNumber(
        rngReporter,
        assignableUsers.length
      );

      const selectedAssigneeId =
        assignableUsers[selectedAssigneeIndex].accountId;
      const selectedReporterId =
        assignableUsers[selectedReporterIndex].accountId;
      const issue = issueDataGenerator({
        issueTypeName: selectedTypeName,
        priorityName: selectedPriorityName,
        storyPoints,
        rngIssueData,
        summary,
        labels: selectedLabels,
        reporterId: selectedReporterId,
        assigneeId: selectedAssigneeId,
        versionIds: chosenVersionIds,
      });
      issues.push(issue);
    }
    return issues;
  }

  async createIssuesInBulk(
    project: any,
    projectStyle: string,
    noOfIssuesPerProject: number,
    issueTypeNames: string[],
    storyPointsFieldKey: string,
    versionIds: string[],
    shouldSetStoryPointsEstimate: boolean
  ): Promise<any[]> {
    try {
      if (issueTypeNames === undefined) {
        throw new Error("no issue types from project");
      }
      const issueDataList = await this._createIssueDataList(
        project.key,
        issueTypeNames,
        noOfIssuesPerProject,
        versionIds,
        shouldSetStoryPointsEstimate,
        (config) => {
          return this._createIssueBodyData(
            project.key,
            storyPointsFieldKey,
            config,
            projectStyle === "classic"
          );
        }
      );
      if (issueDataList.length === 0) {
        throw new Error("no data list");
      }
      const bodyData = {
        issueUpdates: issueDataList,
      };
      const data = await this._makeFetchRequest("issue/bulk", "POST", bodyData);
      return data.issues;
    } catch (error) {
      console.log("caught create bulk issues error");
      console.log(error);
    }
  }

  _createClassicEpicBodyData(
    projectKey: string,
    epicNameFieldKey: string,
    epicName: string,
    config: any
  ): any {
    const {
      issueTypeName,
      priorityName,
      summary,
      labels,
      reporterId,
      assigneeId,
      versionIds,
    } = config;
    const issueData: IssueData = {
      fields: {
        summary,
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
        priority: {
          name: priorityName,
        },
        labels,
        assignee: {
          id: assigneeId,
        },
        reporter: {
          id: reporterId,
        },
      },
    };
    issueData.fields[epicNameFieldKey] = epicName;
    if (versionIds.length > 0) {
      issueData.fields.fixVersions = versionIds.map((versionId) => ({
        id: versionId,
      }));
    }
    return issueData;
  }

  _createNextGenEpicBodyData(
    projectKey: string,
    storyPointsFieldKey: string,
    config: any
  ): any {
    const {
      issueTypeName,
      storyPoints,
      summary,
      labels,
      reporterId,
      assigneeId,
    } = config;
    const issueData: IssueData = {
      fields: {
        summary,
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
        labels,
        assignee: {
          id: assigneeId,
        },
        reporter: {
          id: reporterId,
        },
      },
    };
    if (storyPoints !== undefined) {
      issueData.fields[storyPointsFieldKey] = storyPoints;
    }
    return issueData;
  }

  async createEpicIssuesInBulk(
    projectKey: string,
    numberOfIssues: number,
    epicIssueTypeName: string,
    epicName: string,
    epicNameFieldKey: string,
    projectStyle,
    versionIds: string[],
    storyPointsFieldKey,
    shouldSetStoryPointsEstimate
  ): Promise<any[]> {
    try {
      const issueDataList = await this._createIssueDataList(
        projectKey,
        [epicIssueTypeName],
        numberOfIssues,
        versionIds,
        shouldSetStoryPointsEstimate,
        (config) => {
          if (projectStyle === "classic") {
            return this._createClassicEpicBodyData(
              projectKey,
              epicNameFieldKey,
              epicName,
              config
            );
          } else {
            return this._createNextGenEpicBodyData(
              projectKey,
              storyPointsFieldKey,
              config
            );
          }
        }
      );
      const bodyData = {
        issueUpdates: issueDataList,
      };
      const data = await this._makeFetchRequest("issue/bulk", "POST", bodyData);
      return data.issues;
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  _createSubtaskBodyData(
    shouldSetPriority: boolean,
    projectKey: string,
    parentIssueKeys: string[],
    config
  ): any {
    const {
      issueTypeName,
      priorityName,
      summary,
      labels,
      reporterId,
      assigneeId,
      versionIds,
    } = config;
    const issueData: IssueData = {
      fields: {
        summary,
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
        labels,
        assignee: {
          id: assigneeId,
        },
        reporter: {
          id: reporterId,
        },
      },
    };
    if (shouldSetPriority) {
      issueData.fields.priority = {
        name: priorityName,
      };
    }
    const chosenIndex = getRandomWholeNumber(
      rngParentKey,
      parentIssueKeys.length
    );
    const chosenParentKey = parentIssueKeys[chosenIndex];
    issueData.fields.parent = {
      key: chosenParentKey,
    };
    if (versionIds.length > 0) {
      issueData.fields.fixVersions = versionIds.map((versionId) => ({
        id: versionId,
      }));
    }
    return issueData;
  }

  async createSubtasksInBulk(
    projectKey: string,
    noOfIssues: number,
    subtaskFieldName: string,
    parentIssueKeys: string[],
    projectStyle: string,
    versionIds: string[],
    shouldSetStoryPointsEstimate
  ): Promise<any[]> {
    try {
      const shouldSetPriority = projectStyle === "classic";
      const issueDataList = await this._createIssueDataList(
        projectKey,
        [subtaskFieldName],
        noOfIssues,
        versionIds,
        shouldSetStoryPointsEstimate,
        (config) =>
          this._createSubtaskBodyData(
            shouldSetPriority,
            projectKey,
            parentIssueKeys,
            config
          )
      );
      const bodyData = {
        issueUpdates: issueDataList,
      };
      const data = await this._makeFetchRequest("issue/bulk", "POST", bodyData);
      return data.issues;
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  _createClassicEpicChildBodyData(
    projectKey: string,
    epicLinkFieldKey: string,
    parentEpicKeys: string[],
    config
  ): any {
    const {
      issueTypeName,
      priorityName,
      summary,
      labels,
      reporterId,
      assigneeId,
      versionIds,
    } = config;
    const issueData: IssueData = {
      fields: {
        summary,
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
        priority: {
          name: priorityName,
        },
        labels,
        assignee: {
          id: assigneeId,
        },
        reporter: {
          id: reporterId,
        },
      },
    };

    const chosenIndex = getRandomWholeNumber(
      rngParentKey,
      parentEpicKeys.length
    );
    const chosenParentKey = parentEpicKeys[chosenIndex];
    if (versionIds.length > 0) {
      issueData.fields.fixVersions = versionIds.map((versionId) => ({
        id: versionId,
      }));
    }
    issueData.fields[epicLinkFieldKey] = chosenParentKey;
    return issueData;
  }

  _createNextGenEpicChildBodyData(
    projectKey: string,
    parentEpicKeys: string[],
    storyPointsFieldKey,
    config
  ): any {
    const {
      issueTypeName,
      storyPoints,
      summary,
      labels,
      reporterId,
      assigneeId,
    } = config;

    const chosenIndex = getRandomWholeNumber(
      rngParentKey,
      parentEpicKeys.length
    );
    const chosenParentKey = parentEpicKeys[chosenIndex];

    const issueData: IssueData = {
      fields: {
        summary,
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
        labels,
        assignee: {
          id: assigneeId,
        },
        reporter: {
          id: reporterId,
        },
        parent: {
          key: chosenParentKey,
        },
      },
    };
    if (storyPoints !== undefined) {
      issueData.fields[storyPointsFieldKey] = storyPoints;
    }
    return issueData;
  }

  async createEpicChildrenInBulk(
    projectKey: string,
    numberOfIssues: number,
    childIssueTypeNames: string[],
    parentEpicKeys: string[],
    projectStyle: string,
    epicLinkFieldKey,
    versionIds,
    storyPointsFieldKey,
    shouldSetStoryPointsEstimate
  ): Promise<any[]> {
    try {
      const issueDataList = await this._createIssueDataList(
        projectKey,
        childIssueTypeNames,
        numberOfIssues,
        versionIds,
        shouldSetStoryPointsEstimate,
        (config) => {
          if (projectStyle === "classic") {
            return this._createClassicEpicChildBodyData(
              projectKey,
              epicLinkFieldKey,
              parentEpicKeys,
              config
            );
          } else {
            return this._createNextGenEpicChildBodyData(
              projectKey,
              parentEpicKeys,
              storyPointsFieldKey,
              config
            );
          }
        }
      );

      const bodyData = {
        issueUpdates: issueDataList,
      };
      const data = await this._makeFetchRequest("issue/bulk", "POST", bodyData);
      return data.issues;
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  // fetch current user
  async getMyself(): Promise<any> {
    const myself = await this._makeFetchRequest("myself");
    return myself;
  }

  async createProject(
    description: string,
    leadAccountId: string,
    projectTemplateKey: string,
    name: string,
    key: string
  ): Promise<any> {
    const bodyData = {
      description,
      leadAccountId,
      projectTemplateKey,
      name,
      key,
    };
    const projectData = await this._makeFetchRequest(
      "project",
      "POST",
      bodyData
    );
    return projectData;
  }

  async createProjectVersion(projectId): Promise<any> {
    const selectedProjectVersionIndex = getRandomWholeNumber(
      rngCreateProjectVersion,
      versions.length
    );
    const selectedProjectVersion = versions[selectedProjectVersionIndex];
    selectedProjectVersion.projectId = projectId;
    const data = await this._makeFetchRequest(
      "version",
      "POST",
      selectedProjectVersion
    );
    return data;
  }

  async createLink(
    outwardIssueKey: string,
    inwardIssueKey: string,
    linkTypeName: string
  ): Promise<void> {
    if (inwardIssueKey !== outwardIssueKey) {
      const bodyData = {
        outwardIssue: {
          key: outwardIssueKey,
        },
        inwardIssue: {
          key: inwardIssueKey,
        },
        type: {
          name: linkTypeName,
        },
      };
      try {
        await this._makeFetchRequest(
          "issueLink",
          "POST",
          bodyData,
          undefined,
          true
        );
      } catch (error) {
        console.log("caught create link error");
        console.log(error);
      }
    }
  }

  async addStatusInfo(issue): Promise<void> {
    try {
      const transitionsData = await this._makeFetchRequest(
        `issue/${issue.key}/transitions`
      );
      const transitions = transitionsData.transitions;
      const selectedTransitionIndex = getRandomWholeNumber(
        rngTransition,
        transitions.length
      );
      const transitionId = transitions[selectedTransitionIndex].id;
      const bodyData = {
        transition: {
          id: transitionId,
        },
      };
      await this._makeFetchRequest(
        `issue/${issue.key}/transitions`,
        "POST",
        bodyData,
        undefined,
        true
      );
    } catch (error) {
      console.log("caught status error");
      console.log(error);
    }
  }
}
