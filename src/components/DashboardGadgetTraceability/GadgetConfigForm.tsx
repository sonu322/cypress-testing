import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  HEIGHT_FIELD_NAME,
  initializationGadgetConfig,
  ISSUE_CARD_FIELDS_DROPDOWN_NAME,
  JQL_FIELD_NAME,
  MIN_GADGET_HEIGHT,
  PAGE_SIZE_DROPDOWN_NAME,
  SELECTED_ISSUE_TYPE_IDS_KEY,
  SELECTED_LINK_TYPE_IDS_KEY,
  TABLE_FIELDS_DROPDOWN_NAME,
  VIEW_TYPE_FIELD_NAME,
} from "../../constants/gadgetTraceability";
import { TraceabilityGadgetConfig } from "../../types/app";
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
import { DASHBOARD_GADGET_CONFIG_KEY } from "../../constants/gadgetTree";

const Container = styled.div`
  display: inline-block;
`;
type ValidationError = Record<string, string>;
export const GadgetConfigurationForm: React.FC = () => {
  const [inputConfig, setInputConfig] = useState<TraceabilityGadgetConfig>();
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
        const linkTypeIds = linkTypes.map((linkType) => linkType.id);
        if (savedConfig === undefined) {
          handleInputChange(SELECTED_ISSUE_TYPE_IDS_KEY, issueTypeIds);
          handleInputChange(SELECTED_LINK_TYPE_IDS_KEY, linkTypeIds);
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
          DASHBOARD_GADGET_CONFIG_KEY,
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
  const configureLabel = t("otpl.lxp.gadget-common.configure-label");
  const configureFormDescription = t(
    "otpl.lxp.gadget-common.configure-form.description"
  );
  const heightLabel = t("otpl.lxp.gadget-common.configure-form.fields.height");
  const submitButtonLabel = t(
    "otpl.lxp.gadget-common.configure-form.buttons.submit"
  );
  const cancelButtonLabel = t(
    "otpl.lxp.gadget-common.configure-form.buttons.cancel"
  );
  const badHeightError = t(
    "otpl.lxp.gadget-common.configure-form.errors.bad-height"
  );
  const viewTypeLabel = t(
    "otpl.lxp.traceability-gadget.configure-form.fields.view-type.label"
  );
  const jqlLabel = t(
    "otpl.lxp.traceability-gadget.configure-form.fields.jql.label"
  );
  const tableFieldsLabel = t(
    "otpl.lxp.traceability-gadget.configure-form.fields.table-fields.label"
  );

  const issueCardsFieldLabel = t("otpl.lxp.toolbar.issue-card-fields");
  const validate = (values: TraceabilityGadgetConfig): ValidationError => {
    const errors: ValidationError = {};
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
      inputConfig[VIEW_TYPE_FIELD_NAME] === ISSUE_TYPE_VIEW_ID;
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
                      name={VIEW_TYPE_FIELD_NAME}
                      label={viewTypeLabel}
                      options={reportViewOptions}
                      selectedViewType={inputConfig[VIEW_TYPE_FIELD_NAME]}
                      handleInputChange={handleInputChange}
                      isRequired
                    />
                    <JQLField
                      name={JQL_FIELD_NAME}
                      label={jqlLabel}
                      isRequired
                      selectedJQLString={inputConfig[JQL_FIELD_NAME]}
                      handleInputChange={handleInputChange}
                      handleApiError={(error: Error) => {
                        setApiResponseErrors((prevErrors) => [
                          ...prevErrors,
                          error,
                        ]);
                      }}
                    />

                    {inputConfig[VIEW_TYPE_FIELD_NAME] !==
                      TREE_TYPE_VIEW_ID && (
                      <TableFieldsDropdownField
                        name={TABLE_FIELDS_DROPDOWN_NAME}
                        label={tableFieldsLabel}
                        options={
                          isIssueTypeViewTabSelected ? issueTypes : linkTypes
                        }
                        viewType={inputConfig[VIEW_TYPE_FIELD_NAME]}
                        selectedOptionIds={
                          isIssueTypeViewTabSelected
                            ? inputConfig[SELECTED_ISSUE_TYPE_IDS_KEY]
                            : inputConfig[SELECTED_LINK_TYPE_IDS_KEY]
                        }
                        configKey={
                          isIssueTypeViewTabSelected
                            ? SELECTED_ISSUE_TYPE_IDS_KEY
                            : SELECTED_LINK_TYPE_IDS_KEY
                        }
                        areOptionsLoading={
                          isIssueTypeViewTabSelected
                            ? areIssueTypesLoading
                            : areLinkTypesLoading
                        }
                        handleInputChange={handleInputChange}
                      />
                    )}
                    <IssueCardFieldsDropdownField
                      name={ISSUE_CARD_FIELDS_DROPDOWN_NAME}
                      label={issueCardsFieldLabel}
                      selectedOptionIds={
                        inputConfig[ISSUE_CARD_FIELDS_DROPDOWN_NAME]
                      }
                      handleInputChange={handleInputChange}
                      handleApiError={(error: Error) => {
                        setApiResponseErrors((prevErrors) => [
                          ...prevErrors,
                          error,
                        ]);
                      }}
                    />

                    <PageSizeDropdownField
                      name={PAGE_SIZE_DROPDOWN_NAME}
                      label={t(
                        "otpl.lxp.traceability-report.fetch-limit-dropdown.name"
                      )}
                      isRequired
                      handleInputChange={handleInputChange}
                      selectedLimit={inputConfig[PAGE_SIZE_DROPDOWN_NAME]}
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
                            value={inputConfig.height}
                            type="number"
                            min={MIN_GADGET_HEIGHT}
                            step="1"
                            onChange={(event) => {
                              handleInputChange(
                                HEIGHT_FIELD_NAME,
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
