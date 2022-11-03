import React from "react";
import {Issue, IssueWithSortedLinks} from "../../types/api";
import {IssueCard} from "../common/issueCard/IssueCard";

export interface Props {
  linkIds: string[];
  issueTypeIds: string[];
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
}

export const ReportRow = ({
  linkIds,
  issueTypeIds,
  issueFieldIds,
  issue,
}: Props): JSX.Element[] => {
  console.log("isssue!!!!!!");
  console.log(issue);
  const cells = [];

  const issueCell = (
    <td key="issue">
      <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
    </td>
  );
  cells.push(issueCell);

  linkIds.forEach((linkId) => {
    console.log("links!!!!!!!!");
    console.log(linkId);
    console.log(issue.sortedLinks[linkId]);
    let issueCell = <td key={linkId}>--</td>;

    if (issue.sortedLinks[linkId] !== undefined) {
      const allIssues = [];
      issue.sortedLinks[linkId].forEach((issue) => {
        const isSelected = issueTypeIds.includes(issue.type.id);
        if (isSelected) {
          const singleIssue = (
            <IssueCard
              key={issue.id}
              issueData={issue}
              selectedIssueFieldIds={issueFieldIds}
            />
          );
          allIssues.push(singleIssue);
        }
      });
      if (allIssues.length > 0) {
        issueCell = <td key={linkId}>{allIssues}</td>;
      }
    }
    cells.push(issueCell);
  });

  // const row = {};

  // linkIds.forEach((fieldId) => {
  //   row[fieldId] = <td key={fieldId}>--</td>;
  //   const fieldIssues = [];
  //   const matchingIssues = issue.links.filter(
  //     (link) => link.linkTypeId === fieldId
  //   );
  //   matchingIssues.forEach((matchingIssue) => {
  //     fieldIssues.push(
  //       <IssueCard
  //         issueData={matchingIssue.issue}
  //         selectedIssueFieldIds={issueFieldIds}
  //       />
  //     );
  //   });
  //   if (fieldIssues.length !== 0) {
  //     row[fieldId] = <td key={fieldId}> {fieldIssues}</td>;
  //   }
  // });

  // const linkCells = links.map((link: string) => (
  //   <td key={classified.issue.key + link}>
  //     {classified[link] != null && classified[link].length > 0 ? (
  //       classified[link].map((issue: Issue) => (
  //         <IssueCard
  //           key={issue.id}
  //           issueData={issue}
  //           selectedIssueFieldIds={issueFieldIds}
  //         />
  //       ))
  //     ) : (
  //       <span>--</span>
  //     )}
  //   </td>
  // ));

  // cells.push(Object.values(row));

  return cells;
};;;