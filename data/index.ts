import config from "./config";
import API from "./api";
import * as Util from "./util";

const noOfRecords = config.noOfRecords;
const noOfProjects = 2;
const api = new API(config.baseURL, config.username, config.password);
const maxLinks = 10, maxVersions = 5;

// Random number generators
const linksRNG = Util.getRNG("linksRNG");
const linkFinderRNG = Util.getRNG("linkFinderRNG");
const linkTypesRNG = Util.getRNG("linkTypesRNG");
const versionsRNG = Util.getRNG("versionsRNG");

const module = {
  async generateProjects(): Promise<any[]> {
    console.log("GEN PROJCECTS CALLEDS");
    const projects: any[] = [];
    projects.push(await api.createProject()); // classic project
    // projects.push(await api.createProject()); // non classic project
    return projects;
  },

  async generateIssues(project: any, noOfIssues: number): Promise<any[]> {
    const issues: any[] = [];
    for (let i = 0; i < noOfIssues; i++) {
      issues.push(await api.createIssue());
    }
    return issues;
  },

  async generateLinks(issues: any[]) {
    const linkTypes: any[] = []; // TODO: fetch all the link types available

    for (const issue of issues) {
      const noOfLinks = Util.getRandomNumber(linksRNG, maxLinks + 1);
      for (let j = 0; j < noOfLinks; j++) {
        const issueIndex = Util.getRandomNumber(linkFinderRNG, issues.length);
        const linkTypeIndex = Util.getRandomNumber(
          linkTypesRNG,
          linkTypes.length
        );
        await api.createLink(
          issue.id,
          issues[issueIndex].id,
          linkTypes[linkTypeIndex].id
        );
      }
    }
  },

  async generateVersions(project: any): Promise<any[]> {
    const noOfVersions = Util.getRandomNumber(versionsRNG, maxVersions);
    const versions: any[] = [];
    for (let i = 0; i < noOfVersions; i++) {
      versions.push(await api.createVersion());
    }
    return versions;
  },
};

// main logic
const generateData = async (): Promise<void> => {
  console.log("called generate data");
  // const projects: any[] = await module.generateProjects();
  // const noOfIssues = noOfRecords / projects.length;
  // for (const project of projects) {
  //   // const versions: any[] = await module.generateVersions(project);
  //   const issues: any[] = await module.generateIssues(project, noOfIssues);
  //   // await module.generateLinks(issues);
  // }
  const issue = await module.generateIssues("", 1);
};

generateData();
