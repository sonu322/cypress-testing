import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { JQLEditor } from "../JQLEditor";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import Form, {
  Field,
  ErrorMessage,
  FormHeader,
  FormSection,
  FormFooter,
} from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { TableFieldsDropdown } from "../TracebilityReportModule/TableFieldsDropdown";
import { IssueField, IssueLinkType, IssueType } from "../../types/api";
import JiraCloudImpl from "../../impl/jira/Cloud";
import APIImpl from "../../impl/Cloud";
import { Dropdown } from "../common/Dropdown";
const FlexContainer = styled.div`
  display: flex;
  gap: 8px;
  line-height: 32px;
`;

interface Props {
  updateSelectedOptionIds: (value: string[]) => void;
  selectedOptionIds: string[];
  handleNewError: (error: unknown) => void;
}

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

export const IssueCardFieldsDropdownField: React.FC<Props> = ({
  selectedOptionIds,
  updateSelectedOptionIds,
  handleNewError,
}) => {
  const { t } = useTranslation();
  const [issueCardFields, setIssueCardFields] = useState<IssueField[]>([]);
  const [areOptionsLoading, setAreOptionsLoading] = useState(false);

  const api = createAPI();
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const result = await api.getIssueFields();

        // setting state - table field options

        setIssueCardFields(result);

        // if (
        //   lastSavedReportConfig.selectedIssueTypeIds !== undefined &&
        //   lastSavedReportConfig.selectedIssueTypeIds !== null
        // ) {
        //   setSelectedIssueTypeIds(lastSavedReportConfig.selectedIssueTypeIds);
        // } else {
        //   setSelectedIssueTypeIds(getKeyValues(issueTypes, "id"));
        // }
        // if (
        //   lastSavedReportConfig?.selectedLinkTypeIds !== undefined &&
        //   lastSavedReportConfig?.selectedLinkTypeIds !== null
        // ) {
        //   setSelectedLinkTypeIds(lastSavedReportConfig.selectedLinkTypeIds);
        // } else {
        //   setSelectedLinkTypeIds(getKeyValues(linkTypes, "id"));
        // }

        // loading state
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
        handleNewError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Field name="issue-cards-fields" label={"Issue Card Fields"}>
      {({ fieldProps, error }) => {
        return (
          <div>
            <Dropdown
              dropdownName={t("otpl.lxp.toolbar.issue-card-fields")}
              options={issueCardFields}
              selectedOptions={selectedOptionIds}
              updateSelectedOptionIds={updateSelectedOptionIds}
            />
            {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
          </div>
        );
      }}
    </Field>
  );
};
