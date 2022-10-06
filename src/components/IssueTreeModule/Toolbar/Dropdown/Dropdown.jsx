import React, { useEffect } from "react";
import { CheckboxSelect } from "@atlaskit/select";
export const Dropdown = ({
  options,
  filter,
  keyName,
  updateKeyOptions,
  updateFilteredKeyOptions,
  api,
}) => {
  useEffect(() => {
    api().then((data) => {
      const selected = data.map(({ id }) => id);
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
      updateKeyOptions(keyName, data);
      //   let filteredOptions = data.map(({id}) => (id))
      //   updateFilteredKeyOptions(keyName, filteredOptions);
    });
  }, []);
  let keyOptions = options[keyName]
    ? options[keyName].map(({ id, name }) => ({
        label: name,
        value: id,
      }))
    : [];
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
        options={keyOptions}
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
