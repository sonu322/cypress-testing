import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { processIssues } from "../../util/tracebilityReportsUtils";

import {ReportRow} from "./ReportRow";
import {ReportHeader} from "./ReportHeader";
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
  tableFields,
  selectedTableFieldIds,
  issueFieldIds,
  issueCardOptionsMap,
}): JSX.Element => {
  // const {classifieds, links} = processIssues(tableFieldIds, filteredIssues);
  const selectedLinkIds = selectedTableFieldIds.get("linkTypes");
  const selectedIssueTypeIds = selectedTableFieldIds.get("issueTypes");
  const allLinks = tableFields.get("linkTypes").values;

  return (
    <Container>
      <table>
        <ReportHeader fieldIds={selectedLinkIds} fields={allLinks} />
        <tbody>
          {filteredIssues.map((issue) => (
            <BorderTr key={issue.id}>
              <ReportRow
                // classified={classified}
                // issueCardOptionsMap={issueCardOptionsMap}
                issueTypeIds={selectedIssueTypeIds}
                linkIds={selectedLinkIds}
                issueFieldIds={issueFieldIds}
                issue={issue}
              />
            </BorderTr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};
