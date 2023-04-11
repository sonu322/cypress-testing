import React, { useContext, useEffect, useState } from "react";
import {
  DEFAULT_GADGET_HEIGHT,
  DEFAULT_GADGET_TITLE,
  MIN_GADGET_HEIGHT,
} from "../../constants/tree";
import { TreeGadgetConfig } from "../../types/app";
import Form, {
  Field,
  ErrorMessage,
  FormHeader,
  FormSection,
  FormFooter,
} from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";

// import TreeUtils from "../../util/TreeUtils";
// import { APIContext } from "../../context/api";
interface GadgetConfigurationFormProps {
  onSave: (GadgetConfig: TreeGadgetConfig) => void;
  dashboardId: string;
  dashboardItemId: string;
  savedConfig: TreeGadgetConfig;
}
type ValidationError = Record<string, string>;
export const GadgetConfigurationForm: React.FC<GadgetConfigurationFormProps> = ({
  onSave,
  dashboardId,
  dashboardItemId,
  savedConfig,
}) => {
  const [inputConfig, setInputConfig] = useState<TreeGadgetConfig>({
    title: DEFAULT_GADGET_TITLE,
    issueKey: "",
    height: DEFAULT_GADGET_HEIGHT,
  });
  useEffect(() => {
    if (savedConfig !== undefined) {
      setInputConfig(savedConfig);
    }
  }, [savedConfig, setInputConfig]);

  const handleSave = async (): ValidationError => {
    const errors = validate(inputConfig);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    try {
      console.log("INPUT CONFIG", inputConfig);
      await AP.request({
        url: `/rest/api/3/dashboard/${dashboardId}/items/${dashboardItemId}/properties/config`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(inputConfig),
      });
      // await AP.request({
      //   url: `/rest/api/3/dashboard/${dashboardId}/gadget/${dashboardItemId}`,
      //   type: "PUT",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   data: JSON.stringify({ title: inputConfig.title }),
      // });
      await AP.request({
        url: `/rest/api/3/dashboard/${dashboardId}/gadget/${dashboardItemId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ title: inputConfig.title }),
      });
      onSave(inputConfig);
    } catch (error) {
      console.log("error not having ap");
      console.error(error);
    }
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
    const titleRegex =
      /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{0,49}$/;
    if (values.title === undefined || values.title === "") {
      errors.issueKey = "Please enter a Title";
    } else if (!titleRegex.test(values.title)) {
      errors.title =
        "Title must start with a letter and can have a maximum of 50 characters";
    }
    const issueKeyRegex = /^[A-Z][A-Z0-9]{0,9}-\d+$/; // Regex for issue key pattern
    if (values.issueKey === undefined || values.issueKey === "") {
      errors.issueKey = "Please enter an issue key";
    } else if (!issueKeyRegex.test(values.issueKey)) {
      errors.issueKey = "Please enter a valid issue key";
    }

    if (values.height < MIN_GADGET_HEIGHT) {
      errors.height = `Minimum height: ${MIN_GADGET_HEIGHT} `;
    }
    console.log("errors from validate", errors);
    return errors;
  };

  return (
    <Form onSubmit={handleSave}>
      {({ formProps, submitting }) => {
        console.log(formProps, submitting);
        return (
          <form {...formProps}>
            <FormHeader
              title="Configure"
              description="* indicates a required field"
            />

            <FormSection>
              <Field name="title" label="Title" isRequired>
                {({ fieldProps, error }) => (
                  <>
                    <TextField
                      {...fieldProps}
                      value={inputConfig.title}
                      onChange={handleInputChange}
                    />
                    {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>
              <Field name="issueKey" label="Issue Key" isRequired>
                {({ fieldProps, error }) => (
                  <>
                    <TextField
                      {...fieldProps}
                      value={inputConfig.issueKey}
                      onChange={handleInputChange}
                    />
                    {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>
              <Field
                name="height"
                label="Height"
                defaultValue={MIN_GADGET_HEIGHT}
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
                    {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>
            </FormSection>
            <FormFooter>
              <Button appearance="primary" type="submit">
                Submit
              </Button>
            </FormFooter>
          </form>
        );
      }}
    </Form>
  );
};
