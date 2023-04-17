import React from "react";
import { useTranslation } from "react-i18next";
import { IssueLinkType, IssueType } from "../../types/api";
import { Dropdown } from "../common/Dropdown";

interface Props {
  options: IssueType[] | IssueLinkType[];
  selectedOptions: string[];
  updateSelectedOptionIds: React.Dispatch<React.SetStateAction<string[]>>;
  isDisabled?: boolean;
}
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
  isDisabled,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Dropdown
      isDisabled={isDisabled}
      useTitleCaseOptions
      dropdownName={t("otpl.lxp.traceability-report.toolbar.tableFields.name")}
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedOptionIds}
    />
  );
};
