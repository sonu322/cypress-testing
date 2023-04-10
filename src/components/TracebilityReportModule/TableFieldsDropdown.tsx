import React from "react";
import { useTranslation } from "react-i18next";
import { IssueLinkType, IssueType } from "../../types/api";
import { DropdownFields } from "../common/DropdownFields";

interface Props {
  options: IssueType[] | IssueLinkType[];
  selectedOptions: string[];
  updateSelectedOptionIds: React.Dispatch<React.SetStateAction<string[]>>;
}
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <DropdownFields
      useTitleCaseOptions
      dropdownName={t("otpl.lxp.traceability-report.toolbar.tableFields.name")}
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedOptionIds}
    />
  );
};
