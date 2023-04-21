import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  DEFAULT_GADGET_HEIGHT,
  initializationGadgetConfig,
  MIN_GADGET_HEIGHT,
} from "../../constants/gadgetTraceability";
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
import { ViewSelect } from "./ViewSelect";
import { JQLField } from "./JQLField";
import { TableFieldsDropdownField } from "./TableFieldsDropdownField";
import { IssueCardFieldsDropdownField } from "./IssueCardFieldsDropdownField";
import { PageSizeDropdownField } from "./PageSizeDropdownField";
import { IssueLinkType, IssueType } from "../../types/api";
import {
  ISSUE_TYPE_VIEW_ID,
  TREE_TYPE_VIEW_ID,
  viewTabs,
} from "../../constants/traceabilityReport";
import { APIContext } from "../../context/api";

const Container = styled.div`
  display: inline-block;
`;
type ValidationError = Record<string, string>;
export const GadgetConfigurationForm: React.FC = () => {
  const [inputConfig, setInputConfig] = useState<any>();
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [linkTypes, setLinkTypes] = useState<IssueLinkType[]>([]);
  const [areIssueTypesLoading, setAreIssueTypesLoading] =
    useState<boolean>(false);
  const [areLinkTypesLoading, setAreLinkTypesLoading] =
    useState<boolean>(false);
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setAreIssueTypesLoading(true);
      setAreLinkTypesLoading(true);
      try {
        const result = await Promise.all([
          api.getIssueTypes(),
          api.getIssueLinkTypes(),
        ]);

        const issueTypes = result[0];
        const linkTypes = result[1];

        // setting state - table field options

        setIssueTypes(issueTypes);
        setLinkTypes(linkTypes);
        const issueTypeIds = issueTypes.map((issueType) => issueType.id);
        const linkTypeIds = issueTypes.map((linkType) => linkType.id);
        if (savedConfig === undefined) {
          handleInputChange("selectedIssueTypeIds", issueTypeIds);
          handleInputChange("selectedLinkTypeIds", linkTypeIds);
        }
        setAreIssueTypesLoading(false);
        setAreLinkTypesLoading(false);
      } catch (error) {
        setAreIssueTypesLoading(false);
        setAreLinkTypesLoading(false);
        setApiResponseErrors((prevErrors) => [...prevErrors, error]);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    } else {
      setInputConfig(initializationGadgetConfig);
    }
  }, [savedConfig, setInputConfig]);

  const { t } = useTranslation();

  const api = useContext(APIContext);
  const handleCancelFormSubmission = (): void => {
    updateIsConfiguring(false);
  };
  const handleSave = async (): Promise<ValidationError> => {
    setApiResponseErrors([]);
    const errors = validate(inputConfig);
    if (Object.keys(errors).length > 0) {
      return errors;
    }
    try {
      updateSavedConfig(inputConfig);
      await Promise.all([
        api.editDashboardItemProperty(
          dashboardId,
          dashboardItemId,
          "config",
          inputConfig
        ),
      ]);
      updateIsConfiguring(false);
    } catch (error) {
      console.error(error);
      setApiResponseErrors((prevErrors) => [...prevErrors, error]);
    }
  };

  const handleInputChange = (name, value, type?): void => {
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

  if (inputConfig !== undefined) {
    const isIssueTypeViewTabSelected =
      inputConfig.viewType === ISSUE_TYPE_VIEW_ID;
    return (
      <>
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
                  <Container>
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
                        options={
                          isIssueTypeViewTabSelected ? issueTypes : linkTypes
                        }
                        viewType={inputConfig.viewType}
                        selectedOptionIds={
                          isIssueTypeViewTabSelected
                            ? inputConfig.selectedIssueTypeIds
                            : inputConfig.selectedLinkTypeIds
                        }
                        configKey={
                          isIssueTypeViewTabSelected
                            ? "selectedIssueTypeIds"
                            : "selectedLinkTypeIds"
                        }
                        areOptionsLoading={
                          isIssueTypeViewTabSelected
                            ? areIssueTypesLoading
                            : areLinkTypesLoading
                        }
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
                              handleInputChange(
                                "height",
                                event.target.value,
                                "number"
                              );
                            }}
                          />
                          {Boolean(error) && (
                            <ErrorMessage>{error}</ErrorMessage>
                          )}
                        </>
                      )}
                    </Field>
                  </Container>
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
      </>
    );
  } else {
    return <em>asd</em>;
  }
};
