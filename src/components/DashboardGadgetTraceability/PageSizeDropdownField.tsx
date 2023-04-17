import React, { useState, useEffect } from "react";
import Form, { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { DropdownSingleSelect } from "../common/DropdownSingleSelect";

const options = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

interface Props {
  updateSelectedLimit: (value: number) => void;
  selectedLimit: number;
  handleNewError: (error: unknown) => void;
}

export const PageSizeDropdownField: React.FC<Props> = ({
  selectedLimit,
  updateSelectedLimit,
}) => {
  const { t } = useTranslation();
  return (
    <Field
      name="pageSize"
      label={t("otpl.lxp.traceability-report.fetch-limit-dropdown.name")}
    >
      {({ fieldProps, error }) => {
        return (
          <div>
            <DropdownSingleSelect
              options={options}
              dropdownName={
                t("otpl.lxp.traceability-report.fetch-limit-dropdown.name") +
                ` (${selectedLimit})`
              }
              selectedOptionId={selectedLimit}
              updateSelectedOptionId={updateSelectedLimit}
            />
            {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
          </div>
        );
      }}
    </Field>
  );
};
