import React, { useState } from "react";
import TextField from "@atlaskit/textfield";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";

interface Props {
  placeholder: string;
  onSearch: (searchTerm: string) => void;
}

export const SearchOption = ({ placeholder, onSearch }: Props): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <TextField
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearch}
      elemAfterInput={<EditorSearchIcon label="search" />}
    />
  );
};
