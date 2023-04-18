import React from "react";
import styled from "styled-components";
import { JQLEditor } from "../JQLEditor";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { Field, ErrorMessage } from "@atlaskit/form";
import { useTranslation } from "react-i18next";
const FlexContainer = styled.div`
  display: flex;
  gap: 8px;
  line-height: 32px;
`;

interface Props {
  selectedJQLString: string;
  handleApiError: (error: Error) => void;
  showCustomJQLEditor?: () => void;
  handleInputChange: (name: any, value: any, type?: any) => void;
  isRequired: boolean;
}
export const JQLField: React.FC<Props> = ({
  selectedJQLString,
  handleInputChange,
  handleApiError,
  showCustomJQLEditor,
  isRequired,
}) => {
  const { t } = useTranslation();
  const updateSelectedJQLString = (filterId: string): void => {
    handleInputChange("jql", filterId);
  };
  return (
    <Field name="jql" label={"JQL"} isRequired={isRequired}>
      {({ error }) => {
        return (
          <>
            <FlexContainer>
              <JQLSelectDropdown
                selectedFilterId={selectedJQLString}
                updateSelectedFilterId={updateSelectedJQLString}
                handleNewError={handleApiError}
              />
              <span>{t("otpl.lxp.traceability-report.toolbar.or")}</span>
              <JQLEditor
                selectedFilterId={selectedJQLString}
                updateSelectedFilterId={updateSelectedJQLString}
                showCustomJQLEditor={showCustomJQLEditor}
              />
            </FlexContainer>
            {Boolean(error) && <ErrorMessage>{error}</ErrorMessage>}
          </>
        );
      }}
    </Field>
  );
};
