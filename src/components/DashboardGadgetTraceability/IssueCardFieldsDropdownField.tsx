import React, { useState, useEffect } from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { IssueField } from "../../types/api";
import JiraCloudImpl from "../../impl/jira/Cloud";
import APIImpl from "../../impl/Cloud";
import { Dropdown } from "../common/Dropdown";

interface Props {
  handleInputChange: (name: any, value: any, type?: any) => void;
  selectedOptionIds: string[];
  handleApiError: (error: Error) => void;
  isRequired?: boolean;
}

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

export const IssueCardFieldsDropdownField: React.FC<Props> = ({
  selectedOptionIds,
  handleInputChange,
  handleApiError,
  isRequired,
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
        const issueCardFieldIds = result.map((field) => field.id);
        handleInputChange("issueCardFields", issueCardFieldIds);
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
        handleApiError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (areOptionsLoading || selectedOptionIds === undefined) {
    return <em>loading</em>;
  } else {
    return (
      <Field
        name="issue-cards-fields"
        label={"Issue Card Fields"}
        isRequired={isRequired}
      >
        {({ error }) => {
          return (
            <div>
              <Dropdown
                dropdownName={t("otpl.lxp.toolbar.issue-card-fields")}
                options={issueCardFields}
                selectedOptions={selectedOptionIds}
                updateSelectedOptions={(value) => {
                  handleInputChange("issueCardFields", value);
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
