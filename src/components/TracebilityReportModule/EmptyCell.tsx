import React from "react";
import styled from "styled-components";

const Container = styled.span`
  min-width: 184px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EmptyCell = (): JSX.Element => {
  return <Container>--</Container>;
};
