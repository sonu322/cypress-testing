import React from "react";
import Select from "@atlaskit/select";
interface Props {
  isMultiValued: boolean;
  onSearch: (query: string) => void;
  options: Array<{ label: string; value: string }>;
  inputValue: string;
  onChange: (issueKeys: string[]) => void;
  placeholder: string;
}
export const SearchableSelect = ({
  isMultiValued,
  onSearch,
  options,
  inputValue,
  onChange,
  placeholder
}: Props): JSX.Element => {
  const handleInputChange = (inputValue: string) => {
    onSearch(inputValue);
  };
  return (
    <Select
      id="issue-search"
      menuPosition="fixed"
      placeholder={placeholder}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      style={{ width: "50%" }}
      isMulti={isMultiValued}
      options={options}
      onChange={(inputValue) => {
        if (isMultiValued) {
          const values = inputValue.map((value) => value.value);
          onChange(values);
        } else {
          onChange(inputValue.value);
        }
      }}
    />
  );
};
