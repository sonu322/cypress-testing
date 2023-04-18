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
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import JiraCloudImpl from "../../impl/jira/Cloud";
import APIImpl from "../../impl/Cloud";
import { ErrorsList } from "../common/ErrorsList";
import { useTranslation } from "react-i18next";
import { ViewSelect } from "./ViewSelect";
import { JQLField } from "./JQLField";
import { TableFieldsDropdownField } from "./TableFieldsDropdownField";
import { IssueCardFieldsDropdownField } from "./IssueCardFieldsDropdownField";
import { PageSizeDropdownField } from "./PageSizeDropdownField";
import {
  ISSUE_TYPE_VIEW_ID,
  LINK_TYPE_VIEW_ID,
  TREE_TYPE_VIEW_ID,
  viewTabs,
} from "../../constants/traceabilityReport";

type ValidationError = Record<string, string>;

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

export const GadgetConfigurationForm: React.FC = () => {
  const [inputConfig, setInputConfig] = useState<any>({
    title: DEFAULT_GADGET_TITLE,
    viewType: "",
    height: DEFAULT_GADGET_HEIGHT,
    tableFields: [],
    issueCardFields: [],
    pageSize: 20,
  });

  console.log("initial");
  console.log(inputConfig);
  const [apiResponseErrors, setApiResponseErrors] = useState<Error[]>([]);
  const dashboardContext = useContext(DashboardContext);
  const {
    dashboardId,
    dashboardItemId,
    config: savedConfig,
    updateConfig: updateSavedConfig,
    updateIsConfiguring,
  } = dashboardContext;

  useEffect(() => {
    if (savedConfig !== undefined) {
      setInputConfig(savedConfig);
    }
  }, [savedConfig, setInputConfig]);

  const { t } = useTranslation();

  const api = useMemo(() => createAPI(), []);
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
    console.log(errors);
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
        // api.editDashboardItemTitle(
        //   dashboardId,
        //   dashboardItemId,
        //   inputConfig.title
        // ),
      ]);
      console.log("called apis done");
      updateIsConfiguring(false);
      updateSavedConfig(inputConfig);
    } catch (error) {
      console.error(error);
      setApiResponseErrors((prevErrors) => [...prevErrors, error]);
    }
  };

  const handleInputChange = (name, value, type?): void => {
    console.log("HANDLE INPUT CHANGE CALLED");
    console.log(name, value, type);
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
  const heightLabel = t("otpl.lxp.gadget.configure-form.fields.height");
  const noTitleError = t("otpl.lxp.gadget.configure-form.errors.no-title");
  const badTtileError = t("otpl.lxp.gadget.configure-form.errors.bad-title");
  const submitButtonLabel = t("otpl.lxp.gadget.configure-form.buttons.submit");
  const cancelButtonLabel = t("otpl.lxp.gadget.configure-form.buttons.cancel");
  const badHeightError = t("otpl.lxp.gadget.configure-form.errors.bad-height");
  const validate = (values: TreeGadgetConfig): ValidationError => {
    const errors: ValidationError = {};
    const titleRegex =
      /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]{0,49}$/;
    if (values.title === undefined || values.title === "") {
      errors.title = noTitleError;
    } else if (!titleRegex.test(values.title)) {
      errors.title = badTtileError;
    }
    if (values.height < MIN_GADGET_HEIGHT) {
      errors.height = `${badHeightError} : ${MIN_GADGET_HEIGHT} `;
    }
    return errors;
  };
  const reportViewOptions = viewTabs.tabs.map((tab) => ({
    label: tab.name,
    value: tab.id,
  }));
  console.log("INPUT CONFIg", inputConfig);
  console.log(apiResponseErrors);
  return (
    <div>
      <ErrorsList errors={apiResponseErrors} />
      <Form onSubmit={handleSave}>
        {({ formProps }) => {
          return (
            <form {...formProps}>
              <FormHeader
                title={configureLabel}
                description={configureFormDescription}
              />
              <FormSection>
                <ViewSelect
                  name={"viewType"}
                  label={"Select a view"}
                  options={reportViewOptions}
                  selectedViewType={inputConfig.viewType}
                  handleInputChange={handleInputChange}
                  isRequired
                />
                <JQLField
                  isRequired
                  selectedJQLString={inputConfig.jql}
                  handleInputChange={handleInputChange}
                  handleApiError={(error: Error) => {
                    setApiResponseErrors((prevErrors) => [
                      ...prevErrors,
                      error,
                    ]);
                  }}
                />

                {inputConfig.viewType !== TREE_TYPE_VIEW_ID && (
                  <TableFieldsDropdownField
                    viewType={inputConfig.viewType}
                    selectedOptionIds={inputConfig.tableFields}
                    handleInputChange={handleInputChange}
                    handleApiError={(error: Error) => {
                      setApiResponseErrors((prevErrors) => [
                        ...prevErrors,
                        error,
                      ]);
                    }}
                  />
                )}

                <IssueCardFieldsDropdownField
                  selectedOptionIds={inputConfig.issueCardFields}
                  handleInputChange={handleInputChange}
                  handleApiError={(error: Error) => {
                    setApiResponseErrors((prevErrors) => [
                      ...prevErrors,
                      error,
                    ]);
                  }}
                />

                <PageSizeDropdownField
                  isRequired
                  handleInputChange={handleInputChange}
                  selectedLimit={inputConfig.pageSize}
                />

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
                        onChange={(event) => {
                          console.log("height", event);
                          handleInputChange(
                            "height",
                            event.target.value,
                            "number"
                          );
                        }}
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
                  <Button
                    appearance="primary"
                    type="submit"
                    onClick={handleSave}
                  >
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
