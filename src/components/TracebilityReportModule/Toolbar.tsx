import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "../Dropdown";
import { helpLink } from "../../constants";
import { HelpLink } from "../HelpLink";
import { ExportContent } from "../ExportContent";
import { JQLEditor } from "../JQLEditor";
import { TableFieldsDropdown } from "./TableFieldsDropdown";
const MainBar = styled.div`
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
`;
const FlexContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const Toolbar = ({
  issueCardOptionsMap,
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  selectedJQLString,
  setSelectedJQLString,
  selectedTableFieldIds,
  updateSelectedTableFieldIds,
  tableFields,
}) => {
  console.log("from toolbar");
  const issueCardOptions = Array.from(issueCardOptionsMap.values());
  console.log(issueCardOptions);
  console.log(selectedIssueFieldIds);
  return (
    <MainBar>
      <FlexContainer>
        <JQLSelectDropdown
          selectedFilterId={selectedJQLString}
          setSelectedFilterId={setSelectedJQLString}
        />
        <JQLEditor
          selectedFilterId={selectedJQLString}
          setSelectedFilterId={setSelectedJQLString}
        />
        {Boolean(tableFields) && (
          <TableFieldsDropdown
            selectedOptions={selectedTableFieldIds}
            updateSelectedOptionIds={updateSelectedTableFieldIds}
            options={tableFields}
          />
        )}
      </FlexContainer>

      <div>
        <ButtonGroup>
          <Dropdown
            dropdownName={"Issue Card Fields"}
            options={issueCardOptions}
            selectedOptions={selectedIssueFieldIds}
            updateSelectedOptions={setSelectedIssueFieldIds}
          />
          <ExportContent
            description={"Export issue tree to csv"}
            exportContent={() => {
              // TODO: export report to csv
              console.log("exported");
            }}
          />
          <HelpLink description={"Get help"} href={helpLink} />
        </ButtonGroup>
      </div>
    </MainBar>
  );
};
