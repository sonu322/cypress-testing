import React, { useState, useEffect } from "react";
import { MaxWidthContainer } from "./IssueTypeRow";
import styled from "styled-components";
import { displayAllIssueCardsId } from "../../constants/traceabilityReport";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronUpIcon from "@atlaskit/icon/glyph/chevron-up";
import Button from "@atlaskit/button";
export interface Props {
  selectedSettingsDropdownIds: string[];
  issueCards: JSX.Element[];
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export const IssueCell = ({ selectedSettingsDropdownIds, issueCards }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const isDisplayAllSelected = selectedSettingsDropdownIds.includes(
      displayAllIssueCardsId
    );
    if (isDisplayAllSelected) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [selectedSettingsDropdownIds]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  let issueCardsToShow = issueCards;
  if (issueCards.length > 3 && !isExpanded) {
    issueCardsToShow = issueCards.slice(0, 3);
  }

  return (
    <div>
      <MaxWidthContainer>{issueCardsToShow}</MaxWidthContainer>
      {issueCards.length > 3 && (
        <ButtonContainer>
          <div style={{ alignSelf: "flex-end" }}>
            <ExpandButton onClick={handleClick}>
              {isExpanded ? (
                <Button
                  iconAfter={<ChevronUpIcon size="medium" label="Collapse" />}
                >
                  Less
                </Button>
              ) : (
                <Button
                  iconAfter={<ChevronDownIcon size="medium" label="Expand" />}
                >
                  More
                </Button>
              )}
            </ExpandButton>
          </div>
        </ButtonContainer>
      )}
    </div>
  );
};
