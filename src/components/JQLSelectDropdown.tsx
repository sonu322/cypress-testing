import React, { useEffect, useState, useContext } from "react";
import {DropdownSingleSelect} from "./common/DropdownSingleSelect";
import {APIContext} from "../context/api";
import {Filter} from "../types/api";

interface Props {
  selectedFilterId: string;
  setSelectedFilterId: React.Dispatch<React.SetStateAction<string>>;
  handleNewError: (err: unknown) => void;
}

export const JQLSelectDropdown = ({
  selectedFilterId,
  setSelectedFilterId,
  handleNewError,
}: Props): JSX.Element => {
  const api = useContext(APIContext);
  const [filters, setFilters] = useState<Filter[]>([]);
  useEffect(() => {
    const fetchFilters = async (): Promise<void> => {
      try {
        const response = await api.getFilters();
        setFilters(response);
      } catch (error) {
        handleNewError(error);
      }
    };
    void fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOption = filters.find(
    (filter) => filter.id === selectedFilterId
  );

  return (
    <DropdownSingleSelect
      dropdownName={selectedOption?.name ?? "Select filter"}
      options={filters}
      selectedOptionId={selectedFilterId}
      setSelectedOptionId={setSelectedFilterId}
    ></DropdownSingleSelect>
  );
};
