import React from "react";
import { useState, useEffect } from "react";
import Button from "@atlaskit/button";
import { MaxWidthContainer } from "./IssueTypeRow";
export interface Props {
  selectedIssueInCellIds: string[];
}
export const IssueCell = ({ selectedIssueInCellIds, issueCards }) => {
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
  selectedIssueInCellIds.every((issueId) => {
    if (issueId == "Display All issue cards") {
      issueCardsToShow = issueCards;
      return false;
    }
  });
  useEffect(() => {
    setAreAllIssuesVisible(false);
  }, [selectedIssueInCellIds]);
  return (
    <div>
      <MaxWidthContainer>{issueCardsToShow}</MaxWidthContainer>
      {issueCards.length > issueCardsToShow.length && (
        <Button onClick={handleClick} style={{ cursor: "pointer" }}>
          More
        </Button>
      )}
    </div>
  );
};
