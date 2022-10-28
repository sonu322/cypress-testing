import React from "react";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Spinner from "@atlaskit/spinner";
import Button from "@atlaskit/button";
import styled from "styled-components";

const Box = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;
const SpinnerContainer = styled.span`
  display: flex;
  min-width: 24px;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

export const ExpansionToggler = ({
  isLoading,
  isTogglerDisabled,
  isExpanded,
  onExpand,
  onCollapse,
}) => {
  if (isLoading) {
    return (
      <SpinnerContainer onClick={onCollapse}>
        <Spinner size={16} />
      </SpinnerContainer>
    );
  } else if (isTogglerDisabled) {
    return <Box />;
  } else if (isExpanded) {
    return (
      <Button spacing="none" appearance="subtle-link" onClick={onCollapse}>
        <ChevronDownIcon label="" size="small" />
      </Button>
    );
  } else {
    return (
      <Button spacing="none" appearance="subtle-link" onClick={onExpand}>
        <ChevronRightIcon label="" size="small" />
      </Button>
    );
  }
};
