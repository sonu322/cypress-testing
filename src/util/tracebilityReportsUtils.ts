import {Issue, IssueWithPopulatedLinks, PopulatedIssueLink} from "../types/api";
import {download, toTitleCase} from "./index";

const getIssue = (id: string, issues: Issue[]): Issue | null => {
  return issues.find((issue) => issue.id === id) ?? null;
};

export const getIssuesJQLString = (issues: Issue[]): string => {
  const ids = getLinkedIssueIds(issues);
  return getJQLStringFromIds(ids);
};

export const populateClassifiedAndLinks = (
  issuesHolder,
  currentLink: PopulatedIssueLink,
  links: string[],
  selectedTableFieldIds
): void => {
  const {issue} = currentLink;
  const selectedIssueTypeIds: string[] =
    selectedTableFieldIds.get("issueTypes");
  if (selectedIssueTypeIds.includes(issue.type.id)) {
    const {name} = currentLink;
    if (!links.includes(name)) {
      links.push(name);
    }
    // if (allRelatedIssues !== null) {
    //   const fullIssue = getIssue(issue.id, allRelatedIssues);
    //   if (fullIssue != null) {
    //     if (!issuesHolder[name]) issuesHolder[name] = [];
    //     issuesHolder[name].push(fullIssue);
    //   }
    // } else {
    //   if (issue != null) {
    //     if (!issuesHolder[name]) issuesHolder[name] = [];
    //     issuesHolder[name].push(issue);
    //   }
    // }
  }
};

export const processIssues = (selectedTableFieldIds, filteredIssues) => {
  const links: string[] = [];
  const classifieds = [];
  filteredIssues.forEach((issue: IssueWithPopulatedLinks) => {
    const classified = {};
    // if (
    //   Boolean(fields.parent) &&
    //   Boolean(
    //     selectedTableFieldIds
    //       .get("issueTypes")
    //       .includes(fields.parent.fields.issuetype.id)
    //   )
    // ) {
    //   if (allRelatedIssues !== null) {
    //     const parentIssue = getIssue(fields.parent.id, allRelatedIssues);
    //     if (parentIssue != null) {
    //       classified.parent = parentIssue;
    //     }
    //   } else {
    //     classified.parent = fields.parent;
    //   }
    // }

    // if (fields.subtasks != null) {
    //   const subtasks = fields.subtasks.filter((issue: Issue) =>
    //     selectedTableFieldIds.get("issueTypes").includes(issue.issuetype.id)
    //   );
    //   if (allRelatedIssues !== null) {
    //     const fullSubtasks: Issue[] = [];
    //     subtasks.forEach((subtask: Issue) => {
    //       const fullSubtask = getIssue(subtask.id, allRelatedIssues);
    //       if (fullSubtask != null) {
    //         fullSubtasks.push(fullSubtask);
    //       }
    //     });
    //     classified.subtasks = fullSubtasks;
    //   } else {
    //     classified.subtasks = subtasks;
    //   }
    // }
    issue.links.forEach((link) => {
      const selectedLinkIds: string[] = selectedTableFieldIds.get("linkTypes");
      if (selectedLinkIds.includes(link.linkTypeId)) {
        populateClassifiedAndLinks(
          classified,
          link,
          links,
          selectedTableFieldIds
        );
      }
    });
    classifieds.push(classified);
  });

  links.sort();
  links.unshift("subtasks");
  return {
    classifieds,
    links,
  };
};

export const exportReport = (selectedTableFieldIds, filteredIssues): void => {
  const {classifieds, links} = processIssues(
    selectedTableFieldIds,
    filteredIssues,
    null
  );

  let content = "";
  const headerLinks = ["Issue", "Parent"];
  links.forEach((link) => {
    headerLinks.push(`"${toTitleCase(link)}"`);
  });
  let header = headerLinks.toString();
  header = header += "\n";
  content += header;

  classifieds.forEach((classified) => {
    const rowItems = [];
    links.forEach((link) => {
      let item = [];
      if (classified[link] && classified[link].length > 0) {
        classified[link].forEach((issue) => {
          if (issue && issue.key) {
            item.push(issue.key);
          } else {
            item.push("err");
          }
        });
        item = item.toString();
      } else {
        item = "--";
      }
      rowItems.push(`"${item}"`);
    });
    if (classified.parent) {
      rowItems.unshift(`"${classified.parent.key}"`);
    } else {
      rowItems.unshift("--");
    }
    rowItems.unshift(`"${classified.issue.key}"`);

    let rowContent = rowItems.toString();
    rowContent = rowContent += "\n";
    content += rowContent;
  });
  download("csv", content);
};
