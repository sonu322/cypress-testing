// import React from "react";
// import ModalDialog, { ModalFooter, ModalHeader } from "@atlaskit/modal-dialog";
// import Button from "@atlaskit/button";
// import TextField from "@atlaskit/textfield";

// interface Props {
//   onClose: () => void;
// }

// export const LinkIssueDialog = ({ onClose }: Props) => {
//   return (
//     <ModalDialog onClose={onClose}>
//       {/* <ModalHeader>Link Issue</ModalHeader> */}
//       <form>
//         <div>
//           <label htmlFor="main-issue">Main Issue</label>
//           <TextField id="main-issue" placeholder="Search for issue" />
//         </div>
//         <div>
//           <label htmlFor="link-type">Link Type</label>
//           <TextField id="link-type" placeholder="Enter link type" />
//         </div>
//         <div>
//           <label htmlFor="target-issues">Target Issues</label>
//           <TextField id="target-issues" placeholder="Search target issues" />
//         </div>
//       </form>
//       <ModalFooter>
//         <Button appearance="primary" onClick={onClose}>
//           Link
//         </Button>
//         <Button appearance="subtle" onClick={onClose}>
//           Cancel
//         </Button>
//       </ModalFooter>
//     </ModalDialog>
//   );
// };

import React, { useState } from "react";

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@atlaskit/modal-dialog";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import styled from "styled-components";
import { IssueSearchField } from "./IssueSearchField";
//
import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
} from "@atlaskit/form";
// try
// interface Props {
//   onClose: () => void;
// }

// const FormWrap = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
//   margin: 16px;
// `;

// const FieldWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
// `;

// const Label = styled.label`
//   width: 150px;
//   margin-right: 16px;
// `;

// export const LinkIssueDialog = ({ onClose }: Props): JSX.Element => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const handleSearch = (query: string) => {
//     setSearchQuery(query.toLowerCase());
//   };
//   return (
//     <ModalDialog onClose={onClose}>
//       <ModalHeader></ModalHeader>
//       <ModalBody>
//         <FormWrap>
//           <Form onSubmit={() => console.log("submit")}>
//             {({ formProps, submitting }) => (
//               <form {...formProps}>
//                 <FormSection>
//                   <FieldWrapper>
//                     <Label htmlFor="main-issue">Main Issue</Label>
//                     <IssueSearchField
//                       isMultiValued={true}
//                       onSearch={handleSearch}
//                       searchQuery={searchQuery}
//                     />
//                   </FieldWrapper>
//                 </FormSection>
//                 <FormSection>
//                   <FieldWrapper>
//                     <Label htmlFor="link-type">Link Type</Label>
//                     <Field name="linkType" defaultValue="">
//                       {({ fieldProps }) => (
//                         <TextField
//                           {...fieldProps}
//                           placeholder="Enter link type"
//                           style={{ width: "50%" }}
//                         />
//                       )}
//                     </Field>
//                   </FieldWrapper>
//                 </FormSection>
//                 <FormSection>
//                   <FieldWrapper>
//                     <Label htmlFor="target-issues">Target Issues</Label>
//                     <IssueSearchField
//                       isMultiValued={true}
//                       onSearch={handleSearch}
//                       searchQuery={searchQuery}
//                     />
//                   </FieldWrapper>
//                 </FormSection>
//               </form>
//             )}
//           </Form>
//         </FormWrap>
//       </ModalBody>
//       <ModalFooter>
//         <Button appearance="primary" onClick={onClose}>
//           Link
//         </Button>
//         <Button appearance="subtle" onClick={onClose}>
//           Cancel
//         </Button>
//       </ModalFooter>
//     </ModalDialog>
//   );
// };

interface Props {
  onClose: () => void;
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
  margin-right: 16px;
`;

const TextFieldWrapper = styled.div`
  width: 50%;
`;

export const LinkIssueDialog = ({ onClose }: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
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
                        isMultiValued={true}
                        onSearch={handleSearch}
                        searchQuery={searchQuery}
                      />
                    </TextFieldWrapper>
                  </FieldWrapper>
                </FormSection>
                <FormSection>
                  <FieldWrapper>
                    <Label htmlFor="link-type">Link Type</Label>
                    <TextFieldWrapper>
                      <Field name="linkType" defaultValue="">
                        {({ fieldProps }) => (
                          <TextField
                            {...fieldProps}
                            placeholder="Enter link type"
                            style={{ width: "100%" }}
                          />
                        )}
                      </Field>
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
        <Button appearance="primary" onClick={onClose}>
          Link
        </Button>
        <Button appearance="subtle" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalDialog>
  );
};

// later
// return (
//   <ModalDialog onClose={onClose}>
//     <ModalHeader></ModalHeader>
//     <ModalBody>
//       <Form>
//         <FieldWrapper>
//           <Label htmlFor="main-issue">Main Issue</Label>
//           <IssueSearchField
//             isMultiValued={true}
//             onSearch={handleSearch}
//             searchQuery={searchQuery}
//           />
//         </FieldWrapper>
//         <FieldWrapper>
//           <Label htmlFor="link-type">Link Type</Label>
//           <TextField
//             id="link-type"
//             placeholder="Enter link type"
//             style={{ width: "50%" }}
//           />
//         </FieldWrapper>
//         <FieldWrapper>
//           <Label htmlFor="target-issues">Target Issues</Label>
//           <IssueSearchField
//             isMultiValued={true}
//             onSearch={handleSearch}
//             searchQuery={searchQuery}
//           />
//         </FieldWrapper>
//       </Form>
//     </ModalBody>
//     <ModalFooter>
//       <Button appearance="primary" onClick={onClose}>
//         Link
//       </Button>
//       <Button appearance="subtle" onClick={onClose}>
//         Cancel
//       </Button>
//     </ModalFooter>
//   </ModalDialog>
// );
