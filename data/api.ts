import axios from "axios";
import fetch from "node-fetch";
import JiraApi from "jira-client";
let base64 = require("base-64");
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
  async createIssue(): Promise<any> {
    console.log("called create issue");
    const bodyData = JSON.stringify({
      fields: {
        project: {
          key: "EX",
        },
        summary: "sample",
        issuetype: {
          name: "Task",
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
      console.log(await res.text());
      console.log(res.statusText);
    } catch (error) {
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
