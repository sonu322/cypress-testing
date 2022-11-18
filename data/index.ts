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
    // {{baseURL}}/rest/api/3/myself
    // get project types

    // team - managed: com.atlassian.jira-core-project-templates:jira-work-management-process-control-team-managed
    // company - managed: com.pyxis.greenhopper.jira:gh-simplified-scrum-classic
    // com.pyxis.greenhopper.jira:gh-simplified-agility-scrum
    // team - com.pyxis.greenhopper.jira:gh-simplified-agility-kanban
    //
    const myself = await api.getMyself();
    console.log(myself);
    const projects: any[] = [];
    projects.push(
      await api.createProject(
        "sample description 400 700 random",
        myself.accountId,
        "com.pyxis.greenhopper.jira:gh-simplified-agility-kanban",
        "issue-test-1",
        "IST1"
      )
    );
    console.log("in gen project");
    console.log(projects);
    // projects.push(
    //   await api.createProject(
    //     "sample description",
    //     myself.accountId,
    //     "com.pyxis.greenhopper.jira:gh-simplified-scrum-classic",
    //     "sample5",
    //     "SAM5"
    //   )
    // ); // classic project// classic project
    // projects.push(await api.createProject()); // non classic project
    return projects;
  },

  async generateIssues(projects: any, noOfIssues: number): Promise<any[]> {
    console.log("in gen issues");
    console.log(projects);
    const issues: any[] = [];
    for (let i = 0; i < projects.length; i++) {
      issues.concat(await api.createIssuesInBulk(projects[i], noOfIssues));
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
  const projects: any[] = await module.generateProjects();
  const noOfIssues = noOfRecords / projects.length;
  // // for (const project of projects) {
  // //   const versions: any[] = await module.generateVersions(project);
  // console.log(projects);

  if (projects.length > 0) {
    const issues: any[] = await module.generateIssues(projects, noOfIssues);
  }

  //   await module.generateLinks(issues);
  // }
};

generateData();