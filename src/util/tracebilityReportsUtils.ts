import LXPAPI, { IssueField, IssueWithSortedLinks } from "../types/api";
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
    handleError: (err: unknown) => void
  ): Promise<void> {
    setIsLoading(true);
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

export const exportReport = (
  tableFields: Map<
    string,
    {
      name: string;
      values: any[];
    }
  >,
  selectedTableFieldIds: Map<string, string[]>,
  filteredIssues: IssueWithSortedLinks[]
): void => {
  const selectedLinkIds = selectedTableFieldIds.get("linkTypes");
  const selectedIssueTypeIds = selectedTableFieldIds.get("issueTypes");
  let links = tableFields.get("linkTypes").values;
  links = links.filter((link) => selectedLinkIds.includes(link.id));
  let content = "";
  const headerLinks = ["Issue"];
  links.forEach((link) => {
    headerLinks.push(`"${toTitleCase(link.name)}"`);
  });
  let header = headerLinks.toString();
  header = header += "\n";
  content += header;

  filteredIssues.forEach((issue) => {
    const rowItems = [];
    rowItems.push(`"${issue.issueKey}"`);
    selectedLinkIds.forEach((linkId) => {
      let rowItemString = "--";
      if (issue.sortedLinks[linkId] !== undefined) {
        const rowItem = [];
        issue.sortedLinks[linkId].forEach((linkedIssue) => {
          const isSelected = selectedIssueTypeIds.includes(linkedIssue.type.id);
          if (isSelected) {
            rowItem.push(linkedIssue.issueKey);
          }
          if (rowItem.length > 0) {
            rowItemString = `"${rowItem.toString()}"`;
          }
        });
      }
      rowItems.push(rowItemString);
    });

    let rowContent = rowItems.toString();
    rowContent = rowContent += "\n";
    content += rowContent;
  });
  download("csv", content);
};