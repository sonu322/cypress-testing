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

interface Props {
  onClose: () => void;
  autoRefresh: () => void;
}

// const ModalDialog = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   height: 300px;
// `;

// const ModalHeader = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 50px;
//   font-weight: bold;
//   font-size: 20px;
// `;

// const ModalBody = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   height: 200px;
// `;

// const ModalFooter = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 50px;
// `;

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
      await api.linkIssue(mainIssue, linkType, targetIssues);
      onClose();
      autoRefresh();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalDialog>
      <ModalHeader></ModalHeader>
      <ModalBody>
        <FormWrap>
          <Form onSubmit={() => console.log("submit")}>
            {({ formProps, submitting }) => (
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
