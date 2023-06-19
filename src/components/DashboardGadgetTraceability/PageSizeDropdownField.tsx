import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { DropdownSingleSelect } from "../common/DropdownSingleSelect";

const options = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

interface Props {
  handleInputChange: (name: any, value: any, type?: any) => void;
  selectedLimit: number;
  isRequired: boolean;
  name: string;
  label: string;
}

export const PageSizeDropdownField: React.FC<Props> = ({
  selectedLimit,
  handleInputChange,
  isRequired,
  name,
  label,
}) => {
  const { t } = useTranslation();
  return (
    <Field isRequired={isRequired} name={name} label={label}>
      {({ error }) => {
        return (
          <div>
            <DropdownSingleSelect
              options={options}
              dropdownName={
                t("otpl.lxp.traceability-report.fetch-limit-dropdown.name") +
                ` (${selectedLimit})`
              }
              selectedOptionId={selectedLimit}
              updateSelectedOptionId={(selectedLimit) => {
                handleInputChange(name, selectedLimit);
              }}
            />
            {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
          </div>
        );
      }}
    </Field>
  );
};
