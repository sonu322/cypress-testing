import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import Button, { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "../Dropdown";
import { helpLink } from "../../constants";
import { HelpLink } from "../HelpLink";
import { ExportContent } from "../ExportContent";
import { JQLEditor } from "../JQLEditor";

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
  selectedFilterId,
  setSelectedFilterId,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const issueCardOptions = Array.from(issueCardOptionsMap.values());
  var options = {
    jql: "project = ACJS",
    header: "My title",
    descriptionText: "My custom description text for dialog",
    submitText: "My submit label",
    cancelText: "My cancel label",
  };

  var callback = function (obj) {
    console.log(obj);
  };

  return (
    <MainBar>
      <FlexContainer>
        <JQLSelectDropdown
          selectedFilterId={selectedFilterId}
          setSelectedFilterId={setSelectedFilterId}
        />
        <Button
          appearance="primary"
          onClick={() => AP.jira.showJQLEditor(options, callback)}
        >
          Use JQL
        </Button>
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
