import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";

interface Props {
  issueKeyLabel: string;
  selectedIssueKey: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const IssueKeyField: React.FC<Props> = ({
  issueKeyLabel,
  selectedIssueKey,
  handleInputChange,
}) => {
  return (
    <Field name="issueKey" label={issueKeyLabel} isRequired>
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
