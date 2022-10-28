import React, { useEffect, useState, useContext } from "react";
import { DropdownSingleSelect } from "./DropdownSingleSelect";
import { APIContext } from "../context/api";
import { Filter } from "../types/api";

export const JQLSelectDropdown = ({
  selectedFilterId,
  setSelectedFilterId,
  handleNewError,
}) => {
  const api = useContext(APIContext);
  const [filters, setFilters] = useState<Filter[]>([]);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        let response = await api.getFilters();
        setFilters(response);
        return response;
      } catch (error) {
        handleNewError(error);
      }
    };
    fetchFilters();
  }, []);

  const selectedOption = filters.find(
    (filter) => filter.id == selectedFilterId
  );

  return (
    <DropdownSingleSelect
      dropdownName={selectedOption?.name ?? "Select filter"}
      options={filters}
      selectedOptionId={selectedFilterId}
      updateSelectedOptionId={setSelectedFilterId}
    ></DropdownSingleSelect>
  );
};
