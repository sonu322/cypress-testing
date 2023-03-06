import React, { useEffect, useState, useContext } from "react";
import { DropdownSingleSelect } from "./common/DropdownSingleSelect";
import { APIContext } from "../context/api";
import { Filter } from "../types/api";
import { useTranslation } from "react-i18next";

interface Props {
  selectedFilterId: string;
  updateSelectedFilterId: (filterId: string) => void;
  handleNewError: (err: unknown) => void;
}

export const JQLSelectDropdown = ({
  selectedFilterId,
  updateSelectedFilterId,
  handleNewError,
}: Props): JSX.Element => {
  const { t } = useTranslation();
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
      dropdownName={
        selectedOption?.name ??
        t("otpl.lxp.traceability-report.toolbar.filterdropdown.name")
      }
      options={filters}
      selectedOptionId={selectedFilterId}
      updateSelectedOptionId={updateSelectedFilterId}
    ></DropdownSingleSelect>
  );
};
