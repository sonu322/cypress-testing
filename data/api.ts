import fetch from "node-fetch";
import { getRandomPositiveNumber, getRandomWholeNumber, getRNG } from "./util";
import mockIssueData from "./mockIssueData";
import labels from "./labels";
import versions from "./versions";
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

  // private readonly _AP: any = AP;
  async createIssue(
    projectKey: string,
    summary: string,
    issueTypeName: string
  ): Promise<any> {
    const bodyData = JSON.stringify({
      fields: {
        project: {
          key: projectKey,
        },
        summary,
        issuetype: {
          name: issueTypeName,
        },
      },
    });
    try {
      const res = await fetch(`${this.baseURL}/issue/`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        console.log("res not ok");
        throw new Error("error fetchingissue");
      }
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  async getFullProject(project: any): Promise<any> {
    try {
      const res = await fetch(project.self, {
        method: "GET",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      return data;
    } catch (error) {
      console.log("get full project error");
      console.log(error);
    }
  }

  async getProjectIssueTypeNames(project: any): Promise<string[]> {
    try {
      const res = await fetch(project.self, {
        method: "GET",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      return data.issueTypes.map((issueType) => issueType.name);
    } catch (error) {
      console.log("get issue types error");
      console.log(error);
    }
  }

  async getIssueLinkTypeNames(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseURL}/issueLinkType/`, {
        method: "GET",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      return data.issueLinkTypes.map((issueLinkType) => issueLinkType.name);
    } catch (error) {
      console.log("get issue link types error");
      console.log(error);
    }
  }

  async getFields(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseURL}/field`, {
        method: "GET",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error("some error occurred fetching fields");
      }
    } catch (error) {
      console.log("get fields error");
      console.log(error);
    }
  }

  async getPriorities(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseURL}/priority`, {
        method: "GET",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error("some error occurred fetching priorities");
      }
    } catch (error) {
      console.log("get priorities error");
      console.log(error);
    }
  }

  async getAssignableUsers(projectKeys: string[]): Promise<any[]> {
    const projectKeyString = projectKeys.toString();
    try {
      const res = await fetch(
        `${this.baseURL}/user/assignable/multiProjectSearch?projectKeys=${projectKeyString}`,
        {
          method: "GET",
          headers: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            Authorization: `Basic ${base64.encode(
              `${this.username}:${this.password}`
            )}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error("some error occurred fetching users");
      }
    } catch (error) {
      console.log("error fetching users");
      console.log(error);
    }
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
        throw new Error("no issue types from proje");
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
      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/issue/bulk`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        return data.issues;
      } else {
        console.log("res not ok");
        const err = await data;
        throw new Error(err.message);
      }
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
      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/issue/bulk`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        return data.issues;
      } else {
        const err = await data;
        throw new Error(err.message);
      }
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
      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/issue/bulk`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        return data.issues;
      } else {
        const err = await data;
        throw new Error(err.message);
      }
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

      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/issue/bulk`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        return data.issues;
      } else {
        console.log("res not ok");
        const err = await data;
        throw new Error(err.message);
      }
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  // fetch current user
  async getMyself(): Promise<any> {
    try {
      const res = await fetch(`${this.baseURL}/myself`, {
        method: "GET",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("error getting self");
      console.log(error);
    }
  }

  async createProject(
    description: string,
    leadAccountId: string,
    projectTemplateKey: string,
    name: string,
    key: string
  ): Promise<any> {
    const bodyData = JSON.stringify({
      description,
      leadAccountId,
      projectTemplateKey,
      name,
      key,
    });
    try {
      const res = await fetch(`${this.baseURL}/project`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("error from create project");
      console.log(error);
    }
  }

  async createProjectVersion(projectId): Promise<any> {
    const selectedProjectVersionIndex = getRandomWholeNumber(
      rngCreateProjectVersion,
      versions.length
    );
    const selectedProjectVersion = versions[selectedProjectVersionIndex];
    selectedProjectVersion.projectId = projectId;
    const bodyData = JSON.stringify(selectedProjectVersion);
    try {
      const res = await fetch(`${this.baseURL}/version/`, {
        method: "POST",
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Basic ${base64.encode(
            `${this.username}:${this.password}`
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        console.log("res not ok");
        throw new Error("error fetchingissue");
      }
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  async createLink(
    outwardIssueKey: string,
    inwardIssueKey: string,
    linkTypeName: string
  ): Promise<void> {
    if (inwardIssueKey !== outwardIssueKey) {
      const bodyData = JSON.stringify({
        outwardIssue: {
          key: outwardIssueKey,
        },
        inwardIssue: {
          key: inwardIssueKey,
        },
        type: {
          name: linkTypeName,
        },
      });
      try {
        const res = await fetch(`${this.baseURL}/issueLink/`, {
          method: "POST",
          headers: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            Authorization: `Basic ${base64.encode(
              `${this.username}:${this.password}`
            )}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: bodyData,
        });
        // NOTE: returns invalid json. res.json() gives error
        // console.log(await res.json());
        if (!res.ok) {
          console.log("res not ok");
          throw new Error("error fetchingissue");
        }
      } catch (error) {
        console.log("caught error");
        console.log(error);
      }
    }
  }

  async addStatusInfo(issue): Promise<void> {
    try {
      let transitionsData = await fetch(
        `${this.baseURL}/issue/${issue.key}/transitions`,
        {
          method: "GET",
          headers: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            Authorization: `Basic ${base64.encode(
              `${this.username}:${this.password}`
            )}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      transitionsData = await transitionsData.json();
      const transitions = transitionsData.transitions;
      const selectedTransitionIndex = getRandomWholeNumber(
        rngTransition,
        transitions.length
      );
      const transitionId = transitions[selectedTransitionIndex].id;
      const bodyData = JSON.stringify({
        transition: {
          id: transitionId,
        },
      });
      const res = await fetch(
        `${this.baseURL}/issue/${issue.key}/transitions`,
        {
          method: "POST",
          headers: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            Authorization: `Basic ${base64.encode(
              `${this.username}:${this.password}`
            )}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: bodyData,
        }
      );
      if (!res.ok) {
        console.log(res.statusText);
        console.log("res not ok");
        const data = await res.json();
        console.log(data);
        throw new Error("error setting status");
      }
    } catch (error) {
      console.log("caught status error");
      console.log(error);
    }
  }
}
