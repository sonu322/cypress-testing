import { lastSavedReportConfigKey } from "../constants/common";
import LXPAPI, {
  Issue,
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../types/api";
import {
  getUniqueValues,
  getScreenHeight,
  getItemInLocalStorage,
  setItemInLocalStorage,
  addIssueDetails,
  toCSV,
} from "./common";
import { download, toTitleCase } from "./index";

export default class TracebilityReportUtils {
  private readonly api: LXPAPI;
  constructor(api: LXPAPI) {
    this.api = api;
  }

  async populateIssues(
    jqlString: string,
    issueFields: IssueField[],
    startIndex: number,
    maxResults: number,
    updateIssues: (issues: any) => void,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setTotal: React.Dispatch<React.SetStateAction<number>>,
    handleError: (err: unknown) => void,
    clearAllErrors?: () => void
  ): Promise<void> {
    setIsLoading(true);
    updateIssues([]);
    if (clearAllErrors !== undefined) {
      clearAllErrors();
    }
    try {
      const searchResult = await this.api.searchLinkedIssues(
        jqlString,
        issueFields,
        startIndex,
        maxResults
      );
      const { data, total } = searchResult;
      updateIssues(data);
      setIsLoading(false);
      if (setTotal !== null) {
        setTotal(total);
      }
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
  }

  calculateCloudHeight = (errors): number => {
    const headingHeight = 40 + 8; // 8: margin top
    const toolbarHeight = 94 + 8; // 8: table top margin
    const footerHeight = 32 + 8 + 8;
    const // more button 8: margin top and bottom
      errorsHeight = errors?.length > 0 ? (52 + 8) * errors.length : 0;
    const finalHeight =
      getScreenHeight() -
      headingHeight -
      toolbarHeight -
      footerHeight -
      errorsHeight -
      2;
    return finalHeight;
  };

  calculateServerHeight = (errors): number => {
    const headingHeight = 41 + 80 + 80 + 8; // 8: margin top
    const toolbarHeight = 94 + 8; // 8: table top margin
    const // more button 8: margin top and bottom
      errorsHeight = errors?.length > 0 ? (52 + 8) * errors.length : 0;
    const allBanners = document.getElementsByClassName("aui-banner");
    const allMessages = document.getElementsByClassName("aui-message");
    const allBannersHeight = 40 * allBanners.length;
    const allMessagesHeight = 40 * allMessages.length;
    const finalHeight =
      getScreenHeight() -
      headingHeight -
      toolbarHeight -
      errorsHeight -
      allBannersHeight -
      allMessagesHeight -
      2;
    return finalHeight;
  };

  // TODO: probably we may improve this calculation
  calculateTableHeight = (errors): number => {
    let finalHeight: number;
    if (this.api.isServer) {
      finalHeight = this.calculateServerHeight(errors);
    } else {
      finalHeight = this.calculateCloudHeight(errors);
    }
    return finalHeight < 200 ? 200 : finalHeight;
  };

  calculateTreeHeight = (errors): number => {
    let finalHeight: number;
    if (this.api.isServer) {
      finalHeight = this.calculateServerHeight(errors) - 42 - 8 - 8 - 8 - 8;
    } else {
      finalHeight =
        this.calculateCloudHeight(errors) + 24 - 42 - 8 - 8 - 30 - 8;
    }
    return finalHeight < 200 ? 200 : finalHeight;
  };
}

const processByLinkType = (
  selectedTableFieldIds: string[],
  issue: IssueWithSortedLinks
): string[] => {
  const rowItems: string[] = [];
  selectedTableFieldIds.forEach((selectedId) => {
    let rowItemString = "--";

    if (issue.sortedLinks[selectedId] !== undefined) {
      const rowItem = [];
      issue.sortedLinks[selectedId].forEach((issue) => {
        rowItem.push(issue?.issueKey);
      });
      rowItemString = `"${rowItem.toString()}"`;
    }
    rowItems.push(rowItemString);
  });
  return rowItems;
};

export const handleSetItemInSavedReportConfig = (
  key: string,
  value: any
): void => {
  const lastSavedReportConfig = getItemInLocalStorage(lastSavedReportConfigKey);
  let newReportConfig: Object;
  if (lastSavedReportConfig !== null || lastSavedReportConfig !== undefined) {
    newReportConfig = { ...lastSavedReportConfig, [key]: value };
  } else {
    newReportConfig = {
      [key]: value,
    };
  }
  setItemInLocalStorage(lastSavedReportConfigKey, newReportConfig);
};

const processByIssueType = (
  selectedTableFieldIds: string[],
  issue: IssueWithSortedLinks
): string[] => {
  const rowItems: string[] = [];
  selectedTableFieldIds.forEach((selectedId) => {
    let rowItemString = "--";
    let issuesOfType: Issue[] = [];

    Object.values(issue.sortedLinks).forEach((issues) => {
      const newIssues = issues.filter((issue) => {
        return issue?.type?.id === selectedId;
      });
      issuesOfType = issuesOfType.concat(newIssues);
    });
    if (issuesOfType.length > 0) {
      issuesOfType = getUniqueValues(issuesOfType);
      const rowItem = issuesOfType.map((issue) => issue.issueKey);
      rowItemString = `"${rowItem.toString()}"`;
    }
    rowItems.push(rowItemString);
  });
  return rowItems;
};

const getLinkedIssuesByType = (issue: IssueWithSortedLinks, selectedTableFieldIds: string[]): any => {
  const result = {};
  for (const linkId in issue.sortedLinks) {
    const issues = issue.sortedLinks[linkId];
    issues.forEach((linkedIssue) => {
      const type = linkedIssue.type.id;
      if (selectedTableFieldIds.includes(type)) {
        if (result[type] === undefined) {
          result[type] = [];
        }
        result[type].push({ ...linkedIssue, linkId });
      }
    });
  }
  return result;
};

const getLinkedIssuesByLink = (issue: IssueWithSortedLinks, selectedTableFieldIds: string[]): any => {
  const result = {};
  for (const linkId in issue.sortedLinks) {
    if (selectedTableFieldIds.includes(linkId)) {
      result[linkId] = issue.sortedLinks[linkId];
    }
  }
  return result;
};

export const exportReport = (
  selectedTableFieldIds: string[],
  linkTypes: IssueLinkType[],
  issueFields: IssueField[],
  selectedIssueFieldIds: string[],
  filteredIssues: IssueWithSortedLinks[],
  isIssueTypeReport: boolean
): void => {
  const linkMap = {};
  for (const linkType of linkTypes) {
    linkMap[linkType.id] = linkType.name;
  }
  const content = [];
  let headerItems = ["Issue Key"];
  const labels = [];
  issueFields.forEach((issueField) => {
    if (selectedIssueFieldIds.includes(issueField.id)) {
      headerItems.push(issueField.name);
      labels.push(issueField.name);
    }
  });
  headerItems.push("Link");
  headerItems.push("Issue Key");
  headerItems = headerItems.concat(labels);
  content.push(headerItems);

  filteredIssues.forEach((issue) => {
    let rowItems = [issue.issueKey];
    addIssueDetails(issue, issueFields, selectedIssueFieldIds, rowItems);
    let result = null;
    if (isIssueTypeReport) {
      result = getLinkedIssuesByType(issue, selectedTableFieldIds);
    } else {
      result = getLinkedIssuesByLink(issue, selectedTableFieldIds);
    }
    const keys = Object.keys(result);
    if (keys.length > 0) {
      let i = 0;
      for (let linkId in result) {
        const issues = result[linkId];
        for (const linkedIssue of issues) {
          linkId = linkedIssue.linkId !== undefined ? linkedIssue.linkId : linkId;
          if (i > 0) {
            for (let j = 0; j < selectedIssueFieldIds.length; j++) {
              rowItems.push("");
            }
          }
          rowItems.push(toTitleCase(linkMap[linkId]));
          rowItems.push(linkedIssue.issueKey);
          addIssueDetails(linkedIssue, issueFields, selectedIssueFieldIds, rowItems);
          content.push(rowItems);
          rowItems = [""];
          i++;
        }
      }
    } else {
      rowItems.push("");
      rowItems.push("");
      for (let j = 0; j < labels.length; j++) {
        rowItems.push("");
      }
      content.push(rowItems);
    }
  });
  download("csv", toCSV(content, true));
};

export const orderSelectedIds = (
  selectedIds: string[],
  referenceList: Array<{ id: string;[key: string]: any }>
): string[] => {
  const newSelectedIds: string[] = [];
  if (selectedIds.length > 0) {
    referenceList.forEach((referenceItem) => {
      if (selectedIds.includes(referenceItem.id)) {
        newSelectedIds.push(referenceItem.id);
      }
    });
  }
  return newSelectedIds;
};
