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
    throw Error("Method not implemented");
  }

  async createProject(): Promise<any> {
    console.log("CALLED CREATE PROJECCT");
    const res = await fetch(`${this.baseURL}/rest/api/3/priority/`, {
      method: "GET",
      headers: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        Authorization: `Basic ${base64.encode(
          `${this.username}:${this.password}`
        )}`,
        "Content-Type": "application/json",
      },
    });
    console.log(await res.json());
    console.log();
    console.log(res.statusText);
  }

  async createVersion(): Promise<any> {
    throw Error("Method not implemented");
  }

  async createLink(
    issueId1: string,
    issueId2: string,
    linkTypeId: string
  ): Promise<any> {
    throw Error("Method not implemented");
  }
}
