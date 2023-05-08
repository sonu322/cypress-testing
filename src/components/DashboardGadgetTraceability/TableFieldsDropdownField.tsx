import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { TableFieldsDropdown } from "../TracebilityReportModule/TableFieldsDropdown";
import Spinner from "@atlaskit/spinner";
import { IssueLinkType, IssueType } from "../../types/api";

interface Props {
  handleInputChange: (name: any, value: any, type?: any) => void;
  selectedOptionIds: string[];
  viewType: string;
  isRequired?: boolean;
  options: IssueType[] | IssueLinkType[];
  areOptionsLoading: boolean;
  configKey: string;
  name: string;
  label: string;
}

export const TableFieldsDropdownField: React.FC<Props> = ({
  selectedOptionIds,
  handleInputChange,
  viewType,
  isRequired,
  options,
  areOptionsLoading,
  configKey,
  name,
  label,
}) => {
  return (
    <Field name={name} label={label} isRequired={isRequired}>
      {({ error }) => {
        if (
          areOptionsLoading ||
          selectedOptionIds === undefined ||
          viewType === undefined ||
          viewType === ""
        ) {
          return <Spinner size={"small"} />;
        } else {
          return (
            <div>
              <TableFieldsDropdown
                options={options}
                selectedOptions={selectedOptionIds}
                updateSelectedOptionIds={(updatedList) => {
                  handleInputChange(configKey, updatedList);
                }}
              />
              {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
            </div>
          );
        }
      }}
    </Field>
  );
};
