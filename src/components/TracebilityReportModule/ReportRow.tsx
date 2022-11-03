import React from "react";
import {Issue, IssueWithSortedLinks} from "../../types/api";
import {IssueCard} from "../common/issueCard/IssueCard";

export interface Props {
  linkIds: string[];
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
}

export const ReportRow = ({
  linkIds,
  issueFieldIds,
  issue,
}: Props): JSX.Element[] => {
  console.log("isssue!!!!!!");
  console.log(issue);
  
  const issueCell = (
    <td key="issue">
      <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
    </td>
  );
  
  linkIds.forEach((linkId) => {
    console.log("links!!!!!!!!");
    console.log(linkId);
    console.log(issue.sortedLinks[linkId]);
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

  const cells = [];

  cells.push(issueCell);
  // cells.push(Object.values(row));

  return cells;
};