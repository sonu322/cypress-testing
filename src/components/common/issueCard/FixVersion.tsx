import React from "react";
import { IssueVersion } from "../../../types/api";
import Lozenge from "@atlaskit/lozenge";
import { TooltipContainer } from "../TooltipContainer";
import { version } from "react-dom";

interface Props { 
  versionInfo: IssueVersion[];
}

export const FixVersion = ({ versionInfo }: Props): JSX.Element => {
 const length = versionInfo.length;
  let totalversions, num;
  if(length > 1){
    totalversions = versionInfo[0]?.name;
    num = " +" + (versionInfo.length - 1);
  }
  else {
    totalversions = versionInfo[0]?.name;
  }
let map = versionInfo.map((versionInfo) => {
  if(length > 1){
  return versionInfo.name + ", ";
  }
  else{
    return versionInfo.name;
  }
});
    return (
      <TooltipContainer content={map} position="bottom">
        <Lozenge>
          {totalversions}  
        </Lozenge>
        {num}
      </TooltipContainer>
    );
};

