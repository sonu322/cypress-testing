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
      issue.fields.subtasks.forEach((subtask) => {
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
) => {
  const issue = currentLink.inwardIssue ?? currentLink.outwardIssue;
  const fullIssue = getIssue(issue.id, allRelatedIssues);
  if (
    selectedTableFieldIds.get("issueTypes").includes(issue.fields.issuetype.id)
  ) {
    let name = currentLink.inwardIssue
      ? currentLink.type.inward
      : currentLink.type.outward;
    if (!links.includes(name)) {
      links.push(name);
    }

    if (fullIssue) {
      if (!issuesHolder[name]) issuesHolder[name] = [];
      issuesHolder[name].push(fullIssue);
    }
  }
};

export const processIssues = (
  selectedTableFieldIds,
  filteredIssues,
  allRelatedIssues
) => {
  const links = [];
  const classifieds = [];
  filteredIssues.forEach((issue) => {
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
      const parentIssue = getIssue(fields.parent.id, allRelatedIssues);
      if (parentIssue != null) {
        classified.parent = parentIssue;
      }
    }

    if (fields.subtasks != null) {
      let subtasks = fields.subtasks.filter((issue) =>
        selectedTableFieldIds
          .get("issueTypes")
          .includes(issue.fields.issuetype.id)
      );
      const fullSubtasks: Issue[] = [];
      subtasks.forEach((subtask) => {
        const fullSubtask = getIssue(subtask.id, allRelatedIssues);
        if (fullSubtask != null) {
          fullSubtasks.push(fullSubtask);
        }
      });
      classified.subtasks = fullSubtasks;
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

export const exportReport = (selectedTableFieldIds, filteredIssues) => {
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
