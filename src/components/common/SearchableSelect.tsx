import React, { useState } from "react";
import Select from "@atlaskit/select";
interface Props {
  isMultiValued: boolean;
  onSearch: (query: string) => void;
  searchQuery: string;
}
export const SearchableSelect = ({
  isMultiValued,
  onSearch,
  searchQuery,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onSearch(event.target.value);
  };
  return (
    <Select
      id="issue-search"
      placeholder="Search for issue"
      inputValue={inputValue}
      onChange={handleInputChange}
      style={{ width: "50%" }}
      isMultiValued={isMultiValued}
    />
  );
};
