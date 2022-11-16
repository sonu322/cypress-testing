export default class LXPAPI {
  private baseURL: string;
  private username: string;
  private password: string;

  constructor(baseURL: string, username: string, password: string){
    this.baseURL = baseURL;
    this.username = username;
    this.password = password;
  }
  
  async createIssue(): Promise<any> {
    throw Error("Method not implemented");
  }

  async createProject(): Promise<any> {
    throw Error("Method not implemented");
  }

  async createVersion(): Promise<any> {
    throw Error("Method not implemented");
  }

  async createLink(issueId1: string, issueId2: string, linkTypeId: string): Promise<any> {
    throw Error("Method not implemented");
  }
}