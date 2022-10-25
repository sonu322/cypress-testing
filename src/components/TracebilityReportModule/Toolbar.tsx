import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { APIContext } from "../../context/api";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "../Dropdown";
import { helpLink } from "../../constants";
import { HelpLink } from "../HelpLink";
import { ExportContent } from "../ExportContent";
const MainBar = styled.div`
  display: flex;
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
  justify-content: space-between;
`;

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
    </MainBar>
  );
};
