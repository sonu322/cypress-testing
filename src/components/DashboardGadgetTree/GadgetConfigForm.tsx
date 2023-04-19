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
import Button, { ButtonGroup } from "@atlaskit/button";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import { ErrorsList } from "../common/ErrorsList";
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";

type ValidationError = Record<string, string>;

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
  const { t } = useTranslation();

  const api = useContext(APIContext);
  useEffect(() => {
    if (savedConfig !== undefined) {
      setInputConfig(savedConfig);
    }
  }, [savedConfig, setInputConfig]);
  const handleCancelFormSubmission = (): void => {
    updateIsConfiguring(false);
  };
  const handleSave = async (): ValidationError => {
    console.log("handle save called");
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
        updateSavedConfig(inputConfig);
        updateIsConfiguring(false);
      });
    } catch (error) {
      console.error(error);
      setApiResponseErrors((prevErrors) => [...prevErrors, error]);
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
  const configureLabel = t("otpl.lxp.gadget.configure-label");
  const configureFormDescription = t(
    "otpl.lxp.gadget.configure-form.description"
  );
  const titleLabel = t("otpl.lxp.gadget.configure-form.fields.title");
  const issueKeyLabel = t("otpl.lxp.gadget.configure-form.fields.issue-key");
  const heightLabel = t("otpl.lxp.gadget.configure-form.fields.height");
  const noTitleError = t("otpl.lxp.gadget.configure-form.errors.no-title");
  const badTtileError = t("otpl.lxp.gadget.configure-form.errors.bad-title");
  const submitButtonLabel = t("otpl.lxp.gadget.configure-form.buttons.submit");
  const cancelButtonLabel = t("otpl.lxp.gadget.configure-form.buttons.cancel");
  const noIssueKeyError = t(
    "otpl.lxp.gadget.configure-form.errors.no-issue-key"
  );
  const badIssueKeyError = t(
    "otpl.lxp.gadget.configure-form.errors.bad-issue-key"
  );
  const badHeightError = t("otpl.lxp.gadget.configure-form.errors.bad-height");
  const validate = (values: TreeGadgetConfig): ValidationError => {
    const errors: ValidationError = {};
    const titleRegex =
      /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]{0,49}$/;
    if (values.title === undefined || values.title === "") {
      errors.issueKey = noTitleError;
    } else if (!titleRegex.test(values.title)) {
      errors.title = badTtileError;
    }
    const issueKeyRegex = /^[A-Z][A-Z0-9]{0,9}-\d+$/; // Regex for issue key pattern
    if (values.issueKey === undefined || values.issueKey === "") {
      errors.issueKey = noIssueKeyError;
    } else if (!issueKeyRegex.test(values.issueKey)) {
      errors.issueKey = badIssueKeyError;
    }

    if (values.height < MIN_GADGET_HEIGHT) {
      errors.height = `${badHeightError} : ${MIN_GADGET_HEIGHT} `;
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
                title={configureLabel}
                // description="* indicates a required field"
                description={configureFormDescription}
              />

              <FormSection>
                <Field name="title" label={titleLabel} isRequired>
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
                <Field name="issueKey" label={issueKeyLabel} isRequired>
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
                  label={heightLabel}
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
                    {cancelButtonLabel}
                  </Button>
                  <Button appearance="primary" type="submit">
                    {submitButtonLabel}
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
