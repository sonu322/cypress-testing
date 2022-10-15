import React from "react";
import styled from "styled-components";

const IconContainer = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;

export const Icon = ({ width, height, src }) => {
  return (
    <IconContainer>
      <img height={height ? height : 16} width={width ? width : 16} src={src} />
    </IconContainer>
  );
};
