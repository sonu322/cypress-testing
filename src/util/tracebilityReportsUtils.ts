import LXPAPI, {
  Issue,
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../types/api";
import { getUniqueValues } from "./common";
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
        rowItem.push(issue.issueKey);
      });
      rowItemString = `"${rowItem.toString()}"`;
    }
    rowItems.push(rowItemString);
  });
  return rowItems;
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
        return issue.type?.id === selectedId;
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