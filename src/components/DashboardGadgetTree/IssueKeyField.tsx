import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";

interface Props {
  label: string;
  name: string;
  selectedIssueKey: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
}

export const IssueKeyField: React.FC<Props> = ({
  label,
  name,
  selectedIssueKey,
  handleInputChange,
  isRequired,
}) => {
  return (
    <Field name={name} label={label} isRequired={isRequired}>
      {({ fieldProps, error }) => (
        <>
          <TextField
            {...fieldProps}
            value={selectedIssueKey}
            onChange={handleInputChange}
          />
          {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
        </>
      )}
    </Field>
  );
};
