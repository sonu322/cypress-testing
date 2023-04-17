import React from "react";
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
const FlexContainer = styled.div`
  display: flex;
  gap: 8px;
  line-height: 32px;
`;

interface Props {
  updateSelectedJQLString: (value: string) => void;
  selectedJQLString: string;
  handleNewError: (error: unknown) => void;
  showCustomJQLEditor?: () => void;
  handleInputChange: (name: any, value: any, type?: any) => void;
}
export const JQLField: React.FC<Props> = ({
  selectedJQLString,
  handleInputChange,
  handleNewError,
  showCustomJQLEditor,
}) => {
  const { t } = useTranslation();
  const updateSelectedJQLString = (filterId: string): void => {
    handleInputChange("jql", filterId);
  };
  return (
    <Field name="jql" label={"JQL"}>
      {({ fieldProps, error }) => {
        console.log("field props for new comp", fieldProps);
        return (
          <>
            <FlexContainer>
              <JQLSelectDropdown
                selectedFilterId={selectedJQLString}
                updateSelectedFilterId={updateSelectedJQLString}
                handleNewError={handleNewError}
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
