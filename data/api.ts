import fetch from "node-fetch";
import { getRandomWholeNumber, getRNG } from "./util";
import mockIssueData from "./mockIssueData";
const base64 = require("base-64");
const rngIssueData = getRNG("mockissuedata");
const rngParentKey = getRNG("parent");
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
    console.log("called create issueeeeeeeeeeeee");
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
      const res = await fetch(`${this.baseURL}/rest/api/3/issue/`, {
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
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        console.log("res ok");
        console.log("RETURNED ISSUE DATA");
        console.log(data);
        console.log(res.statusText);
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
    console.log("calling full project");
    console.log(project.self);
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
      console.log(res.statusText);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getProjectIssueTypeNames(project: any): Promise<string[]> {
    console.log("calling issue type ids");
    console.log(project.self);
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
      console.log(res.statusText);

      return data.issueTypes.map((issueType) => issueType.name);
    } catch (error) {
      console.log(error);
    }
  }

  async getIssueLinkTypeNames(): Promise<string[]> {
    console.log("calling issue link type names");
    try {
      const res = await fetch(`${this.baseURL}/rest/api/3/issueLinkType/`, {
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
      console.log(res.statusText);
      console.log("links!!!!!!!!!!!!!!");
      console.log(data);

      return data.issueLinkTypes.map((issueLinkType) => issueLinkType.name);
    } catch (error) {
      console.log(error);
    }
  }

  async getFields(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseURL}/rest/api/3/field`, {
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
        console.log("FIELDS!!!!");
        console.log(data);
        return data;
      } else {
        throw new Error("some error occurred fetching fields");
      }
    } catch (error) {
      console.log(error);
    }
  }

  _createIssueBodyData(
    projectKey: string,
    issueTypeName: string,
    rngIssueData: any,
    epicFieldId?: string,
    parentIssueKeys?: string[],
    epicName?: string
  ): any {
    console.log("CREATE BODY DATA CALLED");
    const mockIssueIndex = getRandomWholeNumber(
      rngIssueData,
      mockIssueData.length
    );
    console.log("mock issue index", mockIssueIndex);
    const issueData: IssueData = {
      fields: {
        summary: mockIssueData[mockIssueIndex].summary,
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
      },
    };
    if (issueTypeName === "Epic") {
      issueData.fields[epicFieldId] = epicName;
    }
    if (issueTypeName.includes("Sub")) {
      console.log("PARENT KEYS!!!!!!!!!!!!!!!!");
      console.log(parentIssueKeys);
      const chosenIndex = getRandomWholeNumber(
        rngParentKey,
        parentIssueKeys.length
      );
      const chosenParentKey = parentIssueKeys[chosenIndex];
      console.log("CHOSEN PARENT", chosenIndex, chosenParentKey);
      issueData.fields.parent = {
        key: chosenParentKey,
      };
    }
    console.log("----------------------------");
    console.log(issueData);
    console.log("-------------------------------");
    return issueData;
  }

  _createIssueDataList(
    project: any,
    issueTypeNames: string[],
    numberOfIssues: number,
    parentIssueKeys?: string[],
    epicNameFieldId?: string,
    epicName?: string
  ): any[] {
    console.log("CREATE DATA LIST CALLED");
    console.log(numberOfIssues);
    const rng = getRNG("issuetype");
    const issues = [];
    for (let i = 0; i < numberOfIssues; i++) {
      let typeIndex1 = 0;
      if (issueTypeNames.length > 1) {
        typeIndex1 = getRandomWholeNumber(rng, issueTypeNames.length);
      }

      const typeName1 = issueTypeNames[typeIndex1];
      console.log(typeIndex1, typeName1);
      if (typeName1 === undefined) {
        throw new Error("type NAME undefined");
      }

      const issueData = this._createIssueBodyData(
        project.key,
        typeName1,
        rngIssueData,
        epicNameFieldId,
        parentIssueKeys,
        epicName
      );
      issues.push(issueData);
    }
    return issues;
  }

  async createIssuesInBulk(
    project: any,
    noOfIssuesPerProject: number,
    issueTypeNames: string[]
  ): Promise<any[]> {
    console.log("called create issues");

    try {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(issueTypeNames);
      if (issueTypeNames === undefined) {
        throw new Error("no issue types from proje");
      }
      console.log("calling data list");
      const issueDataList = this._createIssueDataList(
        project,
        issueTypeNames,
        noOfIssuesPerProject
      );
      if (issueDataList.length === 0) {
        throw new Error("no data list");
      }
      console.log("------------------------------");
      console.log(issueDataList);
      console.log("------------------------------");
      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/rest/api/3/issue/bulk`, {
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
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        console.log("res ok");
        console.log(data);
        console.log(res.statusText);
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

  async createEpicIssuesInBulk(
    project: any,
    noOfIssues: number,
    epicIssueTypeName: string,
    epicName?: string,
    epiNameFieldId?: string
  ): Promise<any[]> {
    console.log("-------------------------------------");
    console.log("called create epic issues");

    try {
      const issueDataList = this._createIssueDataList(
        project,
        [epicIssueTypeName],
        noOfIssues,
        undefined,
        epiNameFieldId,
        epicName
      );
      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/rest/api/3/issue/bulk`, {
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
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        console.log("epic res ok");
        console.log(data);
        console.log(res.statusText);
        return data.issues;
      } else {
        console.log("epic res not ok");
        const err = await data;
        throw new Error(err.message);
      }
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }

  async createSubtasksInBulk(
    project: any,
    noOfIssues: number,
    subtaskFieldName: string,
    parentIssueKeys: string[]
  ): Promise<any[]> {
    console.log("-------------------------------------");
    console.log("called create subtask issues");

    try {
      const issueDataList = this._createIssueDataList(
        project,
        [subtaskFieldName],
        noOfIssues,
        parentIssueKeys
      );
      const bodyData = JSON.stringify({
        issueUpdates: issueDataList,
      });
      const res = await fetch(`${this.baseURL}/rest/api/3/issue/bulk`, {
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
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        console.log("subtask res ok");
        console.log(data);
        console.log(res.statusText);
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

  async getMyself(): Promise<any> {
    try {
      const res = await fetch(`${this.baseURL}/rest/api/3/myself`, {
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
    console.log("CALLED CREATE PROJECCT");
    try {
      const res = await fetch(`${this.baseURL}/rest/api/3/project`, {
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
      console.log(data);
      console.log(res.statusText);
      return data;
    } catch (error) {
      console.log("error from create project");
      console.log(error);
    }
  }

  async createVersion(): Promise<any> {
    throw Error("Method not implemented");
  }

  async createLink(
    outwardIssueKey: string,
    inwardIssueKey: string,
    linkTypeName: string
  ): Promise<any> {
    console.log("called create link", linkTypeName);
    console.log("outward", outwardIssueKey);
    console.log("inward", inwardIssueKey);
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
      const res = await fetch(`${this.baseURL}/rest/api/3/issueLink/`, {
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
      console.log(res);
      // NOTE: returns invalid json. res.json() gives error
      // console.log(await res.json());
      if (res.ok) {
        console.log("res ok");
        console.log(res.statusText);
      } else {
        console.log("res not ok");
        throw new Error("error fetchingissue");
      }
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }
}
