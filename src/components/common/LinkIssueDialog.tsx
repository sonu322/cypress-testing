import React, { useContext, useEffect, useState } from "react";
import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@atlaskit/modal-dialog";
import Button from "@atlaskit/button";
import styled from "styled-components";
import { IssueSearchField } from "./IssueSearchField";
import Form, { FormSection } from "@atlaskit/form";
import Select from "@atlaskit/select";
import { APIContext } from "../../context/api";
import Spinner from "@atlaskit/spinner";
import Banner from "@atlaskit/banner";
import ErrorIcon from "@atlaskit/icon/glyph/error";

interface Props {
  onClose: () => void;
  autoRefresh: () => void;
}

const FormWrap = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px;
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Label = styled.label`
  width: 150px;
  margin-right: 6px;
  font-weight: bold;
`;

const TextFieldWrapper = styled.div`
  width: 70%;
`;

const ErrorBanner = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const LinkIssueDialog = ({
  onClose,
  autoRefresh,
}: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };
  const api = useContext(APIContext);
  const [mainIssue, setMainIssue] = useState<string>("");
  const [linkType, setLinkType] = useState<string>("");
  const [targetIssues, setTargetIssues] = useState<string[]>([]);
  const [linkTypesOptions, setLinkTypesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkFieldsFilled = () => {
    if (mainIssue !== "" && linkType !== "" && targetIssues.length > 0) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };

  useEffect(() => {
    const fetchLinkTypes = async () => {
      try {
        const result = await api.getIssueLinkTypes(true);
        setLinkTypesOptions(
          result.map((option) => ({
            label: option.name,
            value: option.id,
          }))
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchLinkTypes();
  }, []);

  useEffect(() => {
    checkFieldsFilled();
  }, [mainIssue, linkType, targetIssues]);

  const handleLinkClick = async () => {
    setIsLoading(true);
    try {
      const existingLink = await api.checkLinkExists(
        mainIssue,
        linkType,
        targetIssues
      );
      if (existingLink !== null) {
        const selectedLinkType = linkTypesOptions.find(
          (option) => option.value === linkType
        );
        const linkTypeName = selectedLinkType ? selectedLinkType.label : "";
        setErrorMessage(
          `The link type '${linkTypeName}' already exists between issues '${existingLink}'.`
        );
      } else {
        await api.linkIssue(mainIssue, linkType, targetIssues);
        onClose();
        autoRefresh();
      }
    } catch (e) {
      setErrorMessage("An error occurred while checking the link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalDialog>
      <ModalHeader>
        <ErrorBanner>
          {errorMessage && (
            <Banner
              icon={<ErrorIcon label="Error" />}
              isOpen={true}
              appearance="error"
            >
              {errorMessage}
            </Banner>
          )}
        </ErrorBanner>
      </ModalHeader>
      <ModalBody>
        <FormWrap>
          <Form onSubmit={() => {}}>
            {({ formProps }) => (
              <form {...formProps}>
                <FormSection>
                  <FieldWrapper>
                    <Label htmlFor="main-issue">Main Issue</Label>
                    <TextFieldWrapper>
                      <IssueSearchField
                        isMultiValued={false}
                        onSearch={handleSearch}
                        searchQuery={searchQuery}
                        onChange={(issue) => setMainIssue(issue)}
                      />
                    </TextFieldWrapper>
                  </FieldWrapper>
                </FormSection>
                <FormSection>
                  <FieldWrapper>
                    <Label htmlFor="link-type">Link Type</Label>
                    <TextFieldWrapper>
                      <Select
                        options={linkTypesOptions}
                        placeholder="Select link type"
                        onChange={(option) => setLinkType(option.value)}
                      />
                    </TextFieldWrapper>
                  </FieldWrapper>
                </FormSection>
                <FormSection>
                  <FieldWrapper>
                    <Label htmlFor="target-issues">Target Issues</Label>
                    <TextFieldWrapper>
                      <IssueSearchField
                        isMultiValued={true}
                        onSearch={handleSearch}
                        searchQuery={searchQuery}
                        onChange={(issueKeys) => setTargetIssues(issueKeys)}
                      />
                    </TextFieldWrapper>
                  </FieldWrapper>
                </FormSection>
              </form>
            )}
          </Form>
        </FormWrap>
      </ModalBody>
      <ModalFooter>
        <Button
          appearance={allFieldsFilled ? "primary" : "subtle"}
          onClick={handleLinkClick}
          isDisabled={!allFieldsFilled}
        >
          {isLoading ? <Spinner size="small" appearance="invert" /> : "Link"}
        </Button>
        <Button appearance="subtle" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalDialog>
  );
};
