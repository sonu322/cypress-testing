import React from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import Select, { ValueType } from "@atlaskit/select";
import styled from "styled-components";

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
          <>
            <Select<OptionType>
              inputId={id}
              {...rest}
              options={options}
              value={options.find(
                (option) => option.value === selectedViewType
              )}
              onChange={(selectedOption) => {
                handleInputChange(name, selectedOption.value);
              }}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </>
        );
      }}
    </Field>
  );
};
