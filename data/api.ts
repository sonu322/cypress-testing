import axios from "axios";
import fetch from "node-fetch";
import JiraApi from "jira-client";
import { getRandomNumber, getRNG } from "./util";
const base64 = require("base-64");

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
    // this._axios = axios.create({ baseURL: this.baseURL });
    // this.jira = new JiraApi({
    //   protocol: "https",
    //   host: baseURL,
    //   username: username,
    //   password: password,
    //   apiVersion: "3",
    //   strictSSL: true,
    // });
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
    epicFieldId: string,
    parentKey: string
  ): any {
    const issueData: IssueData = {
      fields: {
        summary: "testing epic 2",
        project: {
          key: projectKey,
        },
        issuetype: {
          name: issueTypeName,
        },
      },
    };
    if (issueTypeName === "Epic") {
      issueData.fields[epicFieldId] = "my_epic";
    }
    if (issueTypeName.includes("Sub")) {
      issueData.fields.parent = {
        key: parentKey,
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
    parentKey?: string,
    epicNameFieldId?: string
  ): any[] {
    const rng = getRNG("issuetype");
    const issues = [];
    for (let i = 0; i < numberOfIssues; i++) {
      let typeIndex1 = getRandomNumber(rng, issueTypeNames.length);
      if (typeIndex1 < 0) {
        typeIndex1 *= -1;
      }
      const typeName1 = issueTypeNames[typeIndex1];
      console.log(typeIndex1, typeName1);
      if (typeName1 === undefined) {
        throw new Error("type NAME undefined");
      }

      const issueData = this._createIssueBodyData(
        project.key,
        typeName1,
        epicNameFieldId,
        parentKey
      );
      issues.push(issueData);
    }
    return issues;
  }

  async createIssuesInBulk(
    project: any,
    noOfIssuesPerProject: number
  ): Promise<any> {
    console.log("called create issues");
    console.log(project);

    try {
      const fields = await this.getFields();
      const epicNameField = fields.find((field) => field.name === "Epic Name");
      if (epicNameField === undefined) {
        throw new Error("epic name field is undefined.");
      }
      console.log("epic: ", epicNameField.id);
      const epiNameFieldId = epicNameField.id;
      const issueTypeNames = await this.getProjectIssueTypeNames(project);

      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(issueTypeNames);
      if (issueTypeNames === undefined) {
        throw new Error("no issue types from proje");
      }

      const parentIssue = await this.createIssue(
        project.key,
        "this is a parent",
        "Task"
      );
      const parentKey = parentIssue.key;
      const issueDataList = this._createIssueDataList(
        project,
        issueTypeNames,
        noOfIssuesPerProject,
        parentKey,
        epiNameFieldId
      );
      // const rng = getRNG("issuetype1");
      // let typeIndex1 = getRandomNumber(rng, issueTypeNames.length);
      // let typeIndex2 = getRandomNumber(rng, issueTypeNames.length);
      // if (typeIndex1 < 0) {
      //   typeIndex1 *= -1;
      // }
      // if (typeIndex2 < 0) {
      //   typeIndex2 *= -1;
      // }
      // const typeName1 = issueTypeNames[typeIndex1];
      // const typeName2 = issueTypeNames[typeIndex2];
      // console.log(typeIndex1, typeName1);
      // console.log(typeIndex2, typeName2);

      // if (typeName1 === undefined || typeName2 === undefined) {
      //   throw new Error("type NAME undefined");
      // }
      // change to a more rigid condition that accepts Sub-task, Subtask
      // let parentKey;
      // if (typeName1.includes("Sub")) {
      //   console.log("hi from handle sub");
      //   const parentIssue = await this.createIssue(
      //     project.key,
      //     "this is a parent",
      //     "Task"
      //   );
      //   parentKey = parentIssue.key;
      // }
      // const issueData1 = this._createIssueBodyData(
      //   project.key,
      //   typeName1,
      //   epiNameFieldId,
      //   parentKey
      // );
      // const issueData2 = this._createIssueBodyData(
      //   project.key,
      //   typeName2,
      //   epiNameFieldId,
      //   parentKey
      // );
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
    issueId1: string,
    issueId2: string,
    linkTypeId: string
  ): Promise<any> {
    console.log("called create issue");
    const bodyData = JSON.stringify({
      outwardIssue: {
        key: "EX-3",
      },
      inwardIssue: {
        key: "EX-4",
      },
      type: {
        name: "Blocks",
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
      if (res.ok) {
        console.log("res ok");
        const data = await res.json();
        console.log(data);
        console.log(res.statusText);
      } else {
        console.log("res not ok");
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (error) {
      console.log("caught error");
      console.log(error);
    }
  }
}
