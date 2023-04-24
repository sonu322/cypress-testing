import React, { useState, useEffect, useContext } from "react";
import { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
import { IssueField } from "../../types/api";
import { Dropdown } from "../common/Dropdown";
import { APIContext } from "../../context/api";
import Spinner from "@atlaskit/spinner";
interface Props {
  handleInputChange: (name: any, value: any, type?: any) => void;
  selectedOptionIds: string[];
  handleApiError: (error: Error) => void;
  isRequired?: boolean;
  name: string;
  label: string;
}

export const IssueCardFieldsDropdownField: React.FC<Props> = ({
  selectedOptionIds,
  handleInputChange,
  handleApiError,
  isRequired,
  name,
  label,
}) => {
  const { t } = useTranslation();
  const [issueCardFields, setIssueCardFields] = useState<IssueField[]>([]);
  const [areOptionsLoading, setAreOptionsLoading] = useState(false);

  const api = useContext(APIContext);
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const result = await api.getIssueFields();

        // setting state - table field options

        setIssueCardFields(result);
        const issueCardFieldIds = result.map((field) => field.id);
        if (selectedOptionIds === undefined) {
          handleInputChange(name, issueCardFieldIds);
        }
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
        handleApiError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Field name={name} label={label} isRequired={isRequired}>
      {({ error }) => {
        if (areOptionsLoading || selectedOptionIds === undefined) {
          return <Spinner size={"small"} />;
        }
        return (
          <div>
            <Dropdown
              dropdownName={label}
              options={issueCardFields}
              selectedOptions={selectedOptionIds}
              updateSelectedOptions={(value) => {
                handleInputChange(name, value);
              }}
            />
            {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
          </div>
        );
      }}
    </Field>
  );
  //  }
};;
