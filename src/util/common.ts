// writing all new common utils here.
import { ThemeAppearance } from "@atlaskit/lozenge";
import { lastSavedReportConfigKey } from "../constants/common";
import { Issue, IssueField, IssueStatus } from "../types/api";
import { LastSavedReportConfig } from "../types/app";
export const getKeyValues = (
  objArray: Array<{
    [key: string]: any;
  }>,
  key: string
): string[] => {
  return objArray.map((obj) => obj[key]);
};
// TODO: add types so that, all objects contain the selected key property

export const getItemInLocalStorage = (key: string): any => {
  try {
    const strigifiedLastSavedReportConfig = window.localStorage.getItem(key);
    const lastSavedReportConfig = JSON.parse(strigifiedLastSavedReportConfig);
    return lastSavedReportConfig;
  } catch(err){
    console.error(err);
  }
};

export const setItemInLocalStorage = (key: string, value: any): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch(err){
    console.error(err);
  }
};

export const removeDuplicates = (items: string[]): string[] => {
  const result: string[] = [];
  const map = {};
  if(items && items.length > 0){
    for(const item of items){
      if(map[item] === undefined){
        result.push(item);
        map[item] = item;
      }
    }
  }
  return result;
};

export const getKeyMap = (
  map: Map<
    string,
    {
      values: any[];
      [otherKeys: string]: any;
    }
  >,
  targetKey: string
): Map<string, string[]> => {
  const newMap = new Map<string, string[]>();
  for (const [key, value] of map.entries()) {
    newMap.set(key, getKeyValues(value.values, targetKey));
  }
  return newMap;
};

export const isPromise = (p): boolean => {
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }

  return false;
};

export const getUniqueValues = <Type>(
  arrayHavingDuplicates: Type[]
): Type[] => {
  const uniqeArray = [...new Set(arrayHavingDuplicates)];
  return uniqeArray;
};
export const getScreenHeight = (): number => {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
};

export const getStatusAppearance = (status: IssueStatus): ThemeAppearance => {
  if (status === null || status === undefined) return "default";
  const known: ThemeAppearance[] = [
    "default", // gray
    "inprogress", // blue
    "moved", // yellow
    "new", // purple
    "removed", // red
    "success", // green
  ];

  let type: ThemeAppearance = "default";
  const foundType = known.find((type) => {
    return type === status.name.toLowerCase().replace(/ /g, "");
  });
  // a/c api response color, "yellow" has status category name: indeterminate.
  // status category is "indeterminate" for in progress issues
  // but, "inprogress" is a known type, the type "inprogress" is returned. When assigned to Lozenge, it will give blue color.
  if (foundType !== undefined) {
    return foundType;
  } else {
    const { statusColor } = status;
    // a/c api response color, "blue-gray" has status category name: new -> gives purple color
    // but, it is not included here. the type returned will by default(color gray)
    // status category is new for "todo" issues.

    if (statusColor.includes("gray")) {
      type = "default";
    } else if (statusColor.includes("green")) {
      type = "success";
    } else if (statusColor.includes("blue")) {
      type = "inprogress";
    } else if (statusColor.includes("red")) {
      type = "removed";
    } else if (statusColor.includes("yellow")) {
      type = "moved";
    }
  }
  return type;
};

export const getAppRoot = (): Promise<HTMLElement> => {
  let root = document.getElementById("lxp-container-root");
  if (root) return Promise.resolve(root);
  else {
    return new Promise((resolve) => {
      let counter = 0;
      const interval = setInterval(() => {
        counter++;
        root = document.getElementById("lxp-container-root");
        if (root) {
          clearInterval(interval);
          resolve(root);
        } else if (counter > 20) {
          clearInterval(interval);
          resolve(null);
        }
      }, 50);
    });
  }
};

export const addIssueDetails = (issue: Issue, issueFields: IssueField[], selectedIssueFieldIds: string[], rowItems): void => {
  issueFields.forEach((issueField) => {
    if (selectedIssueFieldIds.includes(issueField.id)) {
      let value = "";
      if (issueField.id === "issueType") {
        value = issue.type?.name || "";
      } else if (issueField.id === "priority") {
        value = issue.priority?.name || "";
      } else if (issueField.id === "storyPoints") {
        value = (isNaN(issue.storyPoints) || issue.storyPoints === null) ?
          "" : String(issue.storyPoints);
      } else if (issueField.id === "fixVersions") {
        value = "";
        let i = 0;
        issue.fixVersions.forEach((fixVersion) => {
          if (i > 0) {
            value += ", ";
          }
          value += fixVersion?.name;
          i++;
        });
      } else if (issueField.id === "status") {
        value = issue.status?.name || "";
      } else if (issueField.id === "assignee") {
        const assignee = issue.assignee?.displayName || "";
        value = assignee !== undefined ? assignee : "";
      } else if (issueField.id === "summary") {
        value = issue.summary;
      }
      rowItems.push(value);
    }
  });
};

const escapeCSVCell = (cell: string, hasQuotes: boolean): string => {
  if (typeof cell === "string") {
    cell = cell.replace(/"/g, "\"\"");
  }
  return hasQuotes ? `"${cell}"` : cell.toString();
};

export const toCSV = (array, hasQuotes: boolean): any => {
  return array.map((row) => row.map((cell) => escapeCSVCell(cell, hasQuotes)).join(",")).join("\n");
};
