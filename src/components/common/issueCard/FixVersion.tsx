import React from "react";
import styled from "styled-components";
import { IssueVersion } from "../../../types/api";
import Lozenge from "@atlaskit/lozenge";
import { TooltipContainer } from "../TooltipContainer";

const StyledFixVersion = styled.div`
  white-space: nowrap;
`;
interface Props {
  versionInfo: IssueVersion[];
}

export const FixVersion = ({ versionInfo }: Props): JSX.Element => {
  const length = versionInfo.length;
  let totalversions = "";
  let num;
  if (length > 0) {
    totalversions = versionInfo[0]?.name;
    if (length > 1) {
      num = ` +${versionInfo.length - 1}`;
    }
  }
  const versionNames = versionInfo.map((versionInfo) => {
    return versionInfo.name;
  });
  const tooltipContent = versionNames.join(", ");
  return (
    <TooltipContainer content={tooltipContent} position="bottom">
      <StyledFixVersion>
        <Lozenge>{totalversions}</Lozenge>
        {num}
      </StyledFixVersion>
    </TooltipContainer>
  );
};
