import React, { useContext, useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";
import { IssueKeyField } from "./IssueKeyField";
import {
  badHeightError,
  badIssueKeyError,
  DASHBOARD_GADGET_CONFIG_KEY,
  defaultGadgetConfig,
  HEIGHT_FIELD_NAME,
  ISSUE_KEY_FIELD_NAME,
  MIN_GADGET_HEIGHT,
  noIssueKeyError,
} from "../../constants/gadgetTree";

interface Props {
  setApiResponseErrors: React.Dispatch<React.SetStateAction<Error[]>>;
}
type ValidationError = Record<string, string>;
const validate = (values: TreeGadgetConfig): ValidationError => {
  const errors: ValidationError = {};
  const issueKeyRegex = /^[A-Z][A-Z0-9]{0,9}-\d+$/; // Regex for issue key pattern
  if (
    values[ISSUE_KEY_FIELD_NAME] === undefined ||
    values[ISSUE_KEY_FIELD_NAME] === ""
  ) {
    errors[ISSUE_KEY_FIELD_NAME] = noIssueKeyError;
  } else if (!issueKeyRegex.test(values[ISSUE_KEY_FIELD_NAME])) {
    errors[ISSUE_KEY_FIELD_NAME] = badIssueKeyError;
  }

  if (values[HEIGHT_FIELD_NAME] < MIN_GADGET_HEIGHT) {
    errors[HEIGHT_FIELD_NAME] = `${badHeightError} : ${MIN_GADGET_HEIGHT} `;
  }
  return errors;
};

export const GadgetConfigurationForm: React.FC<Props> = ({
  setApiResponseErrors,
}) => {
  const [inputConfig, setInputConfig] =
    useState<TreeGadgetConfig>(defaultGadgetConfig);
  const dashboardContext = useContext(DashboardContext);
  const {
    dashboardId,
    dashboardItemId,
    [DASHBOARD_GADGET_CONFIG_KEY]: savedConfig,
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
  const handleSave = async (): Promise<ValidationError> => {
    setApiResponseErrors([]);
    const errors = validate(inputConfig);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    updateSavedConfig(inputConfig);
    updateIsConfiguring(false);
    try {
      await api.editDashboardItemProperty(
        dashboardId,
        dashboardItemId,
        DASHBOARD_GADGET_CONFIG_KEY,
        inputConfig
      );
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
  const configureLabel = t("otpl.lxp.gadget-common.configure-label");
  const configureFormDescription = t(
    "otpl.lxp.gadget-common.configure-form.description"
  );
  const issueKeyLabel = t(
    "otpl.lxp.tree-gadget.configure-form.fields.issue-key"
  );
  const heightLabel = t("otpl.lxp.gadget-common.configure-form.fields.height");
  const submitButtonLabel = t(
    "otpl.lxp.gadget-common.configure-form.buttons.submit"
  );
  const cancelButtonLabel = t(
    "otpl.lxp.gadget-common.configure-form.buttons.cancel"
  );

  return (
    <div>
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
                <IssueKeyField
                  isRequired={true}
                  name={ISSUE_KEY_FIELD_NAME}
                  label={issueKeyLabel}
                  selectedIssueKey={inputConfig.issueKey}
                  handleInputChange={handleInputChange}
                />
                <Field
                  name={HEIGHT_FIELD_NAME}
                  label={heightLabel}
                  defaultValue={MIN_GADGET_HEIGHT}
                >
                  {({ fieldProps, error }) => (
                    <>
                      <TextField
                        {...fieldProps}
                        value={inputConfig[HEIGHT_FIELD_NAME]}
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
