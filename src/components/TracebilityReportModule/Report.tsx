import React from "react";
import styled from "styled-components";
import { IssueCard } from "../IssueCard";
import { colors } from "@atlaskit/theme";
import { toTitleCase } from "../../util";
import { processIssues } from "../../util/tracebilityReportsUtils";
const Container = styled.div`
  width: 100%;
  height: 100%;

  overflow: scroll;
`;
const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
`;

export const Report = ({
  issues,
  tableFieldIds,
  issueFieldIds,
  issueCardOptionsMap,
}) => {
  const { classifieds, links } = processIssues(tableFieldIds, issues);
  return (
    // <IssueCard
    //   issueData={issue}
    //   selectedIssueFieldIds={issueFieldIds}
    //   issueCardOptionsMap={issueCardOptionsMap}
    // ></IssueCard>
    <Container>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Parent</th>
            <th>Sub-tasks</th>
            {links.map((link, i) => (
              <th key={i}>{link}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classifieds.map((classified, i) => (
            <BorderTr key={i}>
              <td>
                {" "}
                <IssueCard
                  issueData={classified.issue}
                  selectedIssueFieldIds={issueFieldIds}
                  issueCardOptionsMap={issueCardOptionsMap}
                ></IssueCard>
              </td>
              <td>
                {" "}
                {classified.parent ? (
                  <IssueCard
                    issueData={classified.parent}
                    selectedIssueFieldIds={issueFieldIds}
                    issueCardOptionsMap={issueCardOptionsMap}
                  ></IssueCard>
                ) : (
                  <span>--</span>
                )}
              </td>
              <td>
                {classified.subtasks && classified.subtasks.length > 0 ? (
                  classified.subtasks.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issueData={issue}
                      selectedIssueFieldIds={issueFieldIds}
                      issueCardOptionsMap={issueCardOptionsMap}
                    ></IssueCard>
                  ))
                ) : (
                  <span>--</span>
                )}
              </td>
              {links.map((link, j) => (
                <td key={`${i}..${j}`}>
                  {classified[link] ? (
                    classified[link].map((issue) => {
                      if (issue) {
                        return (
                          <IssueCard
                            key={issue.id}
                            issueData={issue}
                            selectedIssueFieldIds={issueFieldIds}
                            issueCardOptionsMap={issueCardOptionsMap}
                          ></IssueCard>
                        );
                      }
                      return <span>--</span>;
                    })
                  ) : (
                    <span>--</span>
                  )}
                </td>
              ))}
            </BorderTr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
