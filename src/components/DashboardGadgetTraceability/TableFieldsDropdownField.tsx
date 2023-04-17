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
import { IssueLinkType, IssueType } from "../../types/api";
import JiraCloudImpl from "../../impl/jira/Cloud";
import APIImpl from "../../impl/Cloud";
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

export const TableFieldsField: React.FC<Props> = ({
  selectedOptionIds,
  updateSelectedOptionIds,
  handleNewError,
}) => {
  const { t } = useTranslation();
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [linkTypes, setLinkTypes] = useState<IssueLinkType[]>([]);
  const [areOptionsLoading, setAreOptionsLoading] = useState(false);

  const api = createAPI();
  useEffect(() => {
    const loadData = async (): Promise<void> => {
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
    <Field name="table-fields" label={"Table Fields"}>
      {({ fieldProps, error }) => {
        console.log("field props for new comp", fieldProps);
        return (
          <>
            <TableFieldsDropdown
              options={issueTypes}
              selectedOptions={selectedOptionIds}
              updateSelectedOptionIds={updateSelectedOptionIds}
            />
            {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
          </>
        );
      }}
    </Field>
  );
};
