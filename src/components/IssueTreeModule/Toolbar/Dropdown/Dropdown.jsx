import React, { useState, useEffect } from "react";
import { CheckboxSelect } from "@atlaskit/select";
export const Dropdown = ({
  filter,
  keyName,
  updateKeyOptions,
  updateFilteredKeyOptions,
  api,
}) => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    api().then((data) => {
      //   this.setState(
      //     {
      //       selected: selected,
      //       fetched: true,
      //       types: data,
      //     },
      //     () => {
      //       this.props.filter(this.state.selected);
      //     }
      //   );
      console.log("data!!!!!");
      console.log(data);

      setOptions(data);
      //   let filteredOptions = data.map(({id}) => (id))
      //   updateFilteredKeyOptions(keyName, filteredOptions);
    });
  }, []);
  let formattedOptions = [{ label: "asdf", id: "asdf" }];
  formattedOptions =
    options &&
    options.length &&
    options.length > 0 &&
    options.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  return (
    // <div>
    //   {filter &&
    //     filter[keyName] &&
    //     filter[keyName].map((item) => <span>{item.id}</span>)}

    // </div>
    <>
      <label htmlFor={`${keyName}-select`}>Select {keyName}</label>
      <CheckboxSelect
        inputId={`${keyName}-select`}
        className="checkbox-select"
        classNamePrefix="select"
        options={formattedOptions}
        onChange={(value) => {
          console.log("value!!");
          console.log(value);
          updateFilteredKeyOptions(keyName, value);
        }}
        placeholder={`Select ${keyName}`}
      />
    </>
  );
};
