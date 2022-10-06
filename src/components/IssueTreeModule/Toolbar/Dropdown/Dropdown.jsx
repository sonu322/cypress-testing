import React, { useState, useEffect } from "react";
import { CheckboxSelect } from "@atlaskit/select";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import Spinner from "@atlaskit/spinner";
export const Dropdown = ({
  filter,
  keyName,
  updateKeyOptions,
  updateFilteredKeyOptions,
  api,
}) => {
  const [options, setOptions] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  useEffect(() => {
    api().then((data) => {
      console.log("data!!!!!");
      setOptions(data);
      console.log(data);
      updateFilteredKeyOptions(
        keyName,
        data.map((item) => item.id)
      );
      setIsFetched(true);
    });
  }, []);
  //   let formattedOptions = [];
  //   formattedOptions =
  //     options &&
  //     options.length &&
  //     options.length > 0 &&
  //     options.map(({ id, name }) => ({
  //       label: name,
  //       value: id,
  //     }));
  //   return (
  //     <>
  //       <label htmlFor={`${keyName}-select`}>Select {keyName}</label>
  //       <CheckboxSelect
  //         inputId={`${keyName}-select`}
  //         className="checkbox-select"
  //         classNamePrefix="select"
  //         options={formattedOptions}
  //         onChange={(value) => {
  //           console.log("value!!");
  //           console.log(value);
  //           updateFilteredKeyOptions(keyName, value);
  //         }}
  //         placeholder={`Select ${keyName}`}
  //       />
  //     </>
  //   );
  const handleOptionClick = (e, id) => {
    console.log(e);
    const filteredOptions = filter[keyName];
    let updated = [];
    if (filteredOptions.includes(id)) {
      updated = filteredOptions.filter((item, index) => item != id);
    } else {
      updated = [...filteredOptions, id];
    }
    updateFilteredKeyOptions(keyName, updated);
  };
  return (
    <>
      <DropdownMenu
        isLoading={!isFetched}
        triggerType="button"
        trigger={keyName}
        shouldFlip={false}
        position="bottom right"
        isCompact={true}
      >
        <DropdownItemCheckboxGroup>
          {options &&
            options.map((option) => (
              <DropdownItemCheckbox
                key={option.id}
                id={option.id}
                isSelected={filter[keyName].includes(option.id)}
                onClick={(e) => handleOptionClick(e, option.id)}
              >
                {option.name}
              </DropdownItemCheckbox>
            ))}
        </DropdownItemCheckboxGroup>
      </DropdownMenu>
    </>
  );
};
