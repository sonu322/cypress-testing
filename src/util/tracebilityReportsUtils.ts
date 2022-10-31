import { Issue } from "../types/api";
import { download, toTitleCase } from "./index";


const getIssue = (id: string, issues: Issue[]): Issue | null => {
  return issues.find((issue) => issue.id === id) ?? null;
};



export const getAllRelatedIssueIds = (issues: Issue[]): string[] => {
  const ids: string[] = [];
  issues.forEach((issue) => {
    ids.push(issue.id);
    if (issue.fields.parent !== undefined) {
      ids.push(issue.fields.parent.id);
    }
    if (issue.fields.subtasks !== undefined) {
      issue.fields.subtasks.forEach((subtask: Issue) => {
        ids.push(subtask.id);
      });
    }
    if (issue.fields.issuelinks !== undefined) {
      issue.fields.issuelinks.forEach((currentLink) => {
        const linkedIssue = currentLink.inwardIssue ?? currentLink.outwardIssue;
        ids.push(linkedIssue.id);
      });
    }
  });
  const uniqueIds = [...new Set(ids)];
  return uniqueIds;
};
export const getJQLStringFromIds = (ids: string[]): string => {
  const jqlComponents = ids.map((id) => `id=${id}`);
  const jqlString = jqlComponents.join(" OR ");
  return jqlString;
};
export const getAllRelatedIssuesJQLString = (issues: Issue[]): string => {
  const ids = getAllRelatedIssueIds(issues);
  return getJQLStringFromIds(ids);
};

export const upsurt = (
  issuesHolder,
  currentLink,
  links,
  selectedTableFieldIds,
  allRelatedIssues
): void => {
  const issue = currentLink.inwardIssue ?? currentLink.outwardIssue;

  if (
    selectedTableFieldIds.get("issueTypes").includes(issue.fields.issuetype.id)
  ) {
    const name = currentLink.inwardIssue
      ? currentLink.type.inward
      : currentLink.type.outward;
    if (!links.includes(name)) {
      links.push(name);
    }
    if (allRelatedIssues) {
      const fullIssue = getIssue(issue.id, allRelatedIssues);
      if (fullIssue != null) {
        if (!issuesHolder[name]) issuesHolder[name] = [];
        issuesHolder[name].push(fullIssue);
      }
    } else {
      if (issue != null) {
        if (!issuesHolder[name]) issuesHolder[name] = [];
        issuesHolder[name].push(issue);
      }
    }
  }
};

export const processIssues = (
  selectedTableFieldIds,
  filteredIssues,
  allRelatedIssues
) => {
  const links: string[] = [];
  const classifieds = [];
  filteredIssues.forEach((issue: Issue) => {
    const fields = issue.fields;
    const classified = {
      issue,
    };
    if (
      Boolean(fields.parent) &&
      Boolean(
        selectedTableFieldIds
          .get("issueTypes")
          .includes(fields.parent.fields.issuetype.id)
      )
    ) {
      if (allRelatedIssues) {
        const parentIssue = getIssue(fields.parent.id, allRelatedIssues);
        if (parentIssue != null) {
          classified.parent = parentIssue;
        }
      } else {
        classified.parent = fields.parent;
      }
    }

    if (fields.subtasks != null) {
      const subtasks = fields.subtasks.filter((issue: Issue) =>
        selectedTableFieldIds
          .get("issueTypes")
          .includes(issue.fields.issuetype.id)
      );
      if (allRelatedIssues) {
        const fullSubtasks: Issue[] = [];
        subtasks.forEach((subtask: Issue) => {
          const fullSubtask = getIssue(subtask.id, allRelatedIssues);
          if (fullSubtask != null) {
            fullSubtasks.push(fullSubtask);
          }
        });
        classified.subtasks = fullSubtasks;
      } else {
        classified.subtasks = subtasks;
      }
    }

    if (fields.issuelinks) {
      fields.issuelinks.forEach((link) => {
        if (selectedTableFieldIds.get("linkTypes").includes(link.type.id)) {
          upsurt(
            classified,
            link,
            links,
            selectedTableFieldIds,
            allRelatedIssues
          );
        }
      });
    }
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
  const { classifieds, links } = processIssues(
    selectedTableFieldIds,
    filteredIssues
  );

  let content = "";
  const headerLinks = ["Issue", "Parent"];
  links.forEach((link) => {
    headerLinks.push(`"${toTitleCase(link)}"`);
  });
  let header = headerLinks.toString();
  header = header += "\n";
  // if (header) {
  content += header;
  // } else {
  //   content += `"","","","","","",""\n`;
  // }

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
