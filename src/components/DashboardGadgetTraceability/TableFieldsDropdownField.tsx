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
import {
  ISSUE_TYPE_VIEW_ID,
  LINK_TYPE_VIEW_ID,
  TREE_TYPE_VIEW_ID,
} from "../../constants/traceabilityReport";

interface Props {
  handleInputChange: (name: any, value: any, type?: any) => void;
  selectedOptionIds: string[];
  handleApiError: (error: unknown) => void;
  viewType: string;
}

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

export const TableFieldsDropdownField: React.FC<Props> = ({
  selectedOptionIds,
  handleInputChange,
  handleApiError,
  viewType,
}) => {
  console.log("Selected option ids", selectedOptionIds);
  console.log("viewType", viewType);
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
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
        handleApiError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (viewType === ISSUE_TYPE_VIEW_ID) {
      console.log("view type, ", viewType);
      const optionIds = issueTypes.map((issueType) => issueType.id);
      console.log("issuetypeoptionids", optionIds);
      handleInputChange("tableFields", optionIds);
    } else if (viewType === LINK_TYPE_VIEW_ID) {
      console.log("view type, ", viewType);
      const optionIds = linkTypes.map((linkType) => linkType.id);
      console.log("linktypeoptionids", optionIds);
      handleInputChange("tableFields", optionIds);
    } else {
      handleInputChange("tableFields", []);
    }
  }, [viewType, issueTypes, linkTypes]);
  let viewTypeOptions = [];
  if (viewType === ISSUE_TYPE_VIEW_ID) {
    viewTypeOptions = issueTypes;
  } else if (viewType === LINK_TYPE_VIEW_ID) {
    viewTypeOptions = linkTypes;
  }
  console.log("selectedOptionIds", selectedOptionIds);
  if (
    areOptionsLoading ||
    selectedOptionIds === undefined ||
    viewType === undefined ||
    viewType === ""
  ) {
    return <em></em>;
  } else {
    return (
      <Field name={"tableFields"} label={"Table Fields"}>
        {({ error }) => {
          return (
            <div>
              <TableFieldsDropdown
                isDisabled={true}
                options={viewTypeOptions}
                selectedOptions={selectedOptionIds}
                updateSelectedOptionIds={(updatedList) => {
                  console.log("UPDATEDLIST", updatedList);
                  handleInputChange("tableFields", updatedList);
                }}
              />
              {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
            </div>
          );
        }}
      </Field>
    );
  }
};
