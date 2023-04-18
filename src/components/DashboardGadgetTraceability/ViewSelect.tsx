import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import Select, { ValueType } from "@atlaskit/select";

interface OptionType {
  label: string;
  value: string;
}

export const ViewSelect: React.FC<any> = ({
  name,
  label,
  options,
  handleInputChange,
  selectedViewType,
  ...rest
}) => {
  return (
    <Field<ValueType<OptionType>> name={name} label={label} {...rest}>
      {({ fieldProps: { id, ...rest }, error }) => {
        return (
          <React.Fragment>
            <Select<OptionType>
              inputId={id}
              {...rest}
              options={options}
              value={options.find(
                (option) => option.value === selectedViewType
              )}
              onChange={(selectedOption) => {
                console.log("FROM ON CHANGE OF VIEW SELECT");
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
