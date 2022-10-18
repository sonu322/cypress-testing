import React from "react";
import { Dropdown } from "./Dropdown";
import Button, { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import ExportIcon from "@atlaskit/icon/glyph/export";
import QuestionIcon from "@atlaskit/icon/glyph/question";
import { HelpLink } from "../../constants"
import { ExportContent } from "../ExportContent";
export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Toolbar = ({
  options,
  filter,
  updateFilteredKeyOptions,
  keyNames,
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  issueCardOptionsMap,
  exportTree
}) => {
  const issueCardOptions = Array.from(issueCardOptionsMap.values());
  return (
    <Container>
      <ButtonGroup>
        {options &&
          filter &&
          keyNames.map((keyName) => (
            <IssueOptionsDropdown
              key={keyName}
              keyName={keyName}
              options={options[keyName]}
              selectedOptions={filter[keyName]}
              updateSelectedOptions={updateFilteredKeyOptions}
            />
          ))}
      </ButtonGroup>
      <div>
        <ButtonGroup>
          <Dropdown
            dropdownName={"Issue Card Fields"}
            options={issueCardOptions}
            selectedOptions={selectedIssueFieldIds}
            updateSelectedOptions={setSelectedIssueFieldIds}
          />
          <ExportContent
            description={"export issue tree to csv"}
            exportContent={exportTree}
          />
          <Button
            appearance="default"
            target="_blank"
            href={HelpLink}
            iconBefore={<QuestionIcon />}
          />
        </ButtonGroup>
      </div>
    </Container>
  );
};
