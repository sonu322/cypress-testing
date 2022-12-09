import React, { useEffect, useState, useContext } from "react";
import { DropdownSingleSelect} from "../common/DropdownSingleSelect";
import { APIContext } from "../../context/api";

export interface IssueLimit {
  id: string;
  name: string;
  // maxIssues: number; 
  // maxIssueLinks: number;
}
interface Props {
  options: IssueLimit[];
  selectedOptionId: string;
  setSelectedOptionId: React.Dispatch<React.SetStateAction<string>>;
}
export const IssueLimitDropdown = ({
  options,
  selectedOptionId,
  setSelectedOptionId,
}: Props): JSX.Element => {
  return (
    <DropdownSingleSelect
      options = {options}
      dropdownName="Issue Limit"
      selectedOptionId={selectedOptionId}
      setSelectedOptionId={setSelectedOptionId}
    />
  );
};

