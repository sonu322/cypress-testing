import config from "./config";
import API from "./api";
import * as Util from "./util";
import { mockProjectsData } from "./mockProjectsData";
const { noOfRecords, maxLinks, maxProjectVersions } = config;
const api = new API(config.baseURL, config.username, config.password);

// Random number generators
const linksRNG = Util.getRNG("linksRNG");
const linkFinderRNG = Util.getRNG("linkFinderRNG");
const linkTypesRNG = Util.getRNG("linkTypesRNG");
const parentIssueNumberRNG = Util.getRNG("no-of-parent-issues");
const epicIssueNumberRNG = Util.getRNG("epic-issues");
const versionsNumberRNG = Util.getRNG("versions-number");
const module = {
  // generate projects
  async generateProjects(
    mockProjectsData: Array<{
      description: string;
      projectTemplateKey: string;
      name: string;
      key: string;
    }>
  ): Promise<any[]> {
    const myself = await api.getMyself();
    const promises: Array<Promise<any>> = [];
    mockProjectsData.forEach((projectData) => {
      promises.push(
        api.createProject(
          projectData.description,
          myself.accountId,
          projectData.projectTemplateKey,
          projectData.name,
          projectData.key
        )
      );
    });
    const projects = await Promise.all(promises);
    return projects;
  },

  // generate epic issues
  async generateEpics(
    project: any,
    numberOfIssues: number,
    epicName: string,
    epicIssueTypeName: string,
    projectStyle: string,
    fields: any[],
    versionIds,
    storyPointsFieldKey,
    shouldSetStoryPointsEstimate
  ) {
    const epicNameField = fields.find((field) => field.name === "Epic Name");
    const epicNameFieldKey = epicNameField.key;
    const epicIssues = await api.createEpicIssuesInBulk(
      project.key,
      numberOfIssues,
      epicIssueTypeName,
      epicName,
      epicNameFieldKey,
      projectStyle,
      versionIds,
      storyPointsFieldKey,
      shouldSetStoryPointsEstimate
    );
    return epicIssues;
  },

  // generate epic child issues
  async generateEpicChildIssues(
    project: any,
    numberOfIssues: number,
    childIssueTypeNames: string[],
    epicIssues: any[],
    projectStyle: string,
    fields: any[],
    versionIds,
    storyPointsFieldKey,
    shouldSetStoryPointsEstimate
  ) {
    const epicIssueKeys = epicIssues.map((epicIssue) => epicIssue.key);
    const epicLinkField = fields.find((field) => field.name === "Epic Link");
    const epicLinkFieldKey = epicLinkField.key;
    const childIssues = await api.createEpicChildrenInBulk(
      project.key,
      numberOfIssues,
      childIssueTypeNames,
      epicIssueKeys,
      projectStyle,
      epicLinkFieldKey,
      versionIds,
      storyPointsFieldKey,
      shouldSetStoryPointsEstimate
    );
    return childIssues;
  },

  // generate Subtasks
  async generateSubtasks(
    projectKey: string,
    noOfIssues: number,
    subtaskFieldName: string,
    parentIssues: any[],
    projectStyle: string,
    versionIds
  ): Promise<any[]> {
    const parentIssueKeys = parentIssues.map((parentIssue) => parentIssue.key);
    const childIssues = await api.createSubtasksInBulk(
      projectKey,
      noOfIssues,
      subtaskFieldName,
      parentIssueKeys,
      projectStyle,
      versionIds,
      false
    );
    return childIssues;
  },

  async generateAllIssues(
    projects: any,
    numberOfIssues: number
  ): Promise<any[]> {
    let issues: any[] = [];
    // loop through projects
    for (let i = 0; i < projects.length; i++) {
      const fullProject = await api.getFullProject(projects[i]);
      const issueTypeNames = fullProject.issueTypes.map(
        (issueType) => issueType.name
      );
      const numberOfIssuesPerType = numberOfIssues / issueTypeNames.length;
      const projectStyle = fullProject.style;
      const projectType = fullProject.projectTypeKey;
      const shouldSetStoryPointsEstimate =
        projectStyle === "next-gen" &&
        projectType === "software" &&
        fullProject.issueTypes.length > 3;

      // get issue fields -> used for finding ids of custom fields like story points
      const fields = await api.getFields();

      // get story points field name
      const storyPointsField = fields.find((field) =>
        projectStyle === "classic"
          ? field.name === "Story Points"
          : field.name === "Story point estimate"
      );
      const storyPointsFieldKey = storyPointsField.key;

      // create project versions
      const versionIds = [];
      if (projectStyle === "classic") {
        const numberOfVersions = Util.getRandomWholeNumber(
          versionsNumberRNG,
          maxProjectVersions
        );
        if (numberOfVersions > 0) {
          for (let i = 0; i < numberOfVersions; i++) {
            const version = await api.createProjectVersion(fullProject.id);
            versionIds.push(version.id);
          }
        }
      }

      // get issue types that can be parent issues
      const parentIssueTypeNames = issueTypeNames.filter(
        (type) => !type.includes("Sub") && !(type === "Epic")
      );

      // create parents
      const noOfParents = Util.getRandomPositiveNumber(
        parentIssueNumberRNG,
        numberOfIssuesPerType
      );
      // eslint-disable-next-line prefer-const
      let parentIssues = await api.createIssuesInBulk(
        projects[i],
        projectStyle,
        noOfParents,
        parentIssueTypeNames,
        storyPointsFieldKey,
        versionIds,
        shouldSetStoryPointsEstimate
      );
      if (parentIssues.length > 0) {
        issues = issues.concat(parentIssues);
      }

      // create epic issues
      const noOfEpics = Util.getRandomPositiveNumber(
        epicIssueNumberRNG,
        numberOfIssuesPerType
      );
      const epicIssues = await module.generateEpics(
        projects[i],
        noOfEpics,
        "my-epic",
        "Epic",
        projectStyle,
        fields,
        versionIds,
        storyPointsFieldKey,
        false
      );
      if (epicIssues.length > 0) {
        issues = issues.concat(epicIssues);
      }

      // create child issues for epics
      const childIssueTypeNames = issueTypeNames.filter(
        (type) => !type.includes("Sub") && !(type === "Epic")
      );
      const childIssues = await module.generateEpicChildIssues(
        projects[i],
        numberOfIssuesPerType,
        childIssueTypeNames,
        epicIssues,
        projectStyle,
        fields,
        versionIds,
        storyPointsFieldKey,
        shouldSetStoryPointsEstimate
      );
      if (childIssues.length > 0) {
        issues = issues.concat(childIssues);
      }

      // add subtasks to parents
      const subtaskIssueTypeName = issueTypeNames.find((type) =>
        type.includes("Sub")
      );
      parentIssues = parentIssues.concat(childIssues);
      const subtasks = await module.generateSubtasks(
        projects[i].key,
        numberOfIssuesPerType,
        subtaskIssueTypeName,
        parentIssues,
        projectStyle,
        versionIds
      );
      if (subtasks.length > 0) {
        issues = issues.concat(subtasks);
      }

      // get issue types that are not subtasks or epics
      const otherIssueTypeNames = issueTypeNames.filter(
        (type) => !type.includes("Sub") && !(type === "Epic")
      );

      // create other issues
      const otherIssues = await api.createIssuesInBulk(
        projects[i],
        projectStyle,
        numberOfIssuesPerType,
        otherIssueTypeNames,
        storyPointsFieldKey,
        versionIds,
        shouldSetStoryPointsEstimate
      );
      if (otherIssues.length > 0) {
        issues = issues.concat(otherIssues);
      }

      // add issue statuses
      const addStatusPromises = issues.map(
        async (issue) => await api.addStatusInfo(issue)
      );
      await Promise.all(addStatusPromises);
    }

    return issues;
  },

  // generate issue links
  async generateLinks(issues: any[]) {
    const linkTypeNames: any[] = await api.getIssueLinkTypeNames(); // TODO: fetch all the link types available

    for (const issue of issues) {
      const noOfLinks = Util.getRandomPositiveNumber(linksRNG, maxLinks + 1);
      for (let j = 0; j < noOfLinks; j++) {
        const issueIndex = Util.getRandomWholeNumber(
          linkFinderRNG,
          issues.length
        );
        const linkTypeIndex = Util.getRandomWholeNumber(
          linkTypesRNG,
          linkTypeNames.length
        );
        await api.createLink(
          issue.key,
          issues[issueIndex].key,
          linkTypeNames[linkTypeIndex]
        );
      }
    }
  },
};

// main logic
const generateData = async (
  mockProjectsData: Array<{
    description: string;
    projectTemplateKey: string;
    name: string;
    key: string;
  }>
): Promise<void> => {
  console.log("generating data");
  console.log("generating projects");
  const projects: any[] = await module.generateProjects(mockProjectsData);
  const noOfIssues = noOfRecords / projects.length;

  if (projects.length > 0) {
    console.log("created projects");
    console.log("generating issues");
    const issues: any[] = await module.generateAllIssues(projects, noOfIssues);
    if (issues.length > 0) {
      console.log("created issues");
      console.log("generating links");
      const response = await module.generateLinks(issues);
      if (response === undefined) {
        console.log("created links");
        console.log("done ✨");
      }
    }
  }
};

void generateData(mockProjectsData);