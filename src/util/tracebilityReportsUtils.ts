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
  };;

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

export const exportReport = (
  tableFields: IssueType[] | IssueLinkType[],
  selectedTableFieldIds: string[],
  filteredIssues: IssueWithSortedLinks[],
  isIssueTypeReport: boolean
): void => {
  let content = "";
  const headerItems = ["Issue"];
  tableFields.forEach((tableField) => {
    if (selectedTableFieldIds.includes(tableField.id)) {
      headerItems.push(`"${toTitleCase(tableField.name)}"`);
    }
  });
  let header = headerItems.toString();
  header = header += "\n";
  content += header;

  filteredIssues.forEach((issue) => {
    let rowItems = [];
    if (isIssueTypeReport) {
      rowItems = processByIssueType(selectedTableFieldIds, issue);
    } else {
      rowItems = processByLinkType(selectedTableFieldIds, issue);
    }
    rowItems.unshift(`"${issue.issueKey}"`);

    let rowContent = rowItems.toString();
    rowContent = rowContent += "\n";
    content += rowContent;
  });
  download("csv", content);
};

export const orderSelectedIds = (
  selectedIds: string[],
  referenceList: Array<{ id: string; [key: string]: any }>
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
