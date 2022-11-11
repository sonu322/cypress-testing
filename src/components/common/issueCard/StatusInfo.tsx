import React from "react";
import { IssueStatus } from "../../../types/api";
import Lozenge from "@atlaskit/lozenge";
interface Props {
  statusInfo: IssueStatus;
}
export const StatusText = ({ statusInfo }: Props): JSX.Element => {
  return (
    <div>
      <Lozenge>{statusInfo.name}</Lozenge>
    </div>
  );
};
