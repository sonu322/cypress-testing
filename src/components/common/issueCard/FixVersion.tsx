import React from "react";
import { IssueVersion } from "../../../types/api";
import Lozenge from "@atlaskit/lozenge";
import { TooltipContainer } from "../TooltipContainer";

interface Props { 
  versionInfo: IssueVersion[];
}

export const FixVersion = ({ versionInfo }: Props): JSX.Element => {
 const length = versionInfo.length;
 console.log(length);
  let totalversions;
  if(length == 1){
    totalversions = versionInfo[0]?.name;
  }
  else{
    totalversions = versionInfo[0]?.name;
  }
  let num;
  if(length > 1) {
  num = " +" + (versionInfo.length - 1);
  }
console.log(totalversions);
let map = versionInfo.map((versionInfo) => {
  return versionInfo.name;
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

