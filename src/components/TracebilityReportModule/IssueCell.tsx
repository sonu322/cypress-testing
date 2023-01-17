import React from "react";
import { useState, useEffect } from "react";
import Button from "@atlaskit/button";
import { MaxWidthContainer } from "./IssueTypeRow";
import styled from "styled-components";
import { displayAllIssueCardsId } from "../../constants/traceabilityReport";
export interface Props {
  selectedSettingsDropdownIds: string[];
}

const ButtonContainer = styled.div`
  margin-top: 8px;
`;
export const IssueCell = ({ selectedSettingsDropdownIds, issueCards }) => {
  const [areAllIssuesVisible, setAreAllIssuesVisible] = useState(false);
  let issueCardsToShow = [];
  if (issueCards.length > 3) {
    if (!areAllIssuesVisible) {
      issueCardsToShow = issueCards.slice(0, 3);
    } else {
      issueCardsToShow = issueCards;
    }
  } else {
    issueCardsToShow = issueCards;
  }
  const handleClick = () => {
    if (issueCards.length > 3) {
      setAreAllIssuesVisible(!areAllIssuesVisible);
    }
  };
  selectedSettingsDropdownIds.every((issueId) => {
    if (issueId == displayAllIssueCardsId) {
      issueCardsToShow = issueCards;
      return false;
    }
  });
  useEffect(() => {
    setAreAllIssuesVisible(false);
  }, [selectedSettingsDropdownIds]);
  return (
    <div>
      <MaxWidthContainer>{issueCardsToShow}</MaxWidthContainer>
      {issueCards.length > issueCardsToShow.length && (
        <ButtonContainer>
          <Button onClick={handleClick} spacing="compact">
            More
          </Button>
        </ButtonContainer>
      )}
    </div>
  );
};
