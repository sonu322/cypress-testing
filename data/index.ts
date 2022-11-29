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
        "call-13",
        "CB13"
      )
    );
    console.log("in gen project");
    console.log(projects);
    projects.push(
      await api.createProject(
        "sample description",
        myself.accountId,
        "com.pyxis.greenhopper.jira:gh-simplified-scrum-classic",
        "call-14",
        "CB14"
      )
    ); // classic project
    return projects;
  },
  async generateEpics(
    project: any,
    numberOfIssues: number,
    epicName: string,
    epicIssueTypeName: string,
    projectStyle: string,
    fields: any[]
  ) {
    const epicNameField = fields.find((field) => field.name === "Epic Name");
    const epicNameFieldKey = epicNameField.key;
    const epicIssues = await api.createEpicIssuesInBulk(
      project.key,
      numberOfIssues,
      epicIssueTypeName,
      epicName,
      epicNameFieldKey,
      projectStyle
    );
    return epicIssues;
  },

  // async generateChildIssues(
  //   project,
  //   noOfIssues,
  //   childIssueTypeNames,
  //   epicIssues,
  //   projectStyle,
  //   fields
  // ) {
  //   const epicIssueKeys = epicIssues.map((epicIssue) => epicIssue.key);
  //   const epicLinkField = fields.map((field) => field.name === "Epic Link");
  //   const epicLinkFieldKey = epicLinkField.key;
  //   const childIssues = await api.createEpicChildrenInBulk(
  //     project,
  //     noOfIssues,
  //     childIssueTypeNames,
  //     epicIssueKeys,
  //     projectStyle,
  //     epicLinkFieldKey
  //   );
  //   return childIssues;
  // },

  async generateSubtasks(
    projectKey: string,
    noOfIssues: number,
    subtaskFieldName: string,
    parentIssues: any[]
  ): Promise<any[]> {
    const parentIssueKeys = parentIssues.map((parentIssue) => parentIssue.key);
    const childIssues = await api.createSubtasksInBulk(
      projectKey,
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
      console.log("PROJECT!!!!!!!!!!!!!!!!!!!!!");
      const fullProject = await api.getFullProject(projects[i]);
      console.log(fullProject.style);

      const issueTypeNames = fullProject.issueTypes.map(
        (issueType) => issueType.name
      );
      const projectStyle = fullProject.style;
      const parentIssueTypeNames = issueTypeNames.filter(
        (type) => !type.includes("Sub") && !(type === "Epic")
      );
      const fields = await api.getFields();
      // creating parents
      console.log("creating parent issues");
      const noOfParents = Util.getRandomPositiveNumber(
        parentIssueNumberRNG,
        // noOfIssues
        5
      );
      // eslint-disable-next-line prefer-const
      let parentIssues = await api.createIssuesInBulk(
        projects[i],
        noOfParents,
        parentIssueTypeNames
      );
      console.log("PARENT ISSSUES");
      console.log(parentIssues);
      if (parentIssues.length > 0) {
        issues = issues.concat(parentIssues);
      }

      // // adding epic issues
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
        "Epic",
        projectStyle,
        fields
      );
      if (epicIssues.length > 0) {
        issues = issues.concat(epicIssues);
      }
      // add child issues for epics

      // console.log("creating chil issues fro epics");
      // const childIssueTypeNames = issueTypeNames.filter(
      //   (type) => !type.includes("Sub") && !(type === "Epic")
      // );
      // const childIssues = await module.generateChildIssues(
      //   projects[i],
      //   noOfIssues,
      //   childIssueTypeNames,
      //   epicIssues,
      //   projectStyle,
      //   fields
      // );
      // if (childIssues.length > 0) {
      //   issues = issues.concat(childIssues);
      // }

      // add subtasks to parents
      console.log("creating subtask issues");
      const subtaskIssueTypeName = issueTypeNames.find((type) =>
        type.includes("Sub")
      );
      // parentIssues = parentIssues.concat(childIssues);
      const subtasks = await module.generateSubtasks(
        projects[i].key,
        noOfIssues,
        subtaskIssueTypeName,
        parentIssues
      );
      if (subtasks.length > 0) {
        issues = issues.concat(subtasks);
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
      // await module.generateLinks(issues);
    }
  }
};

void generateData();
