import React, { useContext, useEffect, useMemo, useState } from "react";
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
import Button, { ButtonGroup } from "@atlaskit/button";
import { DashboardContext } from "./DashboardContext";
import JiraCloudImpl from "../../impl/jira/Cloud";
import APIImpl from "../../impl/Cloud";
import { ErrorsList } from "../common/ErrorsList";

type ValidationError = Record<string, string>;

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

export const GadgetConfigurationForm: React.FC = () => {
  const [inputConfig, setInputConfig] = useState<TreeGadgetConfig>({
    title: DEFAULT_GADGET_TITLE,
    issueKey: "",
    height: DEFAULT_GADGET_HEIGHT,
  });
  const [apiResponseErrors, setApiResponseErrors] = useState<Error[]>([]);
  const dashboardContext = useContext(DashboardContext);
  const {
    dashboardId,
    dashboardItemId,
    config: savedConfig,
    updateConfig: updateSavedConfig,
    updateIsConfiguring,
  } = dashboardContext;

  const api = useMemo(() => createAPI(), []);
  useEffect(() => {
    if (savedConfig !== undefined) {
      setInputConfig(savedConfig);
    }
  }, [savedConfig, setInputConfig]);
  const handleCancelFormSubmission = (): void => {
    updateIsConfiguring(false);
  };
  const handleSave = async (): ValidationError => {
    setApiResponseErrors([]);
    const errors = validate(inputConfig);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    try {
      await Promise.all([
        api.editDashboardItemProperty(
          dashboardId,
          dashboardItemId,
          "config",
          inputConfig
        ),
        api.editDashboardItemTitle(
          dashboardId,
          dashboardItemId,
          inputConfig.title
        ),
      ]).then(() => {
        updateIsConfiguring(false);
      });
    } catch (error) {
      console.error(error);
      setApiResponseErrors([error]);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type } = event.target;
    let parsedValue: unknown = value;
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
    return errors;
  };

  return (
    <div>
      <ErrorsList errors={apiResponseErrors} />
      <Form onSubmit={handleSave}>
        {({ formProps }) => {
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
                <ButtonGroup>
                  <Button
                    appearance="subtle"
                    onClick={handleCancelFormSubmission}
                  >
                    Cancel
                  </Button>
                  <Button appearance="primary" type="submit">
                    Submit
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          );
        }}
      </Form>
    </div>
  );
};
