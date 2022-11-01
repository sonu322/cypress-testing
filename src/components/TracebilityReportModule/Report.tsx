import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { processIssues } from "../../util/tracebilityReportsUtils";
import { toTitleCase } from "../../util";
import { ReportRow } from "./ReportRow";
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;
const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
`;

export const Report = ({
  filteredIssues,
  tableFieldIds,
  issueFieldIds,
  issueCardOptionsMap,
}): JSX.Element => {
  // const {classifieds, links} = processIssues(tableFieldIds, filteredIssues);
  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Parent</th>
            {links.map((link, i) => (
              <th key={i}>{toTitleCase(link)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredIssues.map((issue, i) => (
            <BorderTr key={issue.id}>
              <ReportRow
                // classified={classified}
                // issueCardOptionsMap={issueCardOptionsMap}
                issueFieldIds={issueFieldIds}
                issue={issue}
                links={links}
              />
            </BorderTr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
