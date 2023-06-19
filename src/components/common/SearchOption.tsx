import React, { useState } from "react";
import TextField from "@atlaskit/textfield";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";

interface Props {
  placeholder: string;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

export const SearchOption = ({
  placeholder,
  onSearch,
  searchTerm,
}: Props): JSX.Element => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
