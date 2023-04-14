import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import Select, { ValueType } from "@atlaskit/select";

interface OptionType {
  label: string;
  value: string;
}

interface IssueViewOption extends OptionType {
  label: "Issue Type View";
}

interface LinkViewOption extends OptionType {
  label: "Link Type View";
}

interface TreeViewOption extends OptionType {
  label: "Tree View";
}

type Option = IssueViewOption | LinkViewOption | TreeViewOption;

export const ViewSelect: React.FC<any> = ({
  name,
  label,
  options,
  value,
  handleInputChange,
  ...rest
}) => {
  return (
    <Field<ValueType<Option>> name={name} label={label} {...rest}>
      {({ fieldProps: { id, ...rest }, error }) => {
        console.log("id", id);
        console.log("rest", rest);
        return (
          <React.Fragment>
            <Select<Option>
              inputId={id}
              {...rest}
              options={options}
              isClearable
              onChange={(selectedOption) => {
                console.log(selectedOption);
                handleInputChange(name, selectedOption.value);
              }}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </React.Fragment>
        );
      }}
    </Field>
  );
};
