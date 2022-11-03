import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "../common/Dropdown";
import { helpLink } from "../../constants";
import { HelpLink } from "../common/HelpLink";
import { ExportContent } from "../common/ExportContent";
import { JQLEditor } from "../JQLEditor";
import { TableFieldsDropdown } from "./TableFieldsDropdown";
import { IssueField } from "../../types/api";
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

interface Props {
  selectedIssueFieldIds: string[];
  setSelectedIssueFieldIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedJQLString: string;
  setSelectedJQLString: React.Dispatch<React.SetStateAction<string>>;
  selectedTableFieldIds: Map<string, string[]>;
  updateSelectedTableFieldIds: React.Dispatch<
    React.SetStateAction<Map<string, string[]>>
  >;
  tableFields: Map<
    string,
    {
      name: string;
      values: any[];
    }
  >;
  exportReport: () => void;
  handleNewError: (err: unknown) => void;
  isExportDisabled: boolean;
  issueCardOptions: IssueField[];
}

export const Toolbar = ({
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  selectedJQLString,
  setSelectedJQLString,
  selectedTableFieldIds,
  updateSelectedTableFieldIds,
  tableFields,
  exportReport,
  handleNewError,
  isExportDisabled,
  issueCardOptions,
}: Props): JSX.Element => {
  // const issueCardOptions = Array.from(issueCardOptionsMap.values());
  return (
    <MainBar>
      <FlexContainer>
        <JQLSelectDropdown
          selectedFilterId={selectedJQLString}
          setSelectedFilterId={setSelectedJQLString}
          handleNewError={handleNewError}
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
            description={"Export report to csv"}
            exportContent={() => {
              exportReport();
            }}
            isDisabled={isExportDisabled}
          />
          <HelpLink description={"Get help"} href={helpLink} />
        </ButtonGroup>
      </div>
    </MainBar>
  );
};
