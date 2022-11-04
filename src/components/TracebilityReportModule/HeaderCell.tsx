import React from "react";
import styled from "styled-components";

const Container = styled.span`
  min-width: ${({ isSmall }) => {
    if (isSmall) {
      return "0px";
    } else {
      return "184px";
    }
  }};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  header: string;
  isSmall?: boolean;
}

export const HeaderCell = ({ header, isSmall }: Props): JSX.Element => {
  return <Container isSmall={isSmall}>{header}</Container>;
};
