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
const MainBar = styled.div`
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
`;
const FlexContainer = styled.div`
display: flex;
flex-grow: 1;
justify-content: space-between;
`

export const Toolbar = ({
  issueCardOptionsMap,
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  selectedFilterId,
  setSelectedFilterId,
}) => {
  const issueCardOptions = Array.from(issueCardOptionsMap.values());
  return (
    <MainBar>
      <JQLEditor></JQLEditor>
      <FlexContainer>
      <JQLSelectDropdown
        selectedFilterId={selectedFilterId}
        setSelectedFilterId={setSelectedFilterId}
      />
      
      
      
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
      </FlexContainer>
            
    </MainBar>

  );
};
