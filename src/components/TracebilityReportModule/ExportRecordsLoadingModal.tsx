import React from "react";
import styled from "styled-components";
import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import Spinner from "@atlaskit/spinner";
import Heading from "@atlaskit/heading";

interface Props {
  isExportReportLoading: boolean;
}

const SpinnerContainer = styled.span`
  display: flex;
  min-width: 24px;
  width: 24px;
  height: 64px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

const ModalBodyContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const ExportRecordsLoadingModal = ({
  isExportReportLoading,
}: Props): JSX.Element => {
  return (
    <ModalTransition>
      {isExportReportLoading && (
        <Modal width={"small"}>
          <ModalBody>
            <ModalBodyContainer>
              <Heading level="h500">Exporting Records</Heading>
              <Heading level="h200">
                This operation may take some time depending upon the number of
                records. Please wait...
              </Heading>
              <SpinnerContainer>
                <Spinner size={"large"} />
              </SpinnerContainer>
            </ModalBodyContainer>
          </ModalBody>
        </Modal>
      )}
    </ModalTransition>
  );
};
