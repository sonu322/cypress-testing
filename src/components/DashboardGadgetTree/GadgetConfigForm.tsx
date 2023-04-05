import React, { useEffect, useState } from "react";
import {
  DEFAULT_GADGET_HEIGHT,
  DEFAULT_GADGET_TITLE,
  MIN_GADGET_HEIGHT,
} from "../../constants/tree";
import { TreeGadgetConfig } from "../../types/app";
import Form, { Field } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
interface GadgetConfigurationFormProps {
  onSave: (GadgetConfig: TreeGadgetConfig) => void;
}
type ValidationError = Record<string, string>;
export const GadgetConfigurationForm: React.FC<GadgetConfigurationFormProps> = ({
  onSave,
}) => {
  const [inputConfig, setInputConfig] = useState<TreeGadgetConfig>({
    title: DEFAULT_GADGET_TITLE,
    issueKey: "",
    height: DEFAULT_GADGET_HEIGHT,
  });
  useEffect(() => {
    AP.context.getToken(function (token) {
      console.log("Access token:", token);
    }); // TODO: check why token is undefined

    AP.request({
      url: "/config",
      success: (response) => {
        setInputConfig(response.config); // last saved value
      },
    });
  }, []);

  const handleSave = (event: React.FormEvent<HTMLFormElement>): void => {
    // if (event !== undefined) {
    //   event.preventDefault();
    // }
    // AP.request({
    //   url: "/config",
    //   type: "POST",
    //   data: JSON.stringify({ config: inputConfig }),
    //   success: () => {
    //     onSave(inputConfig);
    //   },
    // });
    onSave(inputConfig);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type } = event.target;
    let parsedValue: unknown = value;
    console.log(name, value, type);
    if (type === "number") {
      parsedValue = parseFloat(value);
    }
    setInputConfig((prevConfig) => ({
      ...prevConfig,
      [name]: parsedValue,
    }));
  };

  const validate = (values: TreeGadgetConfig): ValidationError => {
    const errors: ValidationError = {};
    const issueKeyRegex = /^[A-Z][A-Z0-9]{0,9}-\d+$/; // Regex for issue key pattern
    if (values.issueKey !== undefined && values.issueKey !== "") {
      errors.issueKey = "Please enter an issue key";
    } else if (!issueKeyRegex.test(values.issueKey)) {
      errors.issueKey = "Please enter a valid issue key";
    }

    if (values.height < MIN_GADGET_HEIGHT) {
      errors.height = `Minimum height: ${MIN_GADGET_HEIGHT} `;
    }

    return errors;
  };

  // return (
  //   <form onSubmit={handleSave}>
  //     <label htmlFor="title">Title</label>
  //     <input
  //       type="text"
  //       name="title"
  //       id="title"
  //       value={inputConfig.title}
  //       onChange={handleInputChange}
  //     />
  //     <br />
  //     <label htmlFor="issueKey">Issue Key</label>
  //     <input
  //       type="text"
  //       name="issueKey"
  //       id="issueKey"
  //       value={inputConfig.issueKey}
  //       onChange={handleInputChange}
  //     />
  //     <br />
  //     <label htmlFor="height">Tree Height</label>
  //     <input
  //       type="number"
  //       name="height"
  //       id="height"
  //       value={inputConfig.height}
  //       onChange={handleInputChange}
  //     />
  //     <br />
  //     <button type="submit">Save</button>
  //   </form>
  // );

  return (
    <Form onSubmit={handleSave} validate={validate}>
      {({ formProps, submitting }) => {
        console.log(formProps, submitting);
        return (
          <form {...formProps}>
            <Field name="title" label="Title">
              {({ fieldProps, error }) => (
                <>
                  <TextField
                    {...fieldProps}
                    value={inputConfig.title}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </Field>
            {/* <TextField
              label="Title"
              name="title"
              onChange={handleInputChange}
            /> */}
            <Field name="issueKey" label="Issue Key">
              {({ fieldProps, error }) => (
                <>
                  <TextField
                    {...fieldProps}
                    value={inputConfig.issueKey}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </Field>
            {/* <FieldNumber
              label="Tree Height (in px)"
              name="height"
              min={MIN_GADGET_HEIGHT}
              defaultValue={DEFAULT_GADGET_HEIGHT}
              onChange={handleInputChange}
            /> */}
            <Field
              name="height"
              label="Height"
              defaultValue={MIN_GADGET_HEIGHT}
              // validate={validateHeight}
            >
              {({ fieldProps, error }) => (
                <>
                  <TextField
                    {...fieldProps}
                    value={inputConfig.height}
                    type="number"
                    min={MIN_GADGET_HEIGHT}
                    step="1"
                    onChange={handleInputChange}
                  />
                </>
              )}
            </Field>
            <button type="submit">Submit</button>
          </form>
        );
      }}
    </Form>
  );
};;;;;;;;;;;
