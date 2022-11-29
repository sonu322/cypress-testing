import config from "./config";
import API from "./api";
import * as Util from "./util";

const noOfRecords = config.noOfRecords;
// const noOfProjects = 2;
const api = new API(config.baseURL, config.username, config.password);
const maxLinks = 2;
const maxVersions = 5;

// Random number generators
const linksRNG = Util.getRNG("linksRNG");
const linkFinderRNG = Util.getRNG("linkFinderRNG");
const linkTypesRNG = Util.getRNG("linkTypesRNG");
const versionsRNG = Util.getRNG("versionsRNG");
const parentIssueNumberRNG = Util.getRNG("no-of-parent-issues");
const epicIssueNumberRNG = Util.getRNG("epic-issues");
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
        "bug-next-v4",
        "BUN3"
      )
    );
    console.log("in gen project");
    console.log(projects);
    projects.push(
      await api.createProject(
        "sample description",
        myself.accountId,
        "com.pyxis.greenhopper.jira:gh-simplified-scrum-classic",
        "bug-classic-v4",
        "BUC4"
      )
    ); // classic project
    return projects;
  },
  async generateEpics(
    project: any,
    noOfIssues: number,
    epicName: string,
    epicIssueTypeName: string
  ) {
    console.log("PROJECT!!!!!!!!!!!!!!!!!!!!!");
    const fullProject = await api.getFullProject(project);
    console.log(fullProject.style);
    let epicIssues = [];
    if (fullProject.style !== "next-gen") {
      const fields = await api.getFields();
      const epicNameField = fields.find((field) => field.name === "Epic Name");
      if (epicNameField === undefined) {
        throw new Error("epic name field is undefined.");
      }
      console.log("epic: ", epicNameField.id);
      const epiNameFieldId = epicNameField.id;

      epicIssues = await api.createEpicIssuesInBulk(
        project,
        noOfIssues,
        epicIssueTypeName,
        epicName,
        epiNameFieldId
      );
    } else {
      epicIssues = await api.createEpicIssuesInBulk(
        project,
        noOfIssues,
        epicIssueTypeName
      );
    }
    return epicIssues;
  },

  async generateSubtasks(project, noOfIssues, subtaskFieldName, parentIssues) {
    const parentIssueKeys = parentIssues.map((parentIssue) => parentIssue.key);
    const childIssues = await api.createSubtasksInBulk(
      project,
      noOfIssues,
      subtaskFieldName,
      parentIssueKeys
    );
    return childIssues;
  },
  async generateIssues(projects: any, noOfIssues: number): Promise<any[]> {
    console.log("in gen issues");
    console.log(projects);
    let issues: any[] = [];
    for (let i = 0; i < projects.length; i++) {
      const issueTypeNames = await api.getProjectIssueTypeNames(projects[i]);
      const parentIssueTypeNames = issueTypeNames.filter(
        (type) => !type.includes("Sub") && !(type === "Epic")
      );
      // parents
      console.log("creating parent issues");
      const noOfParents = Util.getRandomPositiveNumber(
        parentIssueNumberRNG,
        // noOfIssues
        5
      );
      let parentIssues = await api.createIssuesInBulk(
        projects[i],
        noOfParents,
        parentIssueTypeNames
      );
      console.log("RESULTATNT ISSSUES");
      console.log(parentIssues);
      if (parentIssues.length > 0) {
        issues = issues.concat(parentIssues);
      }

      // adding epic issues
      console.log("creating epic issues");
      const noOfEpics = Util.getRandomPositiveNumber(
        epicIssueNumberRNG,
        // noOfIssues
        5
      );
      const epicIssues = await module.generateEpics(
        projects[i],
        noOfEpics,
        "my-epic",
        "Epic"
      );
      if (epicIssues.length > 0) {
        issues = issues.concat(epicIssues);
      }

      // add subtasks to parents
      console.log("creating subtask issues");
      const subtaskIssueTypeName = issueTypeNames.find((type) =>
        type.includes("Sub")
      );
      parentIssues = parentIssues.concat(epicIssues);
      const childIssues = await module.generateSubtasks(
        projects[i],
        noOfIssues,
        subtaskIssueTypeName,
        parentIssues
      );
      if (childIssues.length > 0) {
        issues = issues.concat(childIssues);
      }

      const otherIssueTypeNames = issueTypeNames.filter(
        (type) => !type.includes("Sub") && !(type === "Epic")
      );
      // other issues
      console.log("creating other issues");
      const otherIssues = await api.createIssuesInBulk(
        projects[i],
        noOfIssues,
        otherIssueTypeNames
      );
      console.log("OTHER ISSSUES");
      console.log(otherIssues);
      if (otherIssues.length > 0) {
        issues = issues.concat(otherIssues);
      }
    }

    console.log(
      "-----------------------------ALL ISSUES-----------------------------"
    );
    console.log(issues);
    console.log("----------------------------------------------------------");
    return issues;
  },

  async generateLinks(issues: any[]) {
    const linkTypeNames: any[] = await api.getIssueLinkTypeNames(); // TODO: fetch all the link types available
    console.log("FETCTHDE LINK TYPES!!");
    console.log(linkTypeNames);
    console.log("issues");
    console.log(issues);
    console.log("-----------------------------------------------------");

    for (const issue of issues) {
      const noOfLinks = Util.getRandomPositiveNumber(linksRNG, maxLinks + 1);
      console.log("NO OF LINKS", noOfLinks);
      for (let j = 0; j < noOfLinks; j++) {
        const issueIndex = Util.getRandomWholeNumber(
          linkFinderRNG,
          issues.length
        );
        const linkTypeIndex = Util.getRandomWholeNumber(
          linkTypesRNG,
          linkTypeNames.length
        );
        console.log(issueIndex, linkTypeIndex);
        await api.createLink(
          issue.key,
          issues[issueIndex].key,
          linkTypeNames[linkTypeIndex]
        );
      }
    }
  },

  async generateVersions(project: any): Promise<any[]> {
    console.log(project);
    const noOfVersions = Util.getRandomWholeNumber(versionsRNG, maxVersions);
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

  if (projects.length > 0) {
    const issues: any[] = await module.generateIssues(projects, noOfIssues);
    if (issues.length > 0) {
      console.log("issues are there");
      console.log(issues.length);
      await module.generateLinks(issues);
    }
  }
};

void generateData();
