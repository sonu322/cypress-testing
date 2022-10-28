import React from "react";
import styled from "styled-components";

const IconContainer = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;

export const Icon = ({ width = 16, height = 16, src }) => {
  return (
    <IconContainer>
      <img height={height} width={width} src={src} />
    </IconContainer>
  );
};
