import React, { useState, useEffect, useContext } from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { TableFieldsDropdown } from "../TracebilityReportModule/TableFieldsDropdown";

import {
  ISSUE_TYPE_VIEW_ID,
  LINK_TYPE_VIEW_ID,
} from "../../constants/traceabilityReport";
import { APIContext } from "../../context/api";
import { IssueLinkType, IssueType } from "../../types/api";

interface Props {
  handleInputChange: (name: any, value: any, type?: any) => void;
  selectedOptionIds: string[];
  handleApiError: (error: unknown) => void;
  viewType: string;
  isRequired?: boolean;
  options: IssueType[] | IssueLinkType[];
  areOptionsLoading: boolean;
  configKey: string;
}

export const TableFieldsDropdownField: React.FC<Props> = ({
  selectedOptionIds,
  handleInputChange,
  viewType,
  isRequired,
  options,
  areOptionsLoading,
  configKey,
}) => {
  const { t } = useTranslation();

  // const [areOptionsLoading, setAreOptionsLoading] = useState(false);

  // const api = useContext(APIContext);
  // useEffect(() => {
  //   const loadData = async (): Promise<void> => {
  //     try {
  //       const result = await Promise.all([
  //         api.getIssueTypes(),
  //         api.getIssueLinkTypes(),
  //       ]);

  //       const issueTypes = result[0];
  //       const linkTypes = result[1];

  //       // setting state - table field options

  //       setIssueTypes(issueTypes);
  //       setLinkTypes(linkTypes);
  //       setAreOptionsLoading(false);
  //     } catch (error) {
  //       setAreOptionsLoading(false);
  //       handleApiError(error);
  //     }
  //   };
  //   void loadData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (viewType === ISSUE_TYPE_VIEW_ID) {
  //     const optionIds = issueTypes.map((issueType) => issueType.id);
  //     if (selectedOptionIds === undefined) {
  //       handleInputChange("tableFields", optionIds);
  //     }
  //   } else if (viewType === LINK_TYPE_VIEW_ID) {
  //     const optionIds = linkTypes.map((linkType) => linkType.id);
  //     if (selectedOptionIds === undefined) {
  //       handleInputChange("tableFields", optionIds);
  //     }
  //   }
  //   // else {
  //   //   handleInputChange("tableFields", undefined);
  //   // }
  // };, [viewType, issueTypes, linkTypes]);
  // let viewTypeOptions = [];
  // if (viewType === ISSUE_TYPE_VIEW_ID) {
  //   viewTypeOptions = issueTypes;
  // } else if (viewType === LINK_TYPE_VIEW_ID) {
  //   viewTypeOptions = linkTypes;
  // }
  if (
    areOptionsLoading ||
    selectedOptionIds === undefined ||
    viewType === undefined ||
    viewType === ""
  ) {
    return <em></em>;
  } else {
    return (
      <Field
        name={"tableFields"}
        label={"Table Fields"}
        isRequired={isRequired}
      >
        {({ error }) => {
          return (
            <div>
              <TableFieldsDropdown
                isDisabled={true}
                options={options}
                selectedOptions={selectedOptionIds}
                updateSelectedOptionIds={(updatedList) => {
                  handleInputChange(configKey, updatedList);
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
