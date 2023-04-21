import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";


interface Props {
  issueKeyLabel: string;
  selectedIssueKey: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
}

export const IssueKeyField: React.FC<Props> = ({
  issueKeyLabel,
  selectedIssueKey,
  handleInputChange,
  isRequired,
}) => {
  return (
    <Field name="issueKey" label={issueKeyLabel} isRequired={isRequired}>
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
