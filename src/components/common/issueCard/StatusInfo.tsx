import React from "react";
import { IssueStatus } from "../../../types/api";
import Lozenge from "@atlaskit/lozenge";
import { getStatusAppearance } from "../../../util/common";
import { TooltipContainer } from "../TooltipContainer";
interface Props {
  statusInfo: IssueStatus;
}
export const StatusText = ({ statusInfo }: Props): JSX.Element => {
  return (
    <TooltipContainer content={statusInfo?.description}>
      <Lozenge appearance={getStatusAppearance(statusInfo)}>
        {statusInfo?.name}
      </Lozenge>
    </TooltipContainer>
  );
};
