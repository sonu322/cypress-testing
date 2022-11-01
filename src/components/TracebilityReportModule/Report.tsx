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
  return (
    <Container>
      <table>
        <ReportHeader
          fieldIds={selectedTableFieldIds.get("linkTypes")}
          fields={tableFields.get("linkTypes").values}
        />
        {/* <tbody>
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
        </tbody> */}
      </table>
    </Container>
  );
};
